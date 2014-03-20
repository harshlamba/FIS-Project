/// <reference path="../global.ts" />
module Services {
    export interface ILocationService {
        /**
         * Gets current geographical location.
         * @returns {ng.IPromise<Position>}
         */
        getLocation(): ng.IPromise<Position>;
    }

    class LocationService implements ILocationService {
        // this $inject is required to ensure minification does not break the dependency injection -- values must match the constructor arguments
        static $inject = ['$q', '$log', '$rootScope'];

        constructor(private $q:ng.IQService, private $log:ng.ILogService, private $rootScope:ng.IScope) {
        }

        public getLocation() {
            var deferred = this.$q.defer();
            var rootScope = this.$rootScope;
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    function (pos) {
                        rootScope.$apply(function () {
                            deferred.resolve(angular.copy(pos));
                        })
                    },
                    function (error) {
                        rootScope.$apply(function () {
                            deferred.reject(error);
                        })
                    })
            }
            else {
                deferred.reject("Your browser doesn't support geolocation.");
            }

            return deferred.promise;
        }
    }

    Metronome.App.Services.service("locationService", LocationService);
}
