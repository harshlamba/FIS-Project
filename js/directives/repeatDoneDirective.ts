/// <reference path="../global.ts" />
module Directives {
    /**
     * Emits an event for each element created by on ng-repeat directive. This is useful when you want to use ng-repeat
     * in a directive template and manipulate the results of ng-repeat in the directive.
     *
     * Usage: Add this to an element that has an ng-repeat directive:
     *      <code>mn-repeat-done="YOUR_EVENT_NAME" mn-repeat-done-arg="YOUR_EVENT_ARGUMENT_EXPRESSION"</code> to an
     * where:
     *      YOUR_EVENT_NAME = arbitrary event name to emit
     *      YOUR_EVENT_ARGUMENT_EXPRESSION = expression for argument to pass to the event handler function (optional)
     * Then call:
     *      <code>scope.$on('YOUR_EVENT_NAME'), YOUR_EVENT_HANDLER_FUNCTION)</code>
     * in the link function of your directive to listen for your event. The event handler function is called with the
     * following arguments:
     *      event: Angular event object
     *      element: element that was created by the ng-repeat directive
     *      argument: evaluated YOUR_EVENT_ARGUMENT_EXPRESSION if specified (see above)
     */
    class RepeatDoneDirective {
        public static Factory():ng.IDirective {
            return {
                restriction: 'A',
                link: function ($scope, element, attributes) {
                    var repeatArg = attributes["mnRepeatDoneArg"] || "";
                    $scope.$emit(attributes["mnRepeatDone"] || "repeat_done", element, $scope.$eval(repeatArg));
                }
            }
        }
    }

    Metronome.App.Directives.directive("mnRepeatDone", [RepeatDoneDirective.Factory]);
}