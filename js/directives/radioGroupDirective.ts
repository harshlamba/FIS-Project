/// <reference path="../global.ts" />
module Directives {
    interface IRadioGroupScope extends ng.IScope {
        ngModel: string;
        options: {
            value: string;
            label: string
        }[];
        buttonClass: string;
        onButtonClick(option): void;
    }

    /**
     * Render a group of buttons that behave like radio buttons.
     */
    class RadioGroupDirective {
        public static Factory($log: ng.ILogService): ng.IDirective {
            return {
                restrict: 'E',
                require: 'ngModel',
                scope: { // use isolate scope
                    ngModel: '=',
                    options: '=',
                    buttonClass: '@'
                },
                controller: RadioGroupController,
                templateUrl: 'js/directives/radioGroupDirective.html',
                link: function (scope: IRadioGroupScope,
                                instanceElement: ng.IAugmentedJQuery,
                                instanceAttributes: ng.IAttributes,
                                ngModelController: ng.INgModelController) {
                    
                    // Highlight the currently selected button. The button_created event is emitted in these cases:
                    // 1. a button is created by the ng-repeat directive (the mn-repeat-done directive in radioGroupDirective.html emits the event)
                    // 2. the model changes (see below)
                    scope.$on('button_created', function(event, buttonElement?, buttonValue?) {
                        buttonElement.toggleClass('active', angular.equals(ngModelController.$modelValue, buttonValue));
                        $log.debug("button state updated, value=" + buttonValue + " modelValue=" + ngModelController.$modelValue);
                    });

                    // update UI when model changes
                    ngModelController.$render = function () {
                        angular.forEach(instanceElement.find("button"), function(button) {
                            var buttonElem = angular.element(button);
                            var buttonValue = buttonElem.attr("value");
                            $log.debug("emitting created event for button value" + buttonValue);
                            scope.$emit("button_created", buttonElem, buttonValue);
                        });
                    };
                }
            }
        }
    }

    class RadioGroupController {
        static $inject = ['$scope', '$log'];

        constructor(private $scope: IRadioGroupScope, $log: ng.ILogService) {
            // update the model when a button is clicked
            $scope.onButtonClick = function (buttonValue) {
                $log.debug("button clicked: " + buttonValue);
                $scope.ngModel = buttonValue;
            };
        }
    }

    // must define injected services here instead of a static $inject property on the directive class
    Metronome.App.Directives.directive("mnRadioGroup", ["$log", RadioGroupDirective.Factory]);

}
