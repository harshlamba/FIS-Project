/// <reference path='../global.ts'/>
/// <reference path='../mocks/mockData.ts'/>
/// <reference path='../mocks/mockServices.ts'/>
/// <reference path='couponService.ts'/>

describe("CouponService", () => {
    var couponService:Services.ICouponService;
    var $httpBackend:ng.IHttpBackendService;

    beforeEach(() => {
        module('metronome.services');

        // tell injector to use the mock map service instead of the real one
        module(function ($provide) {
            var rootElement = angular.element('<div ng-app></div>'); // TODO: get this another way?
            $provide.value('mapService', new Services.Mocks.MockMapService(rootElement));
        });

        inject((_couponService_, _$httpBackend_) => {
            couponService = _couponService_;
            $httpBackend = _$httpBackend_;

            couponService.deals = MockData.Deal.deals;
        });

    });

    afterEach(() => {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
        $httpBackend.resetExpectations();
    });

    describe("getDeals method", () => {
        it("should return deals with max radius 10", () => {
            var lat = 12;
            var lon = 34;
            var limit = 20;
            var inputRadius = 15;
            var expectedRadius = 10;
            $httpBackend.expectJSONP('http://api.8coupons.com/v1' + '/getdeals' +
                    '?key=c17a51a99f0d842ba0dc6c757962c48d3e66a2230084882ea06e698e84ff7a0426360b2d71b298e5b171828869e7a467&callback=JSON_CALLBACK' +
                    '&lat=' + lat + '&lon=' + lon +
                    '&mileradius=' + expectedRadius + '&limit=' + limit + '&orderby=radius')
                .respond(MockData.Deal.deals);
            couponService.getDeals(lat, lon, inputRadius, limit).then(
                function (deals) {
                    expect(deals).toEqual(MockData.Deal.deals);
                }
            );

            $httpBackend.flush();
        });
    });

    describe("getDealCategories method", () => {
        it("should return deal categories", () => {
            $httpBackend.expectJSONP('http://api.8coupons.com/v1' + '/getcategory' +
                    '?key=c17a51a99f0d842ba0dc6c757962c48d3e66a2230084882ea06e698e84ff7a0426360b2d71b298e5b171828869e7a467&callback=JSON_CALLBACK')
                .respond(MockData.DealCategory.dealCategories);
            couponService.getDealCategories().then(
                function (dealCategories) {
                    expect(dealCategories).toEqual(MockData.DealCategory.dealCategories);
                }
            );

            $httpBackend.flush();

            // should return name of deal category
            var dealCategoryName = couponService.getDealCategoryName(couponService.deals[0]);
            expect(dealCategoryName).toBe(MockData.DealCategory.dealCategories[0].category);
        });
    });

    describe("getDealsByStore method", function () {
        beforeEach(() => {
            couponService.updateDealsModel(MockData.Deal.deals);
            couponService.currentDeal = MockData.Deal.deals[0];
        });

        it("should return deals at store id", function () {
            var deals = couponService.getDealsByStore(couponService.deals[0].storeID);
            expect(deals.length).toBe(1);
            expect(deals[0].storeID).toBe(couponService.deals[0].storeID);
        });

        it("should return empty deals list for undefined store id", function () {
            var deals = couponService.getDealsByStore(null);
            expect(deals.length).toBe(0);
        });
    });


});