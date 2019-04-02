<?php

	function connectDB(){
		$con = mysqli_connect("localhost:3308", "root", "", "web");
		if(mysqli_connect_errno($con)){
			die('Could not connect: ' . mysqli_error($con));
		}
		return $con;
	}

	function checkInput(){
		$ret = "";
		if(isset($_POST['userName']) && !empty($_POST['userName'])){
			if(isset($_POST['pwd']) && !empty($_POST['pwd'])){
				$ret = "passCheck";
			}
		}else{
			return;
		}
		if(isset($_POST['type']) && !empty($_POST['type'])){
			$ret = $ret . register($_POST['userName'], $_POST['pwd']);
		}
		return $ret;
	}

	function register($userName, $pwd){
		$con = connectDB();
		$userName = (string)$userName;
		$pwd = (string)$pwd;
		$query = "select * from user_basic where userName=". $userName;
		$ret = mysqli_query($con, $query);
		if($ret->num_rows != 0){
			return "-1";
		}
		$query = "insert into user_basic (userName, password) values (".$userName.",".$pwd.");";
		$ret = mysqli_query($con, $query);
		if(!$ret){
			die("[ERROR] Fail to insert data!". mysqli_error($con));
		}
		return "200";
		
	}

	$ret = checkInput();
	// echo json_encode(array('a' => 1, 'b' => 2, 'c' => 3, 'd' => 4, 'e' => 5));
	echo 111;

?>