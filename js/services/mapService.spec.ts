/// <reference path='../global.ts'/>
/// <reference path='../mocks/mockData.ts'/>
/// <reference path='../mocks/mockGoogleMap.ts'/>
/// <reference path='mapService.ts'/>

describe("MapService", () => {
    var mapService:Services.IMapService;
    var $httpBackend:ng.IHttpBackendService;

    beforeEach(() => {
        module('metronome.services');

        inject((_mapService_, _$httpBackend_, _$rootElement_) => {
            mapService = _mapService_;
            mapService.mapOptions.center = new google.maps.LatLng(10, 10);
            mapService.myMap = new google.maps.MockMap(_$rootElement_[0], mapService.mapOptions);
            mapService.myInfoWindow = new google.maps.MockInfoWindow();
            $httpBackend = _$httpBackend_;
        });
    });

    afterEach(() => {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
        $httpBackend.resetExpectations();
    });

    describe("getMarkerIconByCategoryId method", function () {
        it("should return icon url for a valid deal category id", function () {
            var iconUrl = mapService.getMarkerIconByCategoryId(MockData.Deal.deals[0].categoryID);
            expect(iconUrl).toBe("img/restaurant.png");
        });

        it("should default return icon url for a null deal category id", function () {
            var iconUrl = mapService.getMarkerIconByCategoryId(null);
            expect(iconUrl).toBe("img/misc.png");
        });
    });

    describe("isRefreshNeeded method", function () {
        it("should check if map refresh is needed", function () {
            var refreshNeeded = mapService.isRefreshNeeded();

            expect(refreshNeeded).toEqual(true);
            expect(mapService.mapOptions.zoom).toEqual(mapService.myMap.getZoom());
        });
    });

    describe("addDealMarkers method", function () {
        it("should add deal markers to the map", function () {
            mapService.addDealMarkers(MockData.Deal.deals);
            expect(mapService.dealMarkers.length).toEqual(MockData.Deal.dealsUniqueStore.length);
            for (var i = 0; i < mapService.dealMarkers.length; i++) {
                var marker:google.maps.Marker = mapService.dealMarkers[i];
                var deal:Metronome.Model.Deal = marker.get("dealData");

                expect(deal).toBeTruthy();
                expect(marker.getPosition().lat()).toBeCloseTo(deal.lat, 2);
                expect(marker.getPosition().lng()).toBeCloseTo(deal.lon, 2);
                expect(marker.getTitle()).toEqual(deal.name);
                expect(marker.getIcon()).toEqual(mapService.getMarkerIconByCategoryId(deal.categoryID));
            }
        });
    });


    describe("deal info window", function () {
        it("should open deal info window", function () {
            var infoWindowMarker = new google.maps.Marker({
                map: mapService.myMap,
                position: new google.maps.LatLng(40.7463, -73.9913),
                title: "Test infoWindowMarker"
            });
            var deal1 = MockData.Deal.dealsInSameStore[0];
            infoWindowMarker.set("dealData", deal1);

            spyOn(mapService.myInfoWindow, "open");

            mapService.openDealWindow(infoWindowMarker);

            expect(mapService.myInfoWindow.open).toHaveBeenCalledWith(mapService.myMap, infoWindowMarker);
        });
    });

    describe("getMapRadius method", () => {
        it("should return map radius", () => {
            var bounds = new google.maps.LatLngBounds(new google.maps.LatLng(10, 20), new google.maps.LatLng(20, 30));
            var map = <google.maps.MockMap>mapService.myMap;
            map.bounds = bounds;
            var radius = mapService.getMapRadius();
            expect(radius).toBeCloseTo(478, 0);
        });

        it("should return null map radius", () => {
            var map = <google.maps.MockMap>mapService.myMap;
            delete map.bounds;
            var radius = mapService.getMapRadius();
            expect(radius).toBeNull();
        });
    });
});