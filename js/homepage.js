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

function loadRepo(repo){
	if(repo == null){
		var emptyBut = document.createElement("button");
		emptyBut.className = "uk-button uk-button-success uk-width-1-3 circleBut";
		emptyBut.innerHTML = "Create";
		var father = document.getElementById("content");
		father.append(emptyBut);
	}else{
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