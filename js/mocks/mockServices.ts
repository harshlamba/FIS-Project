/// <reference path="../global.ts" />
/// <reference path="../services/couponService.ts" />
/// <reference path="../services/locationService.ts" />
/// <reference path="../services/metroService.ts" />
/// <reference path="../services/mapService.ts" />
/// <reference path="../services/alertService.ts" />
/// <reference path="mockData.ts" />
/// <reference path="mockGoogleMap.ts" />
module Services.Mocks {
    export class MockLocationService implements Services.ILocationService {
        // this $inject is required to ensure minification does not break the dependency injection -- values must match the constructor arguments
        static $inject = ['$q'];

        constructor(private $q:ng.IQService) {
        }

        public getLocation() {
            var deferred = this.$q.defer();
            var position:Position = <Position>{ coords: <Coordinates>{ latitude: 32, longitude: -96 } };
            deferred.resolve(position);
            return deferred.promise;
        }
    }
    Metronome.App.Services.service("locationService", MockLocationService);

    export class MockCouponService implements Services.ICouponService {
        public deals:Metronome.Model.Deal[] = [];
        public mappedDeals:Metronome.Model.Deal[] = [];
        public listedDeals:Metronome.Model.Deal[] = [];
        public dealCategories:Metronome.Model.DealCategory[] = [];
        public currentDeal:Metronome.Model.Deal;
        public currentDealPage:number;
        public dealOrderBy:string;
        public dealFilterCriteria:string;
        public categoryFilterCriteria:Metronome.Model.DealCategoryFilterCriteria;

        // this $inject is required to ensure minification does not break the dependency injection -- values must match the constructor arguments
        static $inject = ['$q'];

        constructor(private $q:ng.IQService) {
        }

        public getDeals(lat:number, lon:number, radius:number, limit:number) {
            var deferred = this.$q.defer();
            deferred.resolve(MockData.Deal.deals);
            return deferred.promise;
        }

        public getDealCategories() {
            var deferred = this.$q.defer();
            deferred.resolve(MockData.DealCategory.dealCategories);
            return deferred.promise;
        }

        public getDealCategoryName(deal:Metronome.Model.Deal) {
            return "";
        }

        public getDealById(dealId:string) {
            return this.deals[0];
        }

        public getDealsByCurrentStore() {
            return this.deals;
        }

        public setCurrentDeal() {
        }

        public updateDealsModel(loadedDeals:Metronome.Model.Deal[]) {
        }

        public  getDealsByStore(storeId:number) {
            return this.deals;
        }

        public sortVisibleDeals() {
        }

        public nextDealsListPage() {
        }
    }
    Metronome.App.Services.service("couponService", MockCouponService);

    export class MockMetroService implements Services.IMetroService {
        // this $inject is required to ensure minification does not break the dependency injection -- values must match the constructor arguments
        static $inject = ['$q'];

        constructor(private $q:ng.IQService) {
        }

        public getRailStations() {
            var deferred = this.$q.defer();
            deferred.resolve(MockData.RailStation.railStations);
            return deferred.promise;
        }
    }
    Metronome.App.Services.service("metroService", MockMetroService);


    export class MockMapService implements Services.IMapService {
        // this $inject is required to ensure minification does not break the dependency injection -- values must match the constructor arguments
        static $inject = ['$rootElement'];

        constructor(private $rootElement:ng.IRootElementService) {
            this.mapOptions = {
                center: new google.maps.LatLng(10, 10)
            };
            this.mapCenter = this.mapOptions.center;
            this.myMap = new google.maps.MockMap($rootElement[0], this.mapOptions);
            this.myInfoWindow = new google.maps.MockInfoWindow();
        }

        public myMap:google.maps.Map;
        public mapOptions:google.maps.MapOptions;
        public myInfoWindow:google.maps.InfoWindow;
        public dealMarkers:google.maps.Marker[] = [];
        public railStationMarkers:google.maps.Marker[] = [];
        public mapCenter:google.maps.LatLng;
        public initialized:boolean;

        public getMapUrl(deal:Metronome.Model.Deal) {
            return "";
        }

        public getDealFromMarker(marker:google.maps.Marker) {
            return <Metronome.Model.Deal>null;
        }

        public getDealsWithinMapBounds(deals:Metronome.Model.Deal[]) {
            return [];
        }

        public getMarkerByStoreId(storeId:number) {
            return this.dealMarkers[0];
        }

        public getMarkerIconByCategoryId(categoryId:string) {
            return "";
        }

        public isRefreshNeeded() {
            return false;
        }

        public showCurrentLocation() {

        }

        public openDealWindow(marker:google.maps.Marker) {
        }

        public addDealMarkers(loadedDeals:Metronome.Model.Deal[]) {
        }

        public addRailStationMarkers(railStations:Metronome.Model.RailStation[]) {
        }

        public goToDeal(deal:Metronome.Model.Deal) {
        }

        public getMapRadius() {
            return 20;
        }
    }
    Metronome.App.Services.service("mapService", MockMapService);

    export class MockAlertService implements Services.IAlertService {
        alerts:Metronome.Model.Alert[];

        // this $inject is required to ensure minification does not break the dependency injection -- values must match the constructor arguments
        static $inject = [];

        constructor() {
        }

        addAlert(alertType:Metronome.Model.AlertType, message:string) {
        }

        removeAlert(message:string) {
        }

        closeAlert(index:number) {
        }
    }
    Metronome.App.Services.service("alertService", MockAlertService);

}