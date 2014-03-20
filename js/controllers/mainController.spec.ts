/// <reference path='../global.ts'/>
/// <reference path='../mocks/mockData.ts'/>
/// <reference path='../mocks/mockServices.ts'/>
/// <reference path='mainController.ts'/>
describe("MainController", function () {
    var $scope:Metronome.IMainControllerScope;
    var mainController:Metronome.MainController;

    beforeEach(() => {
        module('metronome.controllers');

        inject(($controller, $filter, $log, _$rootScope_, $q, _$rootElement_) => {
            $scope = <Metronome.IMainControllerScope>_$rootScope_.$new();

            mainController = $controller("mainController", {
                $scope: $scope,
                $filter: $filter,
                $log: $log,
                couponService: new Services.Mocks.MockCouponService($q),
                locationService: new Services.Mocks.MockLocationService($q),
                metroService: new Services.Mocks.MockMetroService($q),
                mapService: new Services.Mocks.MockMapService(_$rootElement_),
                alertService: new Services.Mocks.MockAlertService()
            });

            // the "controller as" syntax in the ng-controller directive in the template (maps.html) sets this "vm"
            // property, but since we are not not using the template in the test, we will set it manually
            $scope.vm = mainController;

            $scope.vm.couponService.deals = MockData.Deal.deals;
        });
    });

    describe("currentDealPage watch", function () {
        it("should change current deal", function () {
            $scope.vm.couponService.currentDeal = MockData.Deal.deals[0];
            $scope.vm.couponService.currentDealPage = 2;

            // force scope watchers to fire
            $scope.$digest();

            expect($scope.vm.couponService.currentDeal).toNotEqual(MockData.Deal.deals[0]);
        });
    });

    describe("onDealMarkerClicked method", function () {
        it("should invoke services to get deal data from marker, set current deal, and open deal info window", function () {
            spyOn($scope.vm.mapService, "getDealFromMarker");
            spyOn($scope.vm.mapService, "openDealWindow");
            spyOn($scope.vm.couponService, "setCurrentDeal");

            var marker = new google.maps.Marker();
            mainController.onDealMarkerClicked(marker);

            expect($scope.vm.mapService.getDealFromMarker).toHaveBeenCalledWith(marker);
            expect($scope.vm.couponService.setCurrentDeal).toHaveBeenCalled();
            expect($scope.vm.mapService.openDealWindow).toHaveBeenCalledWith(marker);
        });
    });

    describe("onDealStoreClicked method", function () {
        it("should invoke services to set current deal and open deal info window", function () {
            spyOn($scope.vm.couponService, "setCurrentDeal");
            spyOn($scope.vm.mapService, "goToDeal");

            var deal = MockData.Deal.deals[0];
            mainController.onDealStoreClicked(deal);

            expect($scope.vm.couponService.setCurrentDeal).toHaveBeenCalledWith(deal);
            expect($scope.vm.mapService.goToDeal).toHaveBeenCalledWith(deal);
        });
    });

    describe("onMapChanged method", function () {
        it("should invoke services to set current deal and open deal info window", function () {
            spyOn($scope.vm.mapService, "isRefreshNeeded").andReturn(true);
            // TODO: spying on our services replaces our mock service with a Jasmine proxy so we need to find another
            // way to detect whether our service methods are called
//            spyOn($scope.vm.couponService, "getDeals");
//            spyOn($scope.vm.metroService, "getRailStations");

            mainController.onMapChanged();
            $scope.$apply();

            expect($scope.vm.mapService.isRefreshNeeded).toHaveBeenCalled();
//            expect($scope.vm.couponService.getDeals).toHaveBeenCalled();
//            expect($scope.vm.metroService.getRailStations).toHaveBeenCalled();
        });
    });

});
