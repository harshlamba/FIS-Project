/// <reference path="../global.ts" />
/// <reference path="../services/mapService.ts" />
module Services {
    export interface ICouponService {
        deals:Metronome.Model.Deal[];
        mappedDeals:Metronome.Model.Deal[];
        listedDeals:Metronome.Model.Deal[];
        currentDeal:Metronome.Model.Deal;
        currentDealPage:number;
        dealOrderBy:string;
        dealFilterCriteria:string;
        categoryFilterCriteria:Metronome.Model.DealCategoryFilterCriteria;

        /**
         * Gets deals within <tt>radius</tt> miles of <tt>lat</tt> / <tt>lon<</tt>.
         * @param lat latitude of center point
         * @param lon longitude of center point
         * @param radius miles from center point (limited to 10)
         * @param limit maximum number of deals to get (limited to 1000)
         * @returns {ng.IPromise<Metronome.Model.Deal[]>}
         */
        getDeals(lat:number, lon:number, radius:number, limit:number): ng.IPromise<Metronome.Model.Deal[]>;

        /**
         * Gets (almost) all possible deal categories. Note that some deals may have a null or "0" category id,
         * but those are not included.
         * @returns {ng.IPromise<Metronome.Model.DealCategory[]>}
         */
        getDealCategories(): ng.IPromise<Metronome.Model.DealCategory[]>;

        getDealCategoryName(deal:Metronome.Model.Deal):string;
        getDealById(dealId:string):Metronome.Model.Deal;
        getDealsByCurrentStore():Metronome.Model.Deal[];
        updateDealsModel(loadedDeals:Metronome.Model.Deal[]):void;
        getDealsByStore(storeId:number):Metronome.Model.Deal[];
        sortVisibleDeals():void;
        nextDealsListPage():void;
        setCurrentDeal(deal:Metronome.Model.Deal):void;
    }

    // class is not exported so it is only visible to the Services module
    class CouponService implements ICouponService {
        public deals:Metronome.Model.Deal[] = [];
        public mappedDeals:Metronome.Model.Deal[] = [];
        public listedDeals:Metronome.Model.Deal[] = [];
        public currentDeal:Metronome.Model.Deal;
        public currentDealPage:number;
        public dealOrderBy:string;
        public dealFilterCriteria:string;
        public categoryFilterCriteria:Metronome.Model.DealCategoryFilterCriteria = {};

        private dealCategories:Metronome.Model.DealCategory[] = [];
        private dealsByStoreId:{
            [storeId: string]: Metronome.Model.Deal[]
        } = {};
        private dealsByDealId:{
            [dealId: string]: Metronome.Model.Deal
        } = {};

        private static API_BASE_PARAMS:string = '?key=c17a51a99f0d842ba0dc6c757962c48d3e66a2230084882ea06e698e84ff7a0426360b2d71b298e5b171828869e7a467&callback=JSON_CALLBACK';
        private static API_URL_PREFIX:string = 'http://api.8coupons.com/v1';

        // this $inject is required to ensure minification does not break the dependency injection -- values must match the constructor arguments
        static $inject = ['$http', '$log', '$filter', '$q', 'mapService'];

        // The constructor injects dependent Angular services into this service.
        // The 'private' keyword on the constructor is a 'parameter property declaration' which implicitly creates a
        // member field of the same name and sets the value to the parameter value (see section 8.3.1 of the TypeScript specification).
        constructor(private $http:ng.IHttpService, private $log:ng.ILogService, private $filter:ng.IFilterService,
                    private $q:ng.IQService, private mapService:IMapService) {
            this.dealOrderBy = "name";
        }

        public getDeals(lat:number, lon:number, radius:number, limit:number) {
            this.$log.debug("getting coupon deals for lat=" + lat + " lon=" + lon + " radius=" + radius);
            radius = Math.min(10, radius);
            limit = Math.min(1000, limit);
            var getDealsUrl = CouponService.API_URL_PREFIX + '/getdeals' + CouponService.API_BASE_PARAMS +
                '&lat=' + lat + '&lon=' + lon + '&mileradius=' + radius + '&limit=' + limit + '&orderby=radius';
            return this.$http.jsonp(getDealsUrl).then(
                function (response) {
                    return response.data;
                }
            );
        }

