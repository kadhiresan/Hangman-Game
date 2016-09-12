var myApp = angular.module('hangman',[]);

myApp.controller('WordController', ['$scope','$http', function($scope, $http) {
	
	// all possible words from which the app will randomly pick
	$scope.words = [];

	// the word with missing characters (as presented to the user)
	$scope.theGameWord = "";

	// the correct word (with no missing characters)
	$scope.completedWord = "";

	// the character that the user just guessed
	$scope.guess = "";

	// number of attempts to guess a character this round
	$scope.attempts = 0;

	// total successfully completed words for a browsing session
	$scope.numCompletedWords = 0;

	// total failed words for a browsing session
	$scope.numFailedWords = 0;

	// the completed word (without missing characters) which would be set when the round is over
	$scope.showCorrectWord = "";

	//the entire hangman ASCII
	$scope.theHangman = [

	'______________\n',

	'|         |   \n',

	'|         0   \n',

	'|        /|\\  \n',

	'|        / \\  \n',

	'|             \n',

	'|             \n',

	];

	//a string containing lines (combined indices) from the<strong>theHangman</strong> array with the ASCII Hangman.

	$scope.currentDrawing = "Life :)";

	$scope.loadWords = function() {

		$scope.attempts = 0;

		$scope.currentDrawing = "Life :)";

		$http.get("http://localhost:1337/api/words")

		.then(function(response) {

			$scope.words = response.data;

			var randomIndex = Math.floor(Math.random() * $scope.words.length);

			var theWord = $scope.words[randomIndex];

			$scope.completedWord = theWord;

			for (var i = 0; i < theWord.length - (2 + Math.ceil(Math.random() * theWord.length / 2)) ; i++) {
				theWord = theWord.replace(theWord[i], "_");
			}

			$scope.theGameWord = theWord;

			if ($scope.theGameWord.indexOf("_") === -1) {
				$scope.loadWords();
			}
		})

	}

	$scope.checkGuess = function() {
		$scope.showCorrectWord = "";
		if (!$scope.guess || !$scope.guess.length) {
			return;
		}

		var correctChoice = false;

		for(var i=0; i<$scope.completedWord.length; i++) {
			if ($scope.theGameWord[i] === "_" && $scope.completedWord[i] === $scope.guess) {
				correctChoice = true;

				var gameWordArr = $scope.theGameWord.split("");

				gameWordArr[i] = $scope.guess;

				$scope.theGameWord = gameWordArr.join("");
			}
		}

		if (!correctChoice) {
			$scope.attempts += 1;
			$scope.drawMan();
		}

		// empty user's input
		$scope.guess = "";

		if ($scope.theGameWord.indexOf("_") === -1) {
			// he completed the word
			$scope.numCompletedWords +=1;
			$scope.loadWords();
		}
	}

    $scope.drawMan = function() {      
		var ret = "";          
		if ($scope.attempts > $scope.theHangman.length) {             
		 	// user died;              
			$scope.numFailedWords += 1;              
			$scope.showCorrectWord = $scope.completedWord;               
			$scope.loadWords();               
			return;          
		}  
		     
		//draw   
		for (var i = 0; i< $scope.attempts; i++) {              
			ret += $scope.theHangman[i];          
		}          
		$scope.currentDrawing = ret;      
	}

}]);