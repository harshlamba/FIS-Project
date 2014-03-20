/// <reference path="global.ts" />
module Metronome.i18n {
    interface i18nKeys {
        ERRORS: {
            ERROR_COUPON_LOAD;
            ERROR_RAIL_STATIONS_LOAD;
            ERROR_LOCATION_FIND;
            ERROR_CATEGORIES_LOAD;
        }
        MESSAGES: {
            NO_DEALS_FOUND;
            DEAL_STATISTICS;
        }
    }

    Metronome.App.Module.config(['$translateProvider', function ($translateProvider) {
        $translateProvider.translations('en', <i18nKeys>{
            ERRORS: {
                ERROR_COUPON_LOAD: "Coupons could not be loaded.",
                ERROR_RAIL_STATIONS_LOAD: "Metro rail stations could not be loaded.",
                ERROR_LOCATION_FIND: "Your current location could not be determined.",
                ERROR_CATEGORIES_LOAD: "Categories could not be loaded."
            },
            MESSAGES: {
                NO_DEALS_FOUND: "No deals found.",
                DEAL_STATISTICS: "{{listedDealsCount}} of {{mappedDealsCount}} deals ({{hiddenDealsCount}} hidden), {{markersCount}} markers"
            }
        });

        $translateProvider.translations('de', <i18nKeys>{
            ERRORS: {
                ERROR_COUPON_LOAD: "German for 'Coupons could not be loaded.'",
                ERROR_RAIL_STATIONS_LOAD: "German for 'Metro rail stations could not be loaded.'",
                ERROR_LOCATION_FIND: "German for 'Your current location could not be determined.'",
                ERROR_CATEGORIES_LOAD: "German for 'Categories could not be loaded.'"
            },
            MESSAGES: {
                NO_DEALS_FOUND: "German for 'No deals found.'",
                DEAL_STATISTICS: "German for {{listedDealsCount}} of {{mappedDealsCount}} deals ({{hiddenDealsCount}} hidden), {{markersCount}} markers"
            }
        });

        $translateProvider.preferredLanguage('en');
        $translateProvider.useMissingTranslationHandlerLog();
    }]);
}
