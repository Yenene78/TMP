//获取实际的鼠标在canvas的位置
function windowToCanvas(x, y) {
    var canvas = document.getElementById("canvas");
    var bbox = canvas.getBoundingClientRect();
    return {
        x : x - bbox.left * (canvas.getContext("2d").canvas.width / bbox.width),
        y : y - bbox.top * (canvas.getContext("2d").canvas.height / bbox.width)
    };
}
//画横线，在y坐标上
function drawHorizontLine(y) {
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    context.beginPath();
    context.moveTo(0, y+0.5);
    context.lineTo(canvas.width, y+0.5);
    context.stroke();
}
//保存当前的canvas上的数据
function saveDrawingSurface() {
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    drawingSurfacsImageData = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
}
//恢复canvas的数据，主要用来显示最新的线段，擦除原来的线段
function restoreDrawingSurface() {
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    context.putImageData(drawingSurfacsImageData, 0, 0, 0, 0, context.canvas.width, context.canvas.height);
}
var lineData = Array();
//画最新的线条
function drawRubberbandShape(loc) {
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    context.strokeStyle = "#00BBEE";
    context.beginPath();
    context.moveTo(mousedown.x, mousedown.y);
    context.lineTo(loc.x, loc.y);
    context.stroke();
    lineData.startx = mousedown.x;
    lineData.starty = mousedown.y;
    lineData.endx = loc.x;
    lineData.endy = loc.y;
}
//更新
function  updateRubberband(loc) {  
    drawRubberbandShape(loc);
}

var pick = false;
var dragging = false;
var mousedown = {};
var canLink = false;
var drawingSurfacsImageData = null;
function addToCanvas(tool){
    var father = document.getElementById("cvsDiv");
    // ele;
    var ele = document.createElement("div");
    ele.className = "element circleBut";
    ele.innerHTML = tool.dataset.des +"<br>" + tool.dataset.input + "<br>" + tool.dataset.output;
    ele.addEventListener("mousedown", function(e){
        if(!dragging){
            var distanceX = e.clientX - this.offsetLeft;
            var distanceY = e.clientY - this.offsetTop;
            document.onmousemove = function(e){
                ele.style.left = e.clientX - distanceX + 'px';
                ele.style.top = e.clientY - distanceY + 'px';
            };
            document.onmouseup = function(e){
                document.onmousemove = null;
                document.onmouseup = null;     
            }
        }
    });
    // wings;
    var wing0 = document.createElement("img");
    wing0.className = "eleLink uk-position-absolute uk-position-right";
    wing0.src = "img/link.png";
    wing0.style.left = "45px";
    wing0.style.top = "20px";
    wing0.dataset.typeName = tool.dataset.output;
    rotateDiv(wing0, "90");
    var canvas = document.getElementById("canvas");
    wing0.addEventListener("mousedown", function(e){
        loc = windowToCanvas(e.clientX, e.clientY-this.offsetTop-90);
        e.preventDefault();
        saveDrawingSurface();
        mousedown.x = loc.x;
        mousedown.y = loc.y;
        dragging = true;
        father.onmousemove = function(e){
            //判断当前是否用户在拖动
            if(dragging) {
                dragObj = wing0;
                e.preventDefault();
                loc = windowToCanvas(e.clientX, e.clientY-this.offsetTop-20);  
                restoreDrawingSurface();
                updateRubberband(loc);
            }
        };
        father.onmouseup = function(e) {
            if(canLink){
                loc = windowToCanvas(e.clientX, e.clientY-this.offsetTop-20);
                restoreDrawingSurface();
                updateRubberband(loc);
            }else{
                // eraseLine();
                restoreDrawingSurface();
                console.log(lineData);
                // for(var i=0; i<lineData.length; i++){
                //     console.log(lineData[i]);
                // }
                // console.log(drawingSurfacsImageData);

            }
            //鼠标抬起，拖动标记设为否
            dragging = false;
            dragObj = null;
            this.onmousemove = null;
            this.onmouseup = null;
        };
    });
    ele.append(wing0);
    if(tool.dataset.input != "#"){
        var wing1 = document.createElement("img");
        wing1.className = "uk-position-absolute uk-position-right eleLink";
        wing1.src = "img/link.png";
        wing1.style.left = "-15px";
        wing1.style.top = "20px";
        wing1.dataset.typeName = tool.dataset.input;
        rotateDiv(wing1, "-90");
        wing1.addEventListener("mouseover", function(e){
            if(dragging){
                // check type:
                if((dragObj) && (dragObj.dataset.typeName == this.dataset.typeName)){
                    canLink = true;
                }else{
                    console.log("not fit");
                }
            }
        });

        ele.append(wing1);
    }
    father.append(ele);
    }

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

