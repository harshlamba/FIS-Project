/// <reference path="../global.ts" />
/// <reference path="../i18n.ts" />
/// <reference path="../services/couponService.ts" />
/// <reference path="../services/locationService.ts" />
/// <reference path="../services/metroService.ts" />
/// <reference path="../services/mapService.ts" />
/// <reference path="../services/alertService.ts" />
module Metronome {
    export interface IMainController {
        // public class methods used by the template
        onDealMarkerClicked(marker:google.maps.Marker): void;
        onDealStoreClicked(deal:Metronome.Model.Deal): void;
        onMapChanged(): void;
    }

    export interface IMainControllerScope extends ng.IScope {
        // View functions and data are on the controller instead of directly on $scope.
        // The controller is added to $scope in this vm (View Model) property which is set by the "controller as"
        // syntax in the ng-controller directive in the template.
        // For explanation/details, see:
        //   http://notebookheavy.com/2013/07/29/angularjs-typescript-controller-view-model-tip/
        //   http://www.youtube.com/watch?v=WdtVn_8K17E
        //   http://www.youtube.com/watch?v=tTihyXaz4Bo
        //   http://stackoverflow.com/q/16619740
        //   https://groups.google.com/d/topic/angular/84selECbp1I/discussion
        //   http://docs.angularjs.org/api/ng.directive:ngController
        vm: MainController;

        // scope functions used by the template
        getDealCategoryName(deal:Model.Deal): string;
    }

    export class MainController implements IMainController {
        private NEW_YORK;

        // this $inject is required to ensure minification does not break the dependency injection -- values must match the constructor arguments
        static $inject = ['$scope', '$filter', '$log', 'couponService', 'locationService', 'metroService', 'mapService', 'alertService'];

        constructor(private $scope:IMainControllerScope, private $filter:ng.IFilterService, private $log:ng.ILogService,
                    public couponService:Services.ICouponService, private locationService:Services.ILocationService,
                    public metroService:Services.IMetroService, public mapService:Services.IMapService,
                    public alertService:Services.IAlertService) {
            // this is another way to set the controller into the scope, but we are using the "controller as" syntax
            // in the ng-controller directive in the template instead
            //$scope.vm = this;

            this.NEW_YORK = new google.maps.LatLng(40.7463, -73.9913);

            // handle page changes in deal info windows
            $scope.$watch('vm.couponService.currentDealPage', function (newValue, oldValue) {
                if (angular.isUndefined(newValue)) {
                    return;
                }
                couponService.currentDeal = couponService.getDealsByStore(couponService.currentDeal.storeID)[newValue - 1];

                // tell maps API to adjust info window size to fit content of new page
                mapService.myInfoWindow.setContent(mapService.myInfoWindow.getContent());
            });

            // this function is used by an orderBy filter so it needs to be on the $scope so that it can be accessed by
            // the filter and so that it can access the $filter and $scope variables which are local to the constructor
            $scope.getDealCategoryName = function (deal:Metronome.Model.Deal) {
                return couponService.getDealCategoryName(deal);
            };

            // the functions below are called by the promise chain below so they need to be local functions instead of class members
            // so that they can access the controller instance (the value of "this" inside the function is the window instead of the
            // controller instance)
            function showCurrentLocation() {
                // center map on current location
                mapService.showCurrentLocation();
            }

            function getDealCategories() {
                return couponService.getDealCategories().then(
                    (dealCategories) => {
                        alertService.removeAlert("ERRORS.ERROR_COUPON_LOAD");
                    },
                    (error) => {
                        alertService.addAlert(Model.AlertType.danger, "ERRORS.ERROR_CATEGORIES_LOAD");
                    }
                );
            }

            this.getLocation().
                then(showCurrentLocation).
                then(getDealCategories);
        }


        public onDealMarkerClicked(marker:google.maps.Marker) {
            this.couponService.setCurrentDeal(this.mapService.getDealFromMarker(marker));
            this.mapService.openDealWindow(marker);
        }

        public onDealStoreClicked(deal:Metronome.Model.Deal) {
            this.couponService.setCurrentDeal(deal);
            this.mapService.goToDeal(deal);
        }

        public onMapChanged() {
            if (this.mapService.isRefreshNeeded()) {
                this.showCoupons();
                this.showRailStations();
            }
        }

        private showCoupons() {
            var mapRadius = this.mapService.getMapRadius();
            return this.couponService.getDeals(this.mapService.mapCenter.lat(), this.mapService.mapCenter.lng(), mapRadius, 1000).then(
                // the callbacks here are Arrow Function Expressions (see section 4.9.2 of TypeScript Language
                // Specification) which preserves the value of 'this' from the surrounding context (the controller in this case)
                (deals) => {
                    this.mapService.addDealMarkers(deals)
                    this.couponService.updateDealsModel(deals);

                    this.alertService.removeAlert("ERRORS.ERROR_COUPON_LOAD");
                },
                (error) => {
                    this.alertService.addAlert(Model.AlertType.danger, "ERRORS.ERROR_COUPON_LOAD");
                }
            );
        }

        private showRailStations() {
            // load rail stations and add markers for them
            this.metroService.getRailStations().then(
                (railStations) => {
                    this.mapService.addRailStationMarkers(railStations);
                    this.alertService.removeAlert("ERRORS.ERROR_RAIL_STATIONS_LOAD");
                },
                (error) => {
                    this.alertService.addAlert(Model.AlertType.danger, "ERRORS.ERROR_RAIL_STATIONS_LOAD");
                }
            )
        }

        private getLocation() {
            return this.locationService.getLocation().then(
                (pos) => {
                    this.mapService.mapCenter = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
                    this.alertService.removeAlert("ERRORS.ERROR_LOCATION_FIND");
                },
                (error) => {
                    this.alertService.addAlert(Model.AlertType.danger, "ERRORS.en.ERROR_LOCATION_FIND");
                    this.mapService.mapCenter = this.NEW_YORK;
                })
        }

    }

    Metronome.App.Controllers.controller("mainController", MainController);
}