        public getDealCategories() {
            if (this.dealCategories.length > 0) {
                // we've already loaded the categories so just return them in a promise
                var deferred = this.$q.defer();
                deferred.resolve(this.dealCategories);
                return deferred.promise;
            }

            var getCategoriesUrl = CouponService.API_URL_PREFIX + '/getcategory' + CouponService.API_BASE_PARAMS;
            var _dealCategories = this.dealCategories;
            return this.$http.jsonp(getCategoriesUrl).then(
                function (response) {
                    _dealCategories.push.apply(_dealCategories, response.data);
                    return _dealCategories;
                }
            );
        }

        public getDealCategoryName(deal:Metronome.Model.Deal) {
            if (deal.categoryID == null) {
                return "Miscellaneous";
            }
            var categories:Metronome.Model.DealCategory[] = this.dealCategories.filter(
                function (category:Metronome.Model.DealCategory) {
                    return category.categoryID == deal.categoryID;
                }
            );
            return categories.length == 1 ? categories[0].category : "Category " + deal.categoryID;
        }

        public getDealById(dealId:string) {
            return this.dealsByDealId[dealId];
        }

        public getDealsByStore(storeId:number) {
            if (angular.isUndefined(storeId)) {
                return [];
            }

            // this function is called VERY frequently so for better performance
            // we are using a map instead of a filter to find the deals per store
            //return this.mappedDeals.filter( function (deal:Metronome.Model.Deal) { return deal.storeID == storeId; } );
            var dealsForStore = this.dealsByStoreId[storeId];
            return dealsForStore ? dealsForStore : [];
        }

        public getDealsByCurrentStore() {
            if (angular.isUndefined(this.currentDeal)) {
                return [];
            }
            return this.getDealsByStore(this.currentDeal.storeID);
        }

        public setCurrentDeal(deal:Metronome.Model.Deal) {
            this.currentDeal = deal;
            this.currentDealPage = 1;
        }


        /**
         * Sort visible deals by user's sort criteria (primary) and deal ID (secondary).
         * We sort the deals in the model here instead of using a filter to sort them in the view so that we
         * can easily append deals from mappedDeals to listedDeals when infinite scrolling occurs. We also sort the
         * deals after we fetch more deals.
         */
        public sortVisibleDeals() {
            this.mappedDeals = this.$filter('orderBy')(this.mappedDeals, [this.dealOrderBy, "name"]);
            this.listedDeals = this.mappedDeals.slice(0, this.listedDeals.length);
            this.$log.debug("sortVisibleDeals listed=" + this.listedDeals.length + " visible=" + this.mappedDeals.length + " orderBy=" + this.dealOrderBy);
        }

        public nextDealsListPage() {
            var LISTED_DEAL_SCROLL_PAGE_SIZE = 50;
            this.listedDeals = this.listedDeals.concat(this.mappedDeals.slice(this.listedDeals.length, this.listedDeals.length + LISTED_DEAL_SCROLL_PAGE_SIZE));
            this.$log.debug("nextDealsListPage listed=" + this.listedDeals.length + " visible=" + this.mappedDeals.length);
        }

        public updateDealsModel(loadedDeals:Metronome.Model.Deal[]) {
            this.deals = this.$filter('unique')(this.deals.concat(loadedDeals), 'ID');

            this.listedDeals = [];
            this.dealsByStoreId = {};
            this.dealsByDealId = {};

            // create map of deals by store id and deals by deal id
            for (var i = 0; i < this.deals.length; i++) {
                var deal = this.deals[i];

                var dealsForStore = this.dealsByStoreId[deal.storeID];
                if (angular.isUndefined(dealsForStore)) {
                    dealsForStore = [];
                    this.dealsByStoreId[deal.storeID] = dealsForStore;
                }
                dealsForStore.push(deal);

                this.dealsByDealId[deal.ID] = deal;
            }

            // TODO: move this to the controller and remove mapService dependency?
            this.mappedDeals = this.mapService.getDealsWithinMapBounds(this.deals);

            this.sortVisibleDeals();
            this.nextDealsListPage();

            this.$log.debug("added deals: visible=" + this.mappedDeals.length +
                " lastLoad=" + loadedDeals.length + " total=" + this.deals.length);
        }

    }

    Metronome.App.Services.service("couponService", CouponService);
}
