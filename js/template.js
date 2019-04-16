var cookie = {
    set:function(key,val,time){//设置cookie方法
        var date=new Date(); //获取当前时间
        var expiresDays=time;  //将date设置为n天以后的时间
        date.setTime(date.getTime()+expiresDays*24*3600*1000); //格式化为cookie识别的时间
        document.cookie=key + "=" + val +";expires="+date.toGMTString();  //设置cookie
    },
    get:function(key){//获取cookie方法
        /*获取cookie参数*/
        var getCookie = document.cookie.replace(/[ ]/g,"");  //获取cookie，并且将获得的cookie格式化，去掉空格字符
        var arrCookie = getCookie.split(";")  //将获得的cookie以"分号"为标识 将cookie保存到arrCookie的数组中
        var tips;  //声明变量tips
        for(var i=0;i<arrCookie.length;i++){   //使用for循环查找cookie中的tips变量
            var arr=arrCookie[i].split("=");   //将单条cookie用"等号"为标识，将单条cookie保存为arr数组
            if(key==arr[0]){  //匹配变量名称，其中arr[0]是指的cookie名称，如果该条变量为tips则执行判断语句中的赋值操作
                tips=arr[1];   //将cookie的值赋给变量tips
                break;   //终止for循环遍历
            }
        }
    },
      delete:function(key){ //删除cookie方法
         var date = new Date(); //获取当前时间
         date.setTime(date.getTime()-10000); //将date设置为过去的时间
         document.cookie = key + "=v; expires =" +date.toGMTString();//设置cookie
         return tips;
        }
        
    };

var eleList = Array();
var eleCounter = 0;
function addToCanvas(tool){
    var father = document.getElementById("cvsDiv");
    // ele;
    var ele = document.createElement("div");
    ele.className = "element circleBut";
    ele.innerHTML = tool.dataset.des +"<br>" + tool.dataset.input + "<br>" + tool.dataset.output;
    ele.id = eleCounter.toString();
    ele.dataset.des = tool.dataset.des;
    ele.dataset.input = tool.dataset.input;
    ele.dataset.output = tool.dataset.output;
    eleCounter += 1;
    father.append(ele);
    eleList.push(ele);
    console.log(ele.id);
    var comSou = {
        isSource: true,
        connector: ["Straight"]
    }
    var comTar = {
        isTarget: true,
        connector: ["Straight"]
    };
    jsPlumb.ready(function(){
        if(tool.dataset.input != "#"){
            jsPlumb.addEndpoint(ele.id, {
                anchors: ['Left']
            }, comTar);
        };
        if(tool.dataset.output != "#"){
            jsPlumb.addEndpoint(ele.id, {
                anchors: ['Right']
            }, comSou);
        };
        jsPlumb.draggable(ele.id);
    });
    jsPlumb.bind("beforeDrop", function(connInfo, originalEvent){
        var source = document.getElementById(connInfo.connection.sourceId);
        var target = document.getElementById(connInfo.connection.targetId);
        console.log(connInfo);
        if(source == target){
            alert("Cannot connect to self!");
            return false;
        }else{
            if((source.dataset.output != target.dataset.input) && (source.dataset.output != "*") && (target.dataset.input != "*")){
                alert("Type not fit!");
                console.log(source.dataset.output, target.dataset.input);
                return false;
            }
        }
        return true; 
    });
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
                    cookie.set("user", data["user"], 1);
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
    btn.addEventListener("click", function(){
        var name = document.getElementById("step0Name");
        var des= document.getElementById("step0Des");
        $.ajax({
            url: "php/template.php",
            dataType: 'json',
            method: 'POST',
            data: {"type":"create", "name":name.value, "des":des.value, "user":document.cookie.get["user"]},
            success: function(data){
                if(data["status"] != null){
                    if(data["status"] == 200){
                        processControl(this, 1);
                    }else if(data["status"] == -1){
                        alert("Invalid Input!");
                        processControl(this, 0);
                    }
                }
            },
            error: function(){
                alert("[Error] Fail to post data!");
                processControl(this, 0);
            }
        });
        
    });
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
    cvsDiv.className = "uk-position-absolute canvas";
    cvsDiv.id = "cvsDiv";
    cvsDiv.style.width = row.style.width;
    cvsDiv.style.height = "400px";
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
                        newA.addEventListener("click", function(){addToCanvas(this)});
                        newA.className = "tools circleBut"; // uk-parent if has subs;
                        newLi.append(newA);
                        nav.append(newLi);
                    }
                    // create submit btn;
                    var btn = document.createElement("button");
                    btn.type = "button";
                    btn.className = "uk-button-success uk-button circleBut uk-width-expand";
                    btn.innerHTML = "Submit";
                    btn.addEventListener("click", function(){
                        submitTem();
                    });
                    nav.append(btn);
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


function validateFlow(){
    if((jsPlumb.getAllConnections().length == 0) || (jsPlumb.getAllConnections().length <= eleList.length-2)){
        return false;
    }
    return true;
}

function submitTem(){
    if(validateFlow()){
        alert("link");
        $.each(jsPlumb.getAllConnections(),function(i,e){
            console.log(e.endpoints);
            // startId = e.endpoints[0].anchor.elementId;
            // endId = e.endpoints[1]
            // console.log();//开始位置
            // console.log(e.endpoints[1].anchor.elementId);//结束位置
        })
        // $.ajax({
        //     url: "php/template.php",
        //     dataType: 'json',
        //     method: 'POST',
        //     data: {"type":"save"},
        //     success: function(data){
        //         if(data["status"] != null){
        //             if(data["status"] == 200){
        //                 alert("Success!");
        //             }else if(data["status"] == -1){
        //                 alert("[Error] Database");
        //             }
        //         }
        //     },
        //     error: function(){
        //         alert("[Error] Fail to post data!");
        //     }
        // });
    }else{
        alert("Validation fail.");
    }
}