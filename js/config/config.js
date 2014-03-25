// JavaScript Document
var taskManager = angular.module('taskManager', []);
//Goes in config.js
taskManager.config(['$routeProvider',
  function ($routeProvider) {
      $routeProvider.
       when('/addTask', {
           templateUrl: 'views/modal.html',
           controller: 'taskManage'
       }).
        when('/tasklist', {
            templateUrl: 'views/tasklist.html',
            controller: 'taskManage'
        }).
        when('/addperson', {
            templateUrl: 'views/addlistitem.html',
            controller: 'simplecontroller'
        }).
        when('/editperson/:personId', {
            templateUrl: 'views/editlist.html',
            controller: 'updateController'
        }).
        otherwise({ redirectTo: '/' });
  }]);