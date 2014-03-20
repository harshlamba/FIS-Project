/// <reference path='../global.ts'/>
/// <reference path='../mocks/mockData.ts'/>
/// <reference path='alertService.ts'/>

describe("AlertService", () => {
    var alertService:Services.IAlertService;

    beforeEach(() => {
        module('metronome.services');

        inject((_alertService_) => {
            alertService = _alertService_;
        });
    });

    describe("addAlert method", () => {
        it("should add an alert", () => {
            var messageKey = "test success messageKey";
            var alertType = Metronome.Model.AlertType.success;
            alertService.addAlert(alertType, messageKey);
            expect(alertService.alerts.length).toEqual(1);
            expect(alertService.alerts[0].messageKey).toEqual(messageKey);
            expect(alertService.alerts[0].type).toEqual(Metronome.Model.AlertType[alertType]);
        });

        it("should ignore duplicate alerts", () => {
            var duplicateMessage = "test duplicate";
            var nonDuplicateMessage = "non-duplicate";
            alertService.addAlert(Metronome.Model.AlertType.success, duplicateMessage);
            alertService.addAlert(Metronome.Model.AlertType.success, nonDuplicateMessage);
            alertService.addAlert(Metronome.Model.AlertType.success, duplicateMessage);
            expect(alertService.alerts.length).toEqual(2);
            expect(alertService.alerts[0].messageKey).toEqual(duplicateMessage);
            expect(alertService.alerts[1].messageKey).toEqual(nonDuplicateMessage);
        });

        it("should limit alert count to 3", () => {
            var keepMessage1 = "keep messageKey 1";
            var keepMessage2 = "keep messageKey 2";
            var keepMessage3 = "keep messageKey 3";
            alertService.addAlert(Metronome.Model.AlertType.success, "remove oldest messageKey when count exceeded");
            alertService.addAlert(Metronome.Model.AlertType.success, keepMessage1);
            alertService.addAlert(Metronome.Model.AlertType.success, keepMessage2);
            expect(alertService.alerts.length).toEqual(3);
            alertService.addAlert(Metronome.Model.AlertType.success, keepMessage3);
            expect(alertService.alerts.length).toEqual(3);
            expect(alertService.alerts[0].messageKey).toEqual(keepMessage3);
            expect(alertService.alerts[1].messageKey).toEqual(keepMessage2);
            expect(alertService.alerts[2].messageKey).toEqual(keepMessage1);
        });
    });

    describe("removeAlert method", () => {
        it("should remove an alert by messageKey text", () => {
            var keepMessage1 = "keep messageKey 1";
            alertService.addAlert(Metronome.Model.AlertType.success, keepMessage1);

            var removeMessage = "remove messageKey";
            alertService.addAlert(Metronome.Model.AlertType.success, removeMessage);

            var keepMessage2 = "keep messageKey 2";
            alertService.addAlert(Metronome.Model.AlertType.success, keepMessage2);

            alertService.removeAlert(removeMessage);

            expect(alertService.alerts.length).toEqual(2);
            expect(alertService.alerts[0].messageKey).toEqual(keepMessage2);
            expect(alertService.alerts[1].messageKey).toEqual(keepMessage1);
        });

    });

    describe("closeAlert method", () => {
        it("should remove an alert by index", () => {
            var keepMessage1 = "keep messageKey 1";
            alertService.addAlert(Metronome.Model.AlertType.success, keepMessage1);

            var removeMessage = "remove messageKey";
            alertService.addAlert(Metronome.Model.AlertType.success, removeMessage);

            var keepMessage2 = "keep messageKey 2";
            alertService.addAlert(Metronome.Model.AlertType.success, keepMessage2);

            alertService.closeAlert(1);

            expect(alertService.alerts.length).toEqual(2);
            expect(alertService.alerts[0].messageKey).toEqual(keepMessage2);
            expect(alertService.alerts[1].messageKey).toEqual(keepMessage1);
        });
    });
});