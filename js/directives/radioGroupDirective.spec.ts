/// <reference path='../global.ts'/>
/// <reference path='../mocks/mockData.ts'/>
/// <reference path='radioGroupDirective.ts'/>
interface IRadioGroupDirectiveTestScope extends ng.IScope {
    myModel: string;
}

describe("RadioGroupDirective", () => {
    var $compile: ng.ICompileService;
    var $scope: IRadioGroupDirectiveTestScope;
    var element: ng.IAugmentedJQuery;

    beforeEach(() => {
        module('metronome.directives');

        // fill $templateCache with all of our HTML templates using the ng-html2js Karma preprocessor so
        // that the directive can load its template
        module('templates');

        inject((_$rootScope_, _$compile_) => {
            $scope = <IRadioGroupDirectiveTestScope>_$rootScope_.$new();
            element = angular.element(
                "<mn-radio-group ng-model='myModel' button-class='myButtonClass' " +
                                "options=\"[{value: 'value1', label: 'label1'}, {value: 'value2', label: 'label2'}]\">" +
                "</mn-radio-group>");
            $compile = _$compile_;
            $compile(element)($scope);

            $scope.myModel = "value2";
            $scope.$digest();
        });
    });


    it("should render a radio button group", () => {
        expect(element.find("button").length).toEqual(2);

        var button1 = element.children().eq(0);
        expect(button1.val()).toEqual("value1");
        expect(button1.text().trim()).toEqual("label1");

        var button2 = element.children().eq(1);
        expect(button2.val()).toEqual("value2");
        expect(button2.text().trim()).toEqual("label2");
    });

    it("should set button class", () => {
        var button1 = element.children().eq(0);
        expect(button1.hasClass("myButtonClass")).toBe(true);

        var button2 = element.children().eq(1);
        expect(button2.hasClass("myButtonClass")).toBe(true);
    });

    it("should activate button that matches model value", () => {
        var button1 = element.children().eq(0);
        expect(button1.hasClass("active")).toBe(false);

        var button2 = element.children().eq(1);
        expect(button2.hasClass("active")).toBe(true);
    });

    it("should activate button when clicked", () => {
        var button1 = element.children().eq(0);
        button1.triggerHandler("click");
        expect(button1.hasClass("active")).toBe(true);

        var button2 = element.children().eq(1);
        expect(button2.hasClass("active")).toBe(false);
    });
});
