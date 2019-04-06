function checkLogin(){
	$.ajax({
        url: "php/account.php",
        dataType: 'json',
        method: 'POST',
        data: {"type":"check"},
        success: function(data){
        	if(data["status"] != null){
        		if(data["status"] == 200){
                    listTem();
        		}else if(data["status"] == -1){
        			window.location.href = "login.html";
        		}
        	}
        },
        error: function(){
            alert("[Error] Fail to post data!");
            window.location.href = "login.html";
        }
    });
}

function createTem(btn){
    btn.style.display = "none";
    var father = document.getElementById("contentList");
    var dic = {"Name":"input", "Description":"input"}; // default info;
    for(var x in dic){
        var curDiv = document.createElement("li");
        curDiv.innerHTML = x;
        var cur = document.createElement(dic[x]);
        curDiv.append(cur);
        father.append(curDiv);
    };
    $.ajax({
        url: "php/template.php",
        dataType: 'json',
        method: 'POST',
        data: {"type":"getEle"},
        success: function(data){
            if(data["status"] != null){
                if(data["status"] == 200){
                    var curDiv = document.createElement("li");
                    curDiv.innerHTML = "Element:";
                    var curDiv1 = document.createElement("select");
                    curDiv1.id = "eleList";
                    curDiv1.className = "uk-width-1-3";
                    curDiv1.innerHTML = "<option value=\"\" style=\"display: none;\" disabled selected>Choose Elements</option>";
                    for(var i=0; i<data["ele"].length; i++){
                        var curOption = document.createElement("option");
                        curOption.innerHTML = data["ele"][i][0];
                        curDiv1.append(curOption);
                    }

                    curDiv.append(curDiv1);
                    father.append(curDiv);
                }else if(data["status"] == -1){
                    
                }
            }
        },
        error: function(){
            alert("[Error] Fail to post data!");
        }
    });
}

function listTem(){
	$.ajax({
        url: "php/template.php",
        dataType: 'json',
        method: 'POST',
        data: {"type":"list"},
        success: function(data){
        	if(data["status"] != null){
        		if(data["status"] == 200){
        			
        		}else if(data["status"] == -1){
        			document.getElementById("contentTitle").innerHTML = "<b>Warning: No available template.</b>";
        		}
                loadTemplate(data["tem"]);
        	}
        },
        error: function(){
            alert("[Error] Fail to post data!");
        }
    });
}

function loadTemplate(tem){
    if(tem.length == 0){
        var contentTitle = document.getElementById("contentTitle");
        contentTitle.innerHTML = "No Templates Found.";
    }else{
        var templateList = document.getElementById("templateList");
        templateList.innerHTML = "<b> Template List: </b>";
        var leftTab = document.getElementById("leftTab");
        for(var i=0; i<tem.length; i++){
            var newLi = document.createElement("li");
            var child = document.createElement("a");
            child.href = "#";
            child.innerHTML = tem[i];
            newLi.append(child);
            leftTab.append(newLi);
        }
        var contentTitle = document.getElementById("contentTitle");
        contentTitle.innerHTML = "Choose/Create a template.";
    }
    var emptyBut = document.createElement("button");
    var newLi = document.createElement("li");
    emptyBut.className = "uk-button uk-button-success uk-width-1-3 circleBut";
    emptyBut.innerHTML = "Create";
    emptyBut.addEventListener("click", function(){createTem(this)}, false);
    var father = document.getElementById("contentList");
    newLi.append(emptyBut);
    father.append(newLi);
}