function createBtnSub(){
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "uk-button-success uk-button circleBut uk-width-expand";
    btn.innerHTML = "Submit";
    btn.addEventListener("click", function(){processControl(this, 1);});
    return btn;
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
    row.style.width = "600px";
    father.append(row);
    // canvas;
    var cvsDiv = document.createElement("div"); 
    cvsDiv.className = "uk-position-absolute cvsDiv";
    cvsDiv.id = "cvsDiv";
    cvsDiv.style.width = row.style.width;
    cvsDiv.style.height = "400px";
    var canvas = document.createElement("canvas");
    canvas.className = "canvas";
    canvas.style.position = "absolute";
    canvas.id = "canvas";
    canvas.width = "600";;
    canvas.height = "400";
    canvas.left = parseInt(cvsDiv.style.left);
    canvas.top = parseInt(cvsDiv.style.top);
    canvas.style.left = cvsDiv.style.left;
    canvas.style.top = cvsDiv.style.top;
    row.append(canvas);
    row.append(cvsDiv);
    // icons;
    row = document.createElement("tr");
    var icon = document.createElement("i");
    var icon1 = document.createElement("i");
    icon.className = "uk-icon-plus-square uk-margin-small";
    icon1.className = "uk-icon-minus-square uk-margin-small";
    icon.addEventListener("click", function(){  // scale up;
        canvas = document.getElementById("cvsDiv");
        alert("NON-complete");
    });
    icon1.addEventListener("click", function(){  // scale down;
        canvas = document.getElementById("cvsDiv");
        alert("NON-complete");
    });
    row.append(icon);
    row.append(icon1);
    father.append(row);
    // create Tool Bars;
    createToolBar();
}

function createToolBar(){
    var father = document.getElementById("content");
    var pannelDiv = document.createElement("div");
    pannelDiv.className = "uk-panel uk-panel-box uk-position-relative uk-width-1-6 uk-float-right";
    // title;
    var pannelTitle = document.createElement("h3");
    pannelTitle.innerHTML = "Tools";
    pannelDiv.append(pannelTitle);
    // nav;
    var nav = document.createElement("ul");
    nav.className = "uk-nav uk-nav-side uk-nav-parent-icon";
    nav.dataset.ukNav = "{multiple:true}";
    // get elements;
    $.ajax({
        url: "php/template.php",
        dataType: 'json',
        method: 'POST',
        data: {"type":"getEle"},
        success: function(data){
            if(data["status"] != null){
                if(data["status"] == 200){
                    for(var i=0; i<data["ele"].length; i++){
                        var newLi = document.createElement("li");
                        var newA = document.createElement("button");
                        var icon = document.createElement("i");
                        icon.className = "uk-icon-star";
                        newA.append(icon);
                        newA.innerHTML += data["ele"][i][0];
                        newA.dataset.name = data["ele"][i][0];
                        newA.dataset.des = data["ele"][i][1];
                        newA.dataset.path = data["ele"][i][2];
                        newA.dataset.input = data["ele"][i][3];
                        newA.dataset.output = data["ele"][i][4];
                        // newA.href = "";
                        newA.addEventListener("click", function(){addToCanvas(this)});
                        newLi.className = ""; // uk-parent if has subs;
                        newLi.append(newA);
                        nav.append(newLi);
                    }
                }else if(data["status"] == -1){
                    alert("No available elements found!");
                }
            }
        },
        error: function(){
            alert("[Error] Fail to post data!");
        }
    });
    pannelDiv.append(nav);
    father.append(pannelDiv);

}

// [Cite]
function drawGrid(context, color, stepx, stepy){
    context.strokeStyle = color;
    context.lineWidth = 0.5;
    var scale = document.getElementById("scale");
    scale = scale.innerHTML;
    stepx *= scale;
    stepy *= scale;
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

function rotateDiv(div, deg){
    div.style.webkitTransform = "rotate("+deg+"deg)";
    div.style.mozTransform = "rotate("+deg+"deg)";
    div.style.msTransform = "rotate("+deg+"deg)";
    div.style.oTransform = "rotate("+deg+"deg)";
    div.style.transform = "rotate("+deg+"deg)";
}