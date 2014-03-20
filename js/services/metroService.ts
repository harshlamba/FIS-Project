/// <reference path="../global.ts" />
module Services {
    export interface IMetroService {
        /**
         * Gets all rail stations.
         * @returns {ng.IPromise<Metronome.Model.RailStation[]>}
         */
        getRailStations(): ng.IPromise<Metronome.Model.RailStation[]>;
    }

    class MetroService implements IMetroService {
        private static API_BASE_PARAMS:string = '?api_key=hnf2tnnvmsvykdvcrt36wqg8&callback=JSON_CALLBACK';
        private static API_URL_PREFIX:string = 'http://api.wmata.com';

        private railStations:Metronome.Model.RailStation[] = [];

        // this $inject is required to ensure minification does not break the dependency injection -- values must match the constructor arguments
        static $inject = ['$http', '$log', '$q'];

        constructor(private $http:ng.IHttpService, private $log:ng.ILogService, private $q:ng.IQService) {
        }

        public getRailStations() {
            if (this.railStations.length > 0) {
                // we've already loaded the rail stations so just return them in a promise
                var deferred = this.$q.defer();
                deferred.resolve(this.railStations);
                return deferred.promise;
            }

            this.$log.debug("getting rail stations");
            var getStationsUrl = MetroService.API_URL_PREFIX + '/Rail.svc/json/jStations' + MetroService.API_BASE_PARAMS;
            var _railStations = this.railStations;
            return this.$http.jsonp(getStationsUrl).then(
                function (response:{ data: {Stations:Metronome.Model.RailStation[]} }) {
                    _railStations.push.apply(_railStations, response.data.Stations);
                    return _railStations;
                }
            );
        }
    }

    Metronome.App.Services.service("metroService", MetroService);
}
