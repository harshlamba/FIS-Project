/// <reference path="../global.ts" />
module Services {
    export interface IMapService {
        myMap:google.maps.Map;
        mapOptions:google.maps.MapOptions;
        myInfoWindow:google.maps.InfoWindow;
        dealMarkers:google.maps.Marker[];
        railStationMarkers:google.maps.Marker[];
        mapCenter:google.maps.LatLng;
        initialized:boolean;

        /**
         * Calculates radius in miles of the Google Map boundary.
         * @returns {number}
         */
        getMapRadius(): number;

        getMapUrl(deal:Metronome.Model.Deal): string;
        getDealFromMarker(marker:google.maps.Marker):Metronome.Model.Deal;
        getDealsWithinMapBounds(deals:Metronome.Model.Deal[]);
        getMarkerByStoreId(storeId:number): google.maps.Marker;
        getMarkerIconByCategoryId(categoryId:string) :string;
        isRefreshNeeded(): boolean;
        showCurrentLocation(): void;
        openDealWindow(marker:google.maps.Marker): void;
        addDealMarkers(loadedDeals:Metronome.Model.Deal[]):void;
        addRailStationMarkers(railStations:Metronome.Model.RailStation[]):void;
        goToDeal(deal:Metronome.Model.Deal):void;
    }

    declare class MarkerClusterer {
        constructor(map:google.maps.Map, markers?:google.maps.Marker[], options?:any);

        public addMarker(marker:google.maps.Marker, noDraw?:boolean);

        public addMarkers(markers:google.maps.Marker[], noDraw?:boolean);
    }

    class MapService implements IMapService {
        public myMap:google.maps.Map;
        public mapOptions:google.maps.MapOptions;
        public myInfoWindow:google.maps.InfoWindow;
        public dealMarkers:google.maps.Marker[] = [];
        public railStationMarkers:google.maps.Marker[] = [];
        public mapCenter:google.maps.LatLng;
        public initialized:boolean = false;

        private markerClusterer:MarkerClusterer;
        private disableNextMapRefresh:boolean = false;

        private dealMarkersByDealId:{
            [dealId: string]: google.maps.Marker
        } = {};

        private static DEAL_MARKER_DATA_KEY = "dealData";
        private static RAIL_STATION_DATA_KEY = "railStationData";

        private static MARKER_ICONS_BY_CATEGORY_ID:{
            [categoryId: string]: string
        } = {
            "1": "img/restaurant.png",
            "2": "img/entertainment.png",
            "3": "img/beauty.png",
            "4": "img/services.png",
            "6": "img/shopping.png",
            "7": "img/travel.png",
            "18381": "img/misc.png" // Groupon
        };

        // this $inject is required to ensure minification does not break the dependency injection -- values must match the constructor arguments
        static $inject = ['$log', '$filter'];

        constructor(private $log:ng.ILogService, private $filter:ng.IFilterService) {
            this.mapOptions = {
                zoom: 13,
                minZoom: 10,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
        }

        public getMarkerIconByCategoryId(categoryId:string) {
            var icon = MapService.MARKER_ICONS_BY_CATEGORY_ID[categoryId];
            return icon == null ? 'img/misc.png' : icon;
        }

        public getMarkerByStoreId(storeId:number) {
            if (angular.isUndefined(storeId)) {
                return null;
            }

            for (var i = 0; i < this.dealMarkers.length; i++) {
                var marker = this.dealMarkers[i];
                if (this.getDealFromMarker(marker).storeID == storeId) {
                    return marker;
                }
            }
            return null;
        }

        public getDealFromMarker(marker:google.maps.Marker) {
            return <Metronome.Model.Deal>marker.get(MapService.DEAL_MARKER_DATA_KEY);
        }

        public getDealsWithinMapBounds(deals:Metronome.Model.Deal[]) {
            var mapBounds = this.myMap.getBounds();
            if (angular.isUndefined(mapBounds)) {
                return [];
            }

            return deals.filter(
                function (deal:Metronome.Model.Deal) {
                    return mapBounds.contains(new google.maps.LatLng(deal.lat, deal.lon));
                }
            );
        }

        public isRefreshNeeded() {
            if (angular.isUndefined(this.myMap) || angular.isUndefined(this.myMap.getCenter())) {
                return false;
            }

            if (this.disableNextMapRefresh) {
                this.disableNextMapRefresh = false;
                this.$log.debug("next refresh was disabled");
                return false;
            }

            var centerThresholdExceeded = false;
            if (!angular.isUndefined(this.mapCenter)) {
                // imperfect attempt at minimizing coupon refreshes when map viewport
                // changes (based on geographical distance, but should be based on pixel distance)
                var CENTER_THRESHOLD = .005;
                var latDelta = Math.abs(Math.abs(this.mapCenter.lat()) - Math.abs(this.myMap.getCenter().lat()));
                var lngDelta = Math.abs(Math.abs(this.mapCenter.lng()) - Math.abs(this.myMap.getCenter().lng()));
                this.$log.debug("map center changed from/to lat " + this.mapCenter.lat() + "/" + this.myMap.getCenter().lat() +
                    " lon " + this.mapCenter.lng() + "/" + this.myMap.getCenter().lng() +
                    ", latDelta=" + latDelta + " lngDelta=" + lngDelta);
                centerThresholdExceeded = (latDelta > CENTER_THRESHOLD) || (lngDelta > CENTER_THRESHOLD);
            }

            var zoomChanged = this.myMap.getZoom() != this.mapOptions.zoom;

            this.mapCenter = this.myMap.getCenter();
            this.mapOptions.zoom = this.myMap.getZoom();
            this.$log.debug("refresh criteria: centerThresholdExceeded=" + centerThresholdExceeded + " zoomChanged=" + zoomChanged + " initialized=" + this.initialized);

            if (centerThresholdExceeded || zoomChanged || !this.initialized) {
                this.initialized = true;
                // TODO: optimize performance by removing some deals and/or markers that are out of bounds if there are many of them?
                return true;
            }
            else {
                this.$log.debug("refresh criteria not met: not refreshing");
                return false;
            }
        }

        public showCurrentLocation() {
            // center map on current location
            this.myMap.setCenter(this.mapCenter);

            // add marker for user's current location
            var pinColor = "5ea9ff";
            var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_spin&chld=0.6|0|" + pinColor + "|0|_|k",
                new google.maps.Size(25, 60),
                new google.maps.Point(0, 0),
                new google.maps.Point(10, 24));

            // create current location marker and add it to the map
            new google.maps.Marker({
                map: this.myMap,
                position: this.mapCenter,
                icon: pinImage
            });
        }

