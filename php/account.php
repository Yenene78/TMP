<?php

	function connectDB(){
		$con = mysqli_connect("localhost:3308", "root", "", "web");
		if(!$con){
			die('Could not connect: ' . mysqli_error());
		}
	}

	function checkInput(){
		if(isset($_POST['userName']) && !empty($_POST['userName'])){
			if(isset($_POST['pwd']) && !empty($_POST['pwd'])){
				echo("success");
			}
		}else{
			return;
		}
		if(isset($_POST['type']) && !empty($_POST['type'])){
			register($_POST['userName'], $_POST['pwd']);
		}
	}

	function register($userName, $pwd){
		connectDB();
	}

	checkInput();

?>