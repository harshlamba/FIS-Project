//Goes in app.js
taskManager.factory('taskfactory', function(){
    var taskObject = [
        {'name':'Currency calculator'}
    ];
	
	
	//Create emplty object
	factory	=	{};
	//Showtast returning object
	factory.showtask	=	function(){
		return taskObject; 	
	};
	
	//Creating task object
	factory.add	=	function(name,description){
		console.log(name);
		taskObject.push(
			{'name':name, 'description':description}	
		);
		console.log(taskObject);
		//window.location.href = "#listview";
	};
	
	//Updating person
	/*factory.update	=	function(index,name,city){
		updatedObject	=	{
			'name' : name, 'city' : city
			}
		person.splice(index, 1, updatedObject);
		window.location.href	=	"#listview";
	}
	
	//Deleting person
	factory.deletePerson	=	function(index){
		person.splice(index,1);
	}
	
	//Show content to edit
	factory.showPersontoEdit	=	function(index){
		personId	=	index.personId;
		return person[personId];
	}*/
	//return object of factory
	return factory;
})


