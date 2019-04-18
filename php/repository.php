<?php
/*###############################################
This is the php-based back file for homepage.html;
Take care of the DB info if errors occur anyway;
【DB】 repo_basic && repotable_<repoName>;
###############################################*/

	//// connect DB;
	function connectDB(){
		$con = mysqli_connect("localhost:3306", "root", "", "web");
		if(mysqli_connect_errno($con)){
			die('Could not connect: ' . mysqli_error($con));
		}
		return $con;
	}

	//// create template;
	// session-set;
	function createRepo($con, $RET){
		// validate:
		if((empty($_POST["name"])) || (empty($_POST["des"])) || (empty($_POST["user"]))){
			$RET["status"] = -1;
		}else{
			$query = "select * from repo_basic where repoName =". $_POST['name'];
			$ret = mysqli_query($con, $query);
			if($ret->num_rows != 0){
				$RET["status"] = -1;
			}else{
				$query = "select * from repo_basic;";
				$ret = mysqli_query($con, $query);
				$query = "insert into repo_basic (repoName, description, userName, repoId, input, output) values (".$_POST["name"].",".$_POST["des"].",".$_POST["user"].", ".$ret->num_rows.",null,null);";
				$ret = mysqli_query($con, $query);
				$tableName = "repoTable"."_".$_POST["name"];
				$query = "drop table if exists ".$tableName;
				$ret = mysqli_query($con, $query);
				$query = "create table ".$tableName."(link varchar(32));";
				$ret = mysqli_query($con, $query);
				$RET["status"] = 200;
				session_start();
				$_SESSION["repoName"] = $_POST["name"];
				$_SESSION["repoDes"] = $_POST["des"];
			}
		}
		return $RET;
	}

	//// delete repository;
	// session-get;
	function deleteRepo($con, $RET){
		session_start();
		$tableName = "repotable"."_".$_SESSION["repoName"];
		$query = "drop table if exists ".$tableName;
		$ret = mysqli_query($con, $query);
		if($ret){
			$query = "delete from repo_basic where repoName='".$_SESSION["repoName"]."'";
			$ret = mysqli_query($con, $query);
			if($ret){
				$RET["status"] = 200;
			}else{
				$RET["status"] = -2;
			}
		}else{
			$RET["status"] = -1;
		}
		return $RET;
	}

	//// list out projects;
	function listRepo($con, $RET){
		$query = "select repoName from repo_basic;";
		$ret = mysqli_query($con, $query);
		if($ret->num_rows != 0){
			$RET["status"] = 200;
			$RET["repo"] = mysqli_fetch_all($ret);

		}else{
			$RET["status"] = -1;
			$RET["repo"] = array();
		}
		return $RET;
	}

	//// load specific repository;
	// session-set;
	function loadRepo($con, $RET){
		$tableName = "repotable"."_".$_POST["repoName"];
		$query = "select * from ".$tableName.";";
		$ret = mysqli_query($con, $query);
		if($ret){
			session_start();
			$_SESSION["repoName"] = $_POST["repoName"];
			$RET["status"] = 200;
			$RET["link"] = mysqli_fetch_all($ret);
		}else{
			$RET["status"] = -1;
		}
		return $RET;
	}

	//// main:
	$con = connectDB();
	$ret = array();
	if(isset($_POST['type']) && !empty($_POST['type'])){
		switch ($_POST['type']) {
			case "list":
				$ret = listRepo($con, $ret);
				break;
			case "create":
				$ret = createRepo($con, $ret);
				break;
			case "load":
				$ret = loadRepo($con, $ret);
				break;
			case "delete":
				$ret = deleteRepo($con, $ret);
				break;
			default:
				# code...
				break;
		}
	}
	mysqli_close($con);
	echo json_encode($ret);

?>