<?php
if(isset($_FILES["file"]["type"])){
	if ((($_FILES["file"]["type"] == "image/gif") || ($_FILES["file"]["type"] == "image/jpeg") || ($_FILES["file"]["type"] == "image/jpg"))){
		if ($_FILES["file"]["error"] > 0){
		    echo "Error: " . $_FILES["file"]["error"] . "<br />";
	    }else{
		    echo "Upload: " . $_FILES["file"]["name"] . "<br />";
		    echo "Type: " . $_FILES["file"]["type"] . "<br />";
		    echo "Size: " . ($_FILES["file"]["size"] / 1024) . " Kb<br />";
		    // echo "Stored in: " . $_FILES["file"]["tmp_name"];
			if (file_exists("C:/wamp64/www/stu/upload/" . $_FILES["file"]["name"])){
		    	echo $_FILES["file"]["name"] . " already exists. ";
		    }else{
		    	move_uploaded_file($_FILES["file"]["tmp_name"], "C:/wamp64/www/stu/upload/" . $_FILES["file"]["name"]);
		    	echo "Stored in: " . "C:/wamp64/www/stu/upload/" . $_FILES["file"]["name"];
		    }
	    }	
	}else{
		echo "Invalid file";
	}
}
?>