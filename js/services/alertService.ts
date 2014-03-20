/// <reference path="../global.ts" />
module Services {
    export interface IAlertService {
        alerts:Metronome.Model.Alert[];

        addAlert(alertType:Metronome.Model.AlertType, messageKey:string);
        removeAlert(messageKey:string);
        closeAlert(index:number);
    }

    class AlertService implements IAlertService {
        public alerts:Metronome.Model.Alert[] = [];

        // this $inject is required to ensure minification does not break the dependency injection -- values must match the constructor arguments
        static $inject = ['$filter', '$log'];

        constructor(private $filter:ng.IFilterService, private $log:ng.ILogService) {
        }

        public addAlert(alertType:Metronome.Model.AlertType, messageKey:string) {
            this.alerts.splice(0, 0, <Metronome.Model.Alert>{ type: Metronome.Model.AlertType[alertType], messageKey: messageKey });
            this.alerts = this.$filter('unique')(this.alerts, 'messageKey');
            this.alerts.length = Math.min(this.alerts.length, 3);
        }

        public removeAlert(messageKey:string) {
            this.alerts = this.alerts.filter(function(alert:Metronome.Model.Alert) { return alert.messageKey != messageKey; });
        }

        public closeAlert(index:number) {
            this.alerts.splice(index, 1);
        }
    }

    Metronome.App.Services.service("alertService", AlertService);
}

