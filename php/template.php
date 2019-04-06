<?php

	function connectDB(){
		$con = mysqli_connect("localhost:3308", "root", "", "web");
		if(mysqli_connect_errno($con)){
			die('Could not connect: ' . mysqli_error($con));
		}
		return $con;
	}

	function getElement($con, $RET){
		$query = "select * from element_basic;";
		$ret = mysqli_query($con, $query);
		if($ret->num_rows != 0){
			$RET["status"] = 200;
			$RET["field"] = mysqli_fetch_fields($ret);
			$RET["ele"] = mysqli_fetch_all($ret);
		}else{
			$RET["status"] = -1;
			$RET["ele"] = array();
		}
		return $RET;
	}

	function listRepo($con, $RET){
		$query = "select templateName from template_basic;";
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


	$con = connectDB();
	$ret = array();
	if(isset($_POST['type']) && !empty($_POST['type'])){
		switch ($_POST['type']) {
			case "list":
				$ret = listRepo($con, $ret);
				break;
			case "getEle":
				$ret = getElement($con, $ret);
				break;
			default:
				# code...
				break;
		}
	}
	mysqli_close($con);
	echo json_encode($ret);




?>