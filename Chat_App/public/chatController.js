'use strict';

/* Controllers */

function ChatController($scope, socket) {
	$scope.messages = [];
	$scope.users = [];
	/*Listeners of server*/
	socket.on('init', function(data){
		$scope.name = data.name;
		$scope.users = data.users;
		
	});

	socket.on('notificationMessage', function(message){
		$scope.messages.push(message);
	});

	socket.on('user_join', function(data){
		$scope.messages.push({
			user:'SERVER',
			text:'User has joined: ' +  data.userJoined
		});
		
		$scope.users.push(data.userJoined);
	});

	socket.on('disconnect', function(data){
		$scope.messages.push({
			user:'SERVER',
			text:'User has left the room: ' + data.name
		});
		var i, user;
	    for (i = 0; i < $scope.users.length; i++) {
	      user = $scope.users[i];
	      if (user === data.name) {
	        $scope.users.splice(i, 1);
	        break;
	      }
	    }
	});

	/*Published methods*/

	$scope.addUser = function () {
		//Event, value, callback
		socket.emit('addUser', $scope.username,
		function (result) {
		  if (!result) {
		    alert('There was an error changing your name');
		  }
		});
	};

	$scope.sendMessage = function(){
		socket.emit('sendMessage',{
			user: $scope.name,
			message: $scope.message
		});
		//Add message to model
		$scope.messages.push({
			user: $scope.name,
			text: $scope.message
		});
		//Clear message box
		$scope.message = '';
	};
};