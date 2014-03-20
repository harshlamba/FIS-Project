/// <reference path="../global.ts" />
module Filters {
    /**
     * Returns the subset of {@link Metronome.Model.Deal}s that have a category id matching one of the categories
     * in {@link Metronome.Model.DealCategoryFilterCriteria} that are enabled (i.e. have a <tt>true</tt> value).
     * If no categories are enabled, all deals are returned.
     *
     * Usage: ... | dealCategoryFilter:[location of filter criteria]
     */
    export class DealCategoryFilter {
        public static Factory() {
            return function (list: Array<Metronome.Model.Deal>, filterCriteria: Metronome.Model.DealCategoryFilterCriteria) {
                return list.filter(function (deal: Metronome.Model.Deal) {
                    var isEnabled = false;
                    var isAnyCategoryEnabled = false;
                    angular.forEach(filterCriteria, function (categoryEnabled:boolean, categoryId:string) {
                        if (String(deal.categoryID) == categoryId) {
                            isEnabled = isEnabled || categoryEnabled;
                        }
                        isAnyCategoryEnabled = isAnyCategoryEnabled || categoryEnabled;
                    });
                    return isEnabled || !isAnyCategoryEnabled;
                });
            };
        }
    }

    Metronome.App.Filters.filter("dealCategoryFilter", [DealCategoryFilter.Factory]);
}
