//Controller for Add task
taskManager.controller('taskManage', ['$scope', 'taskfactory',function($scope, taskfactory){
	//Method to call factory to create an object
    $scope.tasklist = {};
	$scope.tasklist	=	taskfactory.showtask();
	$scope.addtask	=	function(){
		taskfactory.add( $scope.title, $scope.description);	
		 $scope.title	=	'';
		 $scope.description	=	'';
	}
	
}]);

//Controller for Edit and update
taskManager.controller('updateController', function($scope, $routeParams, simplefactory){
	init();
	function init(){
		personReturned	=	simplefactory.showPersontoEdit($routeParams);
		$scope.name	=	personReturned.name;
		$scope.city	=	personReturned.city;
	}
	
	console.log($scope);
	$scope.updatePerson	=	function(){
		//$routeParams allow us to retrieve current url parameters. parameters become available in $routeParams object
		$scope.personId	=	$routeParams.personId;
		simplefactory.update($scope.personId, $scope.name, $scope.city);
	}
});
