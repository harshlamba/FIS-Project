module google.maps {
    export class MockMap extends google.maps.Map {
        public bounds:LatLngBounds;
//        public center:LatLng;
//        public zoom:number;

        constructor(mapDiv:Element, opts?:MapOptions) {
            super(mapDiv, opts);
//            this.center = opts.center;
            var seBound = new google.maps.LatLng(opts.center.lat() - 1, opts.center.lng() - 1);
            var nwBound = new google.maps.LatLng(opts.center.lat() + 1, opts.center.lng() + 1);
            this.bounds = new google.maps.LatLngBounds(seBound, nwBound);
//            this.zoom = opts.;
        }

        getBounds():LatLngBounds {
            return this.bounds;
        }

//        getCenter():LatLng {
//            return this.center;
//        }

//        getZoom():number {
//            return this.zoom;
//        }

//        getDiv():Element {
//        }
//
//        getHeading():number {
//        }
//
//        getMapTypeId():MapTypeId {
//        }
//
//        getProjection():Projection {
//        }
//
//        getStreetView():StreetViewPanorama {
//        }
//
//        getTilt():number {
//        }
//
//        panBy(x:number, y:number):void {
//        }
//
//        panTo(latLng:LatLng):void {
//        }
//
//        panToBounds(latLngBounds:LatLngBounds):void {
//        }
//
//        setCenter(latlng:LatLng):void {
//        }
//
//        setHeading(heading:number):void {
//        }
//
//        setMapTypeId(mapTypeId:MapTypeId):void {
//        }
//
//        setOptions(options:MapOptions):void {
//        }
//
//        setStreetView(panorama:StreetViewPanorama):void {
//        }
//
//        setTilt(tilt:number):void {
//        }
//
//        setZoom(zoom:number):void {
//        }
    }

    export class MockInfoWindow extends google.maps.InfoWindow {
        constructor(opts?:InfoWindowOptions) {
            super(opts);
        }

//        close():void {
//        }
//
//        getContent():any {
//        }
//
//        getPosition():LatLng {
//        }
//
//        getZIndex():number {
//        }
//
//        open(map?:google.maps.MockMap, anchor?:MVCObject):void {
//        }
//
//        open(map?:StreetViewPanorama, anchor?:MVCObject):void {
//        }
//
//        setContent(content:Node):void {
//        }
//
//        setContent(content:string):void {
//        }
//
//        setOptions(options:InfoWindowOptions):void {
//        }
//
//        setPosition(position:LatLng):void {
//        }
//
//        setZIndex(zIndex:number):void {
//        }
    }

}
