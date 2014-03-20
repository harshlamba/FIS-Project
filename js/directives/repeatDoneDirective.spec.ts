/// <reference path='../global.ts'/>
/// <reference path='../mocks/mockData.ts'/>
/// <reference path='repeatDoneDirective.ts'/>

interface IRepeatDoneDirectiveTestScope extends ng.IScope {
    items: string[];
}

describe("RepeatDoneDirective", () => {
    var $compile: ng.ICompileService;
    var $scope: IRepeatDoneDirectiveTestScope;
    var element: ng.IAugmentedJQuery;

    beforeEach(() => {
        module('metronome.directives');

        inject((_$rootScope_, _$compile_) => {
            $scope = <IRepeatDoneDirectiveTestScope>_$rootScope_.$new();
            element = angular.element(
                "<div ng-repeat='item in items' mn-repeat-done='item_done' mn-repeat-done-arg='item'></div>");
            $compile = _$compile_;
            $compile(element)($scope);

            $scope.items = ['one', 'two'];
        });
    });

    it("should emit an event for each repeated item", () => {
        var eventFiredCount = 0;
        $scope.$on('item_done', function(event: ng.IAngularEvent, element?: ng.IAugmentedJQuery, eventArg?: any) {
            eventFiredCount++;
            expect($scope.items).toContain(eventArg);
        });

        $scope.$digest();

        expect(eventFiredCount).toEqual(2);
    });
});
