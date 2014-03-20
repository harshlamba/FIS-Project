/// <reference path="../typings/angularjs/angular.d.ts" />
module Metronome {
    export class App {
        public static Filters = angular.module("metronome.filters", []);
        public static Directives = angular.module("metronome.directives", ["ui.map"]);
        public static Services = angular.module("metronome.services", ["ui.utils"]);
        public static Controllers = angular.module("metronome.controllers", [
            "ui.bootstrap",
            "ngSanitize",
            "ui.utils",
            "ui.map",
            "infinite-scroll",
            "pascalprecht.translate"
        ]);
        public static Module = angular.module("metronome",
            ["metronome.filters", "metronome.directives", "metronome.services", "metronome.controllers"]);
    }
}