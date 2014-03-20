module Metronome.Model {
    /**
     * Types of {@link Alert} messages.
     */
    export enum AlertType {
        success, warning, info, danger
    }

    /**
     * Messages shown by Alert UI Bootstrap component {@link http://angular-ui.github.io/bootstrap/#/alert}
     * and translated by angular-translate module {@link http://pascalprecht.github.io/angular-translate/}
     */
    export class Alert {
        type: string; // string representation of AlertType enum
        messageKey: string;
    }

    /**
     * Deal Category from getcategory 8coupons API {@link http://www.8coupons.com/api/doc}
     */
    export class DealCategory {
        categoryID: string;
        category: string;
    }

    /**
     * Deal from getdeals 8coupons API {@link http://www.8coupons.com/api/doc}
     */
    export class Deal {
        name: string;
        address: string;
        address2: string;
        state: string;
        city: string;
        ZIP: string;
        storeID: number;
        URL: string;
        storeURL: string;
        ID: number;
        dealTitle: string;
        disclaimer: string;
        dealinfo: string;
        expirationDate: string;
        postDate: string;
        showImageStandardSmall: string;
        showLogo: string;
        DealTypeID: number;
        categoryID: string;
        subcategoryID: string;
        lat: number;
        lon: number;
        distance: number;
    }

    /**
     * Criteria for filtering deals by category id. Each property name is a category id and the value is a boolean
     * indicating if that category should be included.
     */
    export interface DealCategoryFilterCriteria {
        [categoryId: string]: boolean;
    }

    /**
     * Rail Station from jStations WMATA API {@link http://developer.wmata.com/io-docs}
     */
    export class RailStation {
        Code: string;
        Lat: number;
        Lon: number;
        LineCode1: string;
        LineCode2: string;
        LineCode3: string;
        LineCode4: string;
        Name: string;
        StationTogether1: string;
        StationTogether2: string;
    }
}