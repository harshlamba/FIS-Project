/// <reference path='../global.ts'/>
/// <reference path='../mocks/mockData.ts'/>
/// <reference path='locationService.ts'/>
describe("LocationService", () => {
    var locationService:Services.ILocationService;
    var $rootScope:ng.IRootScopeService;

    beforeEach(() => {
        module('metronome.services');

        inject((_locationService_, _$rootScope_) => {
            locationService = _locationService_;
            $rootScope = _$rootScope_;
        });
    });

    describe("getLocation method", () => {
        it("should return location successfully", () => {
            var expectedPosition:Position = <Position>{ coords: <Coordinates>{ latitude: 32, longitude: -96 } };
            spyOn(navigator.geolocation, "getCurrentPosition").andCallFake(function () {
                arguments[0](expectedPosition);
            });

            var result = executeGetLocation();
            expect(result).toEqual(expectedPosition);
        });

        it("should fail to get location", () => {
            var expectedError = "error message";
            spyOn(navigator.geolocation, "getCurrentPosition").andCallFake(function () {
                arguments[1](expectedError);
            });
            var result = executeGetLocation();
            expect(result).toBe(expectedError);
        });

        function executeGetLocation() {
            var promise = locationService.getLocation();
            var result:any = null;
            promise.then(
                function (position) {
                    result = position;
                },
                function (error) {
                    result = error;
                }
            );

            // the then() method on the promise executes asynchronously so we need to call $apply() to
            // wait for the method to finish executing (see http://docs.angularjs.org/api/ng.$q)
            $rootScope.$apply();

            return result;
        }
    });
});