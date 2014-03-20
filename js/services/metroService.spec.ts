/// <reference path='../global.ts'/>
/// <reference path='../mocks/mockData.ts'/>
/// <reference path='metroService.ts'/>

describe("MetroService", () => {
    var metroService:Services.IMetroService;
    var $httpBackend:ng.IHttpBackendService;

    beforeEach(() => {
        module('metronome.services');

        inject((_metroService_, _$httpBackend_) => {
            metroService = _metroService_;
            $httpBackend = _$httpBackend_;
        });
    });

    afterEach(() => {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
        $httpBackend.resetExpectations();
    });

    describe("getRailStations method", () => {
        it("should return all rail stations", () => {
            $httpBackend.expectJSONP('http://api.wmata.com' + '/Rail.svc/json/jStations' +
                    '?api_key=hnf2tnnvmsvykdvcrt36wqg8&callback=JSON_CALLBACK')
                .respond({Stations: MockData.RailStation.railStations});
            metroService.getRailStations().then(
                function (railStations) {
                    expect(railStations).toEqual(MockData.RailStation.railStations);
                }
            );

            $httpBackend.flush();
        });
    });
});