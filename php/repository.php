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

	//// list out projects;
	function listRepo($con, $RET){
		$query = "select repoName from repo_basic;";
		$ret = mysqli_query($con, $query);
		if($ret->num_rows != 0){
			$RET["status"] = 200;
			$RET["tem"] = mysqli_fetch_all($ret);

		}else{
			$RET["status"] = -1;
			$RET["tem"] = array();
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
			default:
				# code...
				break;
		}
	}
	mysqli_close($con);
	echo json_encode($ret);

?>