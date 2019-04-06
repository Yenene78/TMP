function checkLogin(){
	$.ajax({
        url: "php/account.php",
        dataType: 'json',
        method: 'POST',
        data: {"type":"check"},
        success: function(data){
        	if(data["status"] != null){
        		if(data["status"] == 200){
        			loadRepo(data["repo"]);
        		}else if(data["status"] == -1){
        			// window.location.href = "login.html";
        		}
        	}
        },
        error: function(){
            alert("[Error] Fail to post data!");
            // window.location.href = "login.html";
        }
    });
}

function createRepo(){
	$.ajax({
        url: "php/template.php",
        dataType: 'json',
        method: 'POST',
        data: {"type":"list"},
        success: function(data){
        	if(data["status"] != null){
        		if(data["status"] == 200){
        			alert("NON-complete;");
        		}else if(data["status"] == -1){
        			document.getElementById("contentTitle").innerHTML = "<b>Warning: No available template.</b>";
        		}
        	}
        },
        error: function(){
            alert("[Error] Fail to post data!");
            // window.location.href = "login.html";
        }
    });
}

function loadRepo(repo){
	if(repo.length == 0){
		var emptyBut = document.createElement("button");
		var newLi = document.createElement("li");
		emptyBut.className = "uk-button uk-button-success uk-width-1-3 circleBut";
		emptyBut.innerHTML = "Create";
		emptyBut.addEventListener("click", function(){createRepo()}, false);
		var father = document.getElementById("contentList");
		newLi.append(emptyBut);
		father.append(newLi);
		var contentTitle = document.getElementById("contentTitle");
		contentTitle.innerHTML = "No Projects Found.";
	}else{
		var projectList = document.getElementById("projectList");
		projectList.innerHTML = "<b> Project List: </b>";
		var leftTab = document.getElementById("leftTab");
		for(var i=0; i<repo.length; i++){
			var newLi = document.createElement("li");
			var child = document.createElement("a");
			child.href = "#";
			child.innerHTML = repo[i];
			newLi.append(child);
			leftTab.append(newLi);
		}
	}
}