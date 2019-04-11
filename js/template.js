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
                    
                }
            }
        },
        error: function(){
            alert("[Error] Fail to post data!");
        }
    });
}

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
    row.append(insertTd(description));
    father.append(row);
    // button div;
    row = document.createElement("tr");
    row.append(insertTd(createBtnSub()));
    father.append(row);
}

function createStep1(){
    // title;
    document.getElementById("contentTitle").innerHTML = "Step1. Workflow";
    var father = document.getElementById("tableBody");
    father.innerHTML = "";
    var row = document.createElement("tr");
    // canvas;
    var canvas = document.createElement("canvas");
    canvas.className = "uk-width-expand uk-height-expand";
    canvas.id = "canvas";
    var context = canvas.getContext("2d");
    context.zoom = 1;
    drawGrid(context, "#ccc", 5, 5, 1);
    row.append(canvas);
    father.append(row);
    // icons;
    row = document.createElement("tr");
    var icon = document.createElement("i");
    var icon1 = document.createElement("i");
    icon.className = "uk-icon-plus-square uk-margin-small";
    icon1.className = "uk-icon-minus-square uk-margin-small";
    icon.addEventListener("click", function(){  // scale up;
        canvas = document.getElementById("canvas");
        context = canvas.getContext("2d");
        canvas.height = canvas.height;  // clear canvas;
        context.scale(2, 2);
        context.zoom= 2 * context.zoom;
        drawGrid(canvas.getContext("2d"), "#ccc", 5*context.zoom, 5*context.zoom);
    });
    icon1.addEventListener("click", function(){  // scale down;
        canvas = document.getElementById("canvas");
        context = canvas.getContext("2d");
        canvas.height = canvas.height;
        context.scale(0.5, 0.5);
        context.zoom= 0.5 * context.zoom;
        drawGrid(canvas.getContext("2d"), "#ccc", 5*context.zoom, 5*context.zoom);
    });
    row.append(icon);
    row.append(icon1);
    father.append(row);
}

function createBtnSub(){
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "uk-button-success uk-button circleBut uk-width-expand";
    btn.innerHTML = "Submit";
    btn.addEventListener("click", function(){processControl(this, 1);});
    return btn;
}

// [Cite]
 function drawGrid(context,color,stepx,stepy){
    context.strokeStyle = color;
    context.lineWidth = 0.5;
    // var scale = context.zoom;
    // stepx = stepx * scale;
    // stepy = stepy * scale;
    alert(context.canvas.width/stepx);
    for(var i = stepx+0.5;i<context.canvas.width;i+=stepx){
        context.beginPath();
        context.moveTo(i,0);
        context.lineTo(i,context.canvas.height);
        context.stroke();
    }

    for(var i = stepy+0.5;i<context.canvas.height;i+=stepy){
        context.beginPath();
        context.moveTo(0,i);
        context.lineTo(context.canvas.width,i);
        context.stroke();
    }
}

function insertTd(ele){
    var td = document.createElement("td");
    td.append(ele);
    return td;
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
        			loadTemplate(data["tem"]);
        		}else if(data["status"] == -1){
        			document.getElementById("contentTitle").innerHTML = "<b>Warning: No available template.</b>";
        		}    
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
    var newLi = document.createElement("tr");
    emptyBut.className = "uk-button uk-button-success uk-width-1-3 circleBut";
    emptyBut.type = "button";
    emptyBut.innerHTML = "Create";
    emptyBut.addEventListener("click", function(){processControl(this, 0);});
    var father = document.getElementById("contentList");
    newLi.append(emptyBut);
    father.append(newLi);
}


function processControl(btn, step){
    btn.style.display = "none";
    switch(step){
        case 0:
            createStep0();
            break;
        case 1:
            createStep1();
            break;
    }
}