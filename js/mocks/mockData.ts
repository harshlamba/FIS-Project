/// <reference path="../global.ts" />
module MockData {
    export class Deal {
        public static deals:Array<Metronome.Model.Deal>;
        public static dealsInSameStore:Array<Metronome.Model.Deal>;
        public static dealsUniqueStore:Array<Metronome.Model.Deal>;
        public static nullCategoryDeal:Metronome.Model.Deal;
    }

    export class DealCategory {
        public static dealCategories:Array<Metronome.Model.DealCategory>;
    }

    export class RailStation {
        public static railStations:Array<Metronome.Model.RailStation>;
    }

//    export class Alert {
//        public static alerts:Array<Metronome.Model.Alert>;
//        public static successAlert:Metronome.Model.Alert;
//    }

    // Deal
    {
        Deal.deals = [];
        Deal.dealsInSameStore = [];
        Deal.dealsUniqueStore = [];

        var deal:Metronome.Model.Deal;

        deal = <Metronome.Model.Deal>{};
        deal.ID = 1;
        deal.categoryID = "1";
        deal.storeID = 11;
        deal.lat = 10;
        deal.lon = 10;
        Deal.deals.push(deal);
        Deal.dealsUniqueStore.push(deal);

        deal = <Metronome.Model.Deal>{};
        deal.ID = 2;
        deal.categoryID = "2";
        deal.storeID = 22;
        deal.lat = 10.1;
        deal.lon = 10.1;
        Deal.deals.push(deal);
        Deal.dealsInSameStore.push(deal);
        Deal.dealsUniqueStore.push(deal);

        deal = <Metronome.Model.Deal>{};
        deal.ID = 3;
        deal.categoryID = "2";
        deal.storeID = 22;
        deal.lat = 10.11;
        deal.lon = 10.11;
        Deal.deals.push(deal);
        Deal.dealsInSameStore.push(deal);

        deal = <Metronome.Model.Deal>{};
        deal.ID = 4;
        deal.categoryID = null;
        deal.storeID = 0;
        deal.lat = 10.2;
        deal.lon = 10.2;
        Deal.deals.push(deal);
        Deal.nullCategoryDeal = deal;
        Deal.dealsUniqueStore.push(deal);
    }

    // DealCategory
    {
        DealCategory.dealCategories = [];

        var category:Metronome.Model.DealCategory;

        category = <Metronome.Model.DealCategory>{};
        category.categoryID = "1";
        category.category = "Category Name 1";
        DealCategory.dealCategories.push(category);

        category = <Metronome.Model.DealCategory>{};
        category.categoryID = "2";
        category.category = "Category Name 2";
        DealCategory.dealCategories.push(category);

        category = <Metronome.Model.DealCategory>{};
        category.categoryID = "3";
        category.category = "Category Name 3";
        DealCategory.dealCategories.push(category);
    }

    // RailStation
    {
        RailStation.railStations = [];

        var station:Metronome.Model.RailStation;

        station = <Metronome.Model.RailStation>{};
        station.Code = "station";
        station.Name = "Station 1";
        RailStation.railStations.push(station);

        station = <Metronome.Model.RailStation>{};
        station.Code = "station";
        station.Name = "Station 2";
        RailStation.railStations.push(station);
    }

/*
    // Alert
    {
        Alert.alerts = [];

        var alert:Metronome.Model.Alert;

        alert = <Metronome.Model.Alert>{};
        alert.message = "success message";
        alert.type = Metronome.Model.AlertType[Metronome.Model.AlertType.success];
        Alert.alerts.push(alert);
        Alert.successAlert = alert;

        alert = <Metronome.Model.Alert>{};
        alert.message = "warning message";
        alert.type = Metronome.Model.AlertType[Metronome.Model.AlertType.warning];
        Alert.alerts.push(alert);

        alert = <Metronome.Model.Alert>{};
        alert.message = "info message";
        alert.type = Metronome.Model.AlertType[Metronome.Model.AlertType.info];
        Alert.alerts.push(alert);

        alert = <Metronome.Model.Alert>{};
        alert.message = "danger message";
        alert.type = Metronome.Model.AlertType[Metronome.Model.AlertType.danger];
        Alert.alerts.push(alert);
    }
*/
}
