<?php

	function connectDB(){
		$con = mysqli_connect("localhost:3308", "root", "", "web");
		if(mysqli_connect_errno($con)){
			die('Could not connect: ' . mysqli_error($con));
		}
		return $con;
	}

	function check($ret){
		session_start();
		if(empty($_SESSION["userinfo"])||empty($_SESSION["userinfo"]["userName"])){
			$ret["status"] = -1;
			$ret["repo"] = null;
		}else{
			$ret["status"] = 200;
			$ret["user"] = $_SESSION["userinfo"]["userName"];
			if(isset($_SESSION["userinfo"]["repo"])){
				$ret["repo"] = $_SESSION["userinfo"]["repo"];
			}else{
				$ret["repo"] = null;
			}
		}
		return $ret;
	}

	function checkInput(){
		$ret = array();
		if(isset($_POST['type']) && !empty($_POST['type'])){
			if($_POST['type'] == "check"){
				$ret = check($ret);
				return $ret;
			}
		}
		if(isset($_POST['userName']) && !empty($_POST['userName'])){
			if(isset($_POST['pwd']) && !empty($_POST['pwd'])){
				$ret["check"] = true;
			}
		}else{
			$ret["check"] = false;
			return $ret;
		}
		if(isset($_POST['type']) && !empty($_POST['type'])){
			if($_POST['type'] == "register"){
				$ret["status"] = register($_POST['userName'], $_POST['pwd']);
			}else if($_POST['type'] == "login"){
				$ret["status"] = login($_POST['userName'], $_POST['pwd']);
			}
		}
		return $ret;
	}

	function login($userName, $pwd){
		$con = connectDB();
		$userName = (string)$userName;
		$pwd = (string)$pwd;
		$query = "select * from user_basic where userName='".$userName."' and password='".$pwd."';";
		$ret = mysqli_query($con, $query);
		if($ret->num_rows != 0){
			$query = "select repoName from repo_basic where userName='".$userName."';";
			$ret = mysqli_query($con, $query);
			$ret = mysqli_fetch_all($ret);
			session_start();
			$_SESSION['userinfo'] = [
				"userName" => $userName,
				"repo" => $ret
			];
			return 200;
		}else{
			return -1;
		}
	}

	function register($userName, $pwd){
		$con = connectDB();
		$userName = (string)$userName;
		$pwd = (string)$pwd;
		$query = "select * from user_basic where userName='". $userName."';";
		$ret = mysqli_query($con, $query);
		if($ret->num_rows != 0){
			return -1;
		}
		$query = "insert into user_basic (userName, password) values ('".$userName."','".$pwd."');";
		$ret = mysqli_query($con, $query);
		if(!$ret){
			die("[ERROR] Fail to insert data!". mysqli_error($con));
		}
		return 200;	
	}


	$ret = checkInput();
	echo json_encode($ret);

?>