        public addDealMarkers(loadedDeals:Metronome.Model.Deal[]) {
            var dealsUniqueStore = this.$filter('unique')(loadedDeals, 'storeID');

            if (this.markerClusterer == null) {
                var mcOptions = { gridSize: 30, maxZoom: 15 };
                this.markerClusterer = new MarkerClusterer(this.myMap, [], mcOptions);
            }

            var mapBounds = this.myMap.getBounds();

            var _this = this; // WebStorm doesn't know that "this" inside the foreach is the same as outside of it
            angular.forEach(dealsUniqueStore, function (deal:Metronome.Model.Deal) {
                var dealPosition = new google.maps.LatLng(deal.lat, deal.lon);
                if (!angular.isUndefined(mapBounds) && !mapBounds.contains(dealPosition)) {
                    _this.$log.debug("skipping out of bounds deal " + deal.ID + " (" + deal.name + ") at " + deal.lat + "," + deal.lon);
                    return;
                }

                if (_this.dealMarkersByDealId[deal.ID] != null) {
                    _this.$log.debug("skipping existing deal " + deal.ID + " (" + deal.name + ") at " + deal.lat + "," + deal.lon);
                    return;
                }

                // create map marker
                var marker = new google.maps.Marker({
                    position: dealPosition,
                    title: deal.name,
                    icon: _this.getMarkerIconByCategoryId(deal.categoryID)
                });

                // add deal data to marker
                marker.set(MapService.DEAL_MARKER_DATA_KEY, deal);

                _this.dealMarkersByDealId[deal.ID] = marker;

                _this.dealMarkers.push(marker);
                _this.markerClusterer.addMarker(marker);
            }, this); // last parameter to forEach is "this" which ensures that the value of "this" inside foreach is the same as the value outside of it
        }

        public addRailStationMarkers(railStations:Metronome.Model.RailStation[]) {
            angular.forEach(railStations, function (station:Metronome.Model.RailStation) {
                var stationPosition = new google.maps.LatLng(station.Lat, station.Lon);

                // create map marker
                var marker = new google.maps.Marker({
                    map: this.myMap,
                    position: stationPosition,
                    title: station.Name,
                    icon: "img/metro.png"
                });

                // add station data to marker
                marker.set(MapService.RAIL_STATION_DATA_KEY, station);

                this.railStationMarkers.push(marker);
            }, this);

            // hide station markers when zoomed out
            var zoom = this.myMap.getZoom();
            angular.forEach(this.railStationMarkers, function (stationMarker:google.maps.Marker) {
                stationMarker.setVisible(zoom > 10);
            });
        }

        public goToDeal(deal:Metronome.Model.Deal) {
            this.disableNextMapRefresh = true;
            this.myMap.panTo(new google.maps.LatLng(deal.lat, deal.lon));
            var marker = this.getMarkerByStoreId(deal.storeID);
            if (marker == null) {
                this.$log.error("marker for store id " + deal.storeID + " not found");
                return;
            }
            this.openDealWindow(marker);
        }

        public openDealWindow(marker:google.maps.Marker) {
            this.disableNextMapRefresh = true;
            this.myInfoWindow.open(this.myMap, marker);
        }

        public getMapUrl(deal:Metronome.Model.Deal) {
            if (angular.isUndefined(deal)) {
                return null;
            }
            return "https://www.google.com/maps/preview#!q=" + deal.name + ", " + deal.address +
                (deal.address2 ? ", " + deal.address2 : "") +
                ", " + deal.city + ", " + deal.state + ", " + deal.ZIP;
        }

        public getMapRadius() {
            var bounds = this.myMap.getBounds();

            if (angular.isUndefined(bounds)) {
                return null;
            }
            var center = bounds.getCenter();
            var ne = bounds.getNorthEast();

            // r = radius of the earth in statute miles
            var r = 3963.0;

            // Convert lat or lng from decimal degrees into radians (divide by 57.2958)
            var lat1 = center.lat() / 57.2958;
            var lon1 = center.lng() / 57.2958;
            var lat2 = ne.lat() / 57.2958;
            var lon2 = ne.lng() / 57.2958;

            // distance = circle radius from center to Northeast corner of bounds
            return (r * Math.acos(Math.sin(lat1) * Math.sin(lat2) +
                Math.cos(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1)));
        }
    }

    Metronome.App.Services.service("mapService", MapService);
}
