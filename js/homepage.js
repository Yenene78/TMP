function checkLogin(){
	$.ajax({
        url: "php/account.php",
        dataType: 'json',
        method: 'POST',
        data: {"type":"check"},
        success: function(data){
        	if(data["status"] != null){
        		if(data["status"] == 200){
        			loadRepo();
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

//// [step0] create a submit button;
function createBtnSub(){
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "uk-button-success uk-button circleBut uk-width-expand";
    btn.innerHTML = "Submit";
    btn.id = "step0Btn";
    btn.addEventListener("click", function(){
        var name = document.getElementById("step0Name");
        var des= document.getElementById("step0Des");
        $.ajax({
            url: "php/template.php",
            dataType: 'json',
            method: 'POST',
            data: {"type":"create", "name":name.value, "des":des.value, "user": cookie.get("user")},
            success: function(data){
                if(data["status"] != null){
                    if(data["status"] == 200){
                        processControl(1);
                    }else if(data["status"] == -1){
                        alert("Existed Template!");
                    }else if(data["status"] == -2){
                        alert("Invalid input!");
                    }
                }
            },
            error: function(){
                alert("[Error] Fail to post data!");
            }
        });
    });
    return btn;
}

function createRepo(){
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
                    var curDiv = document.createElement("div");
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
                    alert("error");
                }
            }
        },
        error: function(){
            alert("[Error] Fail to post data!");
        }
    });
}

//// [step0] create routine;
function createStep0(){
    // title;
    document.getElementById("contentTitle").innerHTML = "Step0. Basic Information";
    var father = document.getElementById("tableBody");
    // nameDiv;
    var row = document.createElement("tr");
    var name = document.createElement("td");
    name.innerHTML = "Name: ";
    row.append(name);
    var nameDiv = document.createElement("input");
    nameDiv.className = "field";
    nameDiv.id = "step0Name";
    row.append(insertTd(nameDiv));
    father.append(row);
    // description div;
    row = document.createElement("tr");
    var des = document.createElement("td");
    des.innerHTML = "Description: ";
    row.append(des);
    var description = document.createElement("textarea");
    description.className = "field";
    description.style.overflow = "hidden";
    description.cols = "50";
    description.rows = "5";
    description.id = "step0Des";
    row.append(insertTd(description));
    father.append(row);
    // button div;
    row = document.createElement("tr");
    row.append(insertTd(createBtnSub()));
    father.append(row);
}

//// insert cur element into a <tr>;
function insertTd(ele){
    var td = document.createElement("td");
    td.append(ele);
    return td;
}

function loadRepo(){
    var repo = null;
    $.ajax({
        url: "php/repository.php",
        dataType: 'json',
        method: 'POST',
        data: {"type":"list"},
        success: function(data){
            if(data["status"] != null){
                if(data["status"] == 200){
                    repo = data["repo"];
                }else if(data["status"] == -1){
                    document.getElementById("contentTitle").innerHTML = "<b>Warning: No available template.</b>";
                }
            }
        },
        error: function(){
            alert("[Error] Fail to post data!");
        }
    });
    var projectList = document.getElementById("projectList");
    projectList.innerHTML = "<b> Project List: </b>";
	if(repo == null){
		var contentTitle = document.getElementById("contentTitle");
		contentTitle.innerHTML = "No Projects Found.";
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
		var contentTitle = document.getElementById("contentTitle");
		contentTitle.innerHTML = "Choose/Create a project.";
	}
	var emptyBut = document.createElement("button");
	var newLi = document.createElement("li");
	emptyBut.className = "uk-button uk-button-success uk-width-1-3 circleBut";
	emptyBut.innerHTML = "Create";
	emptyBut.addEventListener("click", function(){processControl(0); this.style.display="none";}, false);
	var father = document.getElementById("contentList");
	newLi.append(emptyBut);
	father.append(newLi);
}

//// controller;
function processControl(step){
    switch(step){
        case 0:
            createStep0();
            break;
    }
}