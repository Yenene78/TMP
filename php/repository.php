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

	//// check path of file if existed;
	// add 2>&1 to determine the bug;
	function checkFile($con, $RET){
		ob_start();
		$isWin = strtoupper(substr(PHP_OS,0,3)) === 'WIN'?true:false;
		$isLin = strtoupper(substr(PHP_OS,0,3)) === 'LIN'?true:false;
		if($isWin){
			$com = "cd C:\wamp64\www\TMP";
			system($com, $s);
			if($s == 1){
				$RET["status"] = -1;
				return $RET;
			}else{
				$com = "cd C:\wamp64\www\TMP && if exist ".$_POST["path"]." (echo 0) else (echo 1)"; // <cd ...> is fockingly necessary;
				$out = system($com, $s);
				if($out == "1"){
					$RET["status"] = -1;
					return $RET;
				}else{
					ob_clean();
					ob_end_flush();
					$RET["status"] = 200;
					return $RET;
				}
			}
		}elseif($isLin){
			$com = "cd /home/tools && ls ".$_POST["path"];
			// $com = "ls 2>&1";
			$out = system($com, $s);
			if($out != $_POST["path"]){
				$RET["status"] = -1;
				return $RET;
			}else{
				ob_clean();
				ob_end_flush();
				$RET["status"] = 200;
				return $RET;
			}
		}
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

	//// execute the workflow;
	// session-get;
	// todo: can improve algorithm;
	function execFlow($con, $RET){
		$isWin = strtoupper(substr(PHP_OS,0,3)) === 'WIN'?true:false;
		$isLin = strtoupper(substr(PHP_OS,0,3)) === 'LIN'?true:false;
		session_start();
		ob_start();
		$temName = $_POST["temName"];
		$query = "select * from temTable_".$temName.";";
		$ret = mysqli_query($con, $query);
		$eleList = mysqli_fetch_all($ret);
		$flow = Array();
		foreach($eleList as $v){
			$start = explode(":", $v[0])[0];
			if($start == "INPUT"){
				$start = $_POST["input"];
			}else{ // find out the exec progrom for current element:
				$query = "select path from element_basic where elementName='".$start."';";
				$ret = mysqli_query($con, $query);
				if(!$ret){
					$RET["status"] = -1;
					return $RET;
				}
				$start = mysqli_fetch_all($ret)[0][0];
			}
			array_push($flow, $start);
			$end = explode(":", $v[0])[1];
			if($end == "OUTPUT"){
				$end = $_POST["output"];
			}else{
				$query = "select path from element_basic where elementName='".$end."';";
				$ret = mysqli_query($con, $query);
				if(!$ret){
					$RET["status"] = -1;
					return $RET;
				}
				$end = mysqli_fetch_all($ret)[0][0];
			}
			array_push($flow, $end);
		}
		$RET["exec"] = $flow;
		$log = Array();
		if(sizeof($flow) <= 2){	// 1-2:
			$cur = $flow[0];
			if($isWin){
				$com = "cd C:\wamp64\www\TMP";
				$com = $com." && ";
				$com = $com."type ".$cur;
			}elseif($isLin){
				$com = "cd /home/tools";
				$com = $com." && ";
				$com = $com."echo ".$cur;
			}
			
			$ret = system($com, $s);
			$RET["status"] = 200;
			return $RET;
		}else{
			if($isWin){
				$com0 = "cd C:\wamp64\www\TMP";
			}elseif($isLin){
				$com0 = "cd /home/tools";
			}
			$ret = "";
			for($i=0; $i<sizeof($flow)-1; $i++){
				$cur = $flow[0];
				$next = $flow[1];
				if($i == 0){
					$com = $com0." &&python3 ".$next."<".$cur;
					$ret = system($com, $s);
					array_push($log, $ret);
				}else{
					if($cur != $next){
						$com = $com0." &&python3 ".$next."<".$ret;
						$ret = system($com, $s);
					}
					array_push($log, $ret);
				}
			}
			ob_clean();
			ob_end_flush();
			$RET["ret"] = $log;
			$RET["status"] = 200;
			return $RET;
		}
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
		$tableName = "repoTable"."_".$_POST["repoName"];
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

	//// save specific repository;
	// session-get;
	function saveRepo($con, $RET){
		session_start();
		$input = $_POST["input"];
		$output = $_POST["output"];
		$tableName = "repoTable"."_".$_SESSION["repoName"];
		$query = "drop table if exists ".$tableName;
		$ret = mysqli_query($con, $query);
		$query = "create table ".$tableName."(link varchar(32));";
		$ret = mysqli_query($con, $query);
		if($ret){
			$query = "update repo_basic set input='".$input."',output='".$output."' where repoName='".$_SESSION["repoName"]."'";
			$ret = mysqli_query($con, $query);
			if($ret){
				$RET["status"] = 200;
			}
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
			case "checkFile":
				$ret = checkFile($con, $ret);
				break;
			case "save":
				$ret = saveRepo($con, $ret);
				break;
			case "exec":
				$ret = execFlow($con, $ret);
				break;
			default:
				# code...
				break;
		}
	}
	mysqli_close($con);
	echo json_encode($ret);

?>