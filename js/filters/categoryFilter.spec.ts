/// <reference path='../global.ts'/>
/// <reference path='../mocks/mockData.ts'/>
/// <reference path='categoryFilter.ts'/>

describe("DealCategoryFilter", () => {

    var filter:any;

    var dealList:Array<Metronome.Model.Deal>;

    var filterCriteria:Metronome.Model.DealCategoryFilterCriteria;

    beforeEach(() => {
        module('metronome.filters');

        inject(($filter) => {
            filter = $filter('dealCategoryFilter');
        });

        dealList = MockData.Deal.deals;
        filterCriteria = <Metronome.Model.DealCategoryFilterCriteria>{};
    });

    it("should return entire list if no criteria is specified", () => {
        var filteredList = filter(dealList, filterCriteria);
        expect(filteredList.length).toEqual(dealList.length);
    });

    it("should filter by 1 category id", () => {
        filterCriteria[dealList[0].categoryID] = true;

        var filteredList = filter(dealList, filterCriteria);
        expect(filteredList.length).toEqual(1);
        expect(filteredList[0].categoryID).toEqual(dealList[0].categoryID);
    });

    it("should filter by multiple category ids", () => {
        filterCriteria[MockData.Deal.dealsInSameStore[0].categoryID] = true;
        filterCriteria[MockData.Deal.nullCategoryDeal.categoryID] = true;

        var filteredList = filter(dealList, filterCriteria);
        expect(filteredList.length).toEqual(MockData.Deal.dealsInSameStore.length + 1);

        for (var i = 0; i < MockData.Deal.dealsInSameStore.length; i++) {
            expect(filteredList).toContain(MockData.Deal.dealsInSameStore[i]);
        }
        expect(filteredList).toContain(MockData.Deal.nullCategoryDeal);
    });
});
