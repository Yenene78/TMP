//// cookie;
var cookie = {
    set:function(key, val, time){
        var date = new Date();
        var expiresDays = time;
        date.setTime(date.getTime()+expiresDays*24*3600*1000);
        document.cookie = key + "=" + val +";expires=" + date.toGMTString();
    },
    get:function(key){
        var getCookie = document.cookie.replace(/[ ]/g,"");
        var arrCookie = getCookie.split(";")
        var tips;
        for(var i=0; i<arrCookie.length; i++){
            var arr = arrCookie[i].split("="); 
            if(key==arr[0]){
                tips = arr[1];
                break;
            }
        }
        return tips;
    },
    delete:function(key){
        var date = new Date();
        date.setTime(date.getTime()-10000);
        document.cookie = key + "=v; expires =" + date.toGMTString();
        return tips;
    }
};

//// get info of tool && add to canvas;
var eleList = Array();
var eleCounter = 0;
function addToCanvas(tool){
    var father = document.getElementById("cvsDiv");
    // ele;
    var ele = document.createElement("div");
    ele.className = "element circleBut";
    ele.innerHTML = tool.dataset.name + "<br>" + "<FONT color=#C0C0C0>"+ tool.dataset.des + "</FONT>";
    ele.id = "ele_" + tool.dataset.name;
    ele.dataset.name = tool.dataset.name;
    ele.dataset.des = tool.dataset.des;
    ele.dataset.input = tool.dataset.input;
    ele.dataset.output = tool.dataset.output;
    ele.addEventListener("mousedown", function(e){  // delete;
        if(e.button == 2){
            jsPlumb.removeAllEndpoints($(this).attr("id"));
            eleList.pop(this);
            this.parentNode.removeChild(this);
        }
    });
    ele.dataset.ukTooltip = ""; // hover;
    // text translation for better understanding;
    var inputText = tool.dataset.input;
    var outputText = tool.dataset.output;
    tmpDic = {"*":"anything", "#":"None"};
    if(tmpDic[inputText]){
        inputText = tmpDic[inputText];
    };
    if(tmpDic[outputText]){
        inputText = tmpDic[outputText];
    };
    var eleTitle = inputText+"<br>"+outputText;
    ele.title = eleTitle;
    //// todo;
    // ele.addEventListener("", callback: EventListener, capture?: boolean)
    father.append(ele);
    eleList.push(ele);
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
                anchors: ['Left'],
                uuid: ele.id + "_input",
            }, comTar);
        };
        if(tool.dataset.output != "#"){
            jsPlumb.addEndpoint(ele.id, {
                anchors: ['Right'],
                uuid: ele.id + "_output",
            }, comSou);
        };
        console.log(ele.id);
        jsPlumb.draggable(ele.id);
    });
    jsPlumb.bind("beforeDrop", function(connInfo, originalEvent){
        var source = document.getElementById(connInfo.connection.sourceId);
        var target = document.getElementById(connInfo.connection.targetId);
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

//// chack login status;
// todo: better;
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

//// add elements according to the linkList;
function createLink(start, end){
    startId = "tool_" + start;
    endId = "tool_" + end;
    if(!document.getElementById("ele_"+start)){
        addToCanvas(document.getElementById(startId));
    }
    if(!document.getElementById("ele_"+end)){
        addToCanvas(document.getElementById(endId));
    }
    // link;
    jsPlumb.connect({
        uuids: ["ele_" + start + "_output", "ele_" + end + "_input"],
    });
}

// //// get elements list from DB;
// function createTem(btn){
//     btn.style.display = "none";
//     var father = document.getElementById("contentList");
//     var dic = {"Name":"input", "Description":"input"}; // default info;
//     for(var x in dic){
//         var curDiv = document.createElement("li");
//         curDiv.innerHTML = x;
//         var cur = document.createElement(dic[x]);
//         curDiv.append(cur);
//         father.append(curDiv);
//     };
//     $.ajax({
//         url: "php/template.php",
//         dataType: 'json',
//         method: 'POST',
//         data: {"type":"getEle"},
//         success: function(data){
//             if(data["status"] != null){
//                 if(data["status"] == 200){
//                     var curDiv = document.createElement("div");
//                     curDiv.innerHTML = "Element:";
//                     var curDiv1 = document.createElement("select");
//                     curDiv1.id = "eleList";
//                     curDiv1.className = "uk-width-1-3";
//                     curDiv1.innerHTML = "<option value=\"\" style=\"display: none;\" disabled selected>Choose Elements</option>";
//                     for(var i=0; i<data["ele"].length; i++){
//                         var curOption = document.createElement("option");
//                         curOption.innerHTML = data["ele"][i][0];
//                         curDiv1.append(curOption);
//                     }
//                     curDiv.append(curDiv1);
//                     father.append(curDiv);
//                 }else if(data["status"] == -1){
//                     alert("error");
//                 }
//             }
//         },
//         error: function(){
//             alert("[Error] Fail to post data!");
//         }
//     });
// }

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

//// [step1] create routine;
function createStep1(){
    // display previous btn;
    var emptyBtn = document.getElementById("step0EmptyBtn");
    emptyBtn.style.display = "none";
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
    cvsDiv.oncontextmenu = function(e){
    　　return false;
    }
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
    // create eles -> createLink:
    var curLink = "";
    if(linkList != null){
        for(var i=0; i<linkList.length; i++){
            curLink = linkList[i][0].split(":");
            createLink(curLink[0], curLink[1]);
        }
    }
}

//// [step1] create tool bar by achieving elements from DB;
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
        async: false, 
        data: {"type":"getEle"},
        success: function(data){
            if(data["status"] != null){
                if(data["status"] == 200){
                    // create tools;
                    for(var i=0; i<data["ele"].length; i++){
                        var newLi = document.createElement("li");
                        var newA = document.createElement("button");
                        var icon = document.createElement("i");
                        icon.className = "uk-icon-star";
                        newA.append(icon);
                        newA.innerHTML += data["ele"][i][0];
                        newA.id = "tool_" + data["ele"][i][0];
                        newA.dataset.name = data["ele"][i][0];
                        newA.dataset.des = data["ele"][i][1];
                        newA.dataset.path = data["ele"][i][2];
                        newA.dataset.input = data["ele"][i][3];
                        newA.dataset.output = data["ele"][i][4];
                        newA.addEventListener("click", function(){addToCanvas(this); console.log("adding: " + this.id);});
                        newA.className = "tools circleBut"; // uk-parent if has subs;
                        newLi.append(newA);
                        nav.append(newLi);
                    }
                    // create submit btn;
                    var btn = document.createElement("button");
                    btn.type = "button";
                    btn.className = "uk-button-success uk-button circleBut uk-width-expand";
                    btn.innerHTML = "Save";
                    btn.addEventListener("click", function(){
                        submitTem();
                    });
                    nav.append(btn);
                    // create delete btn;
                    var btn = document.createElement("button");
                    btn.type = "button";
                    btn.className = "uk-button-success uk-button circleBut uk-width-expand";
                    btn.innerHTML = "Delete";
                    btn.addEventListener("click", function(){
                        deleteTem();
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

//// delete current template;
function deleteTem(){
    $.ajax({
        url: "php/template.php",
        dataType: 'json',
        method: 'POST',
        data: {"type":"delete"},
        success: function(data){
            if(data["status"] != null){
                if(data["status"] == 200){
                    alert("Success!");
                    window.location.reload(); 
                }else if(data["status"] == -1){
                    alert("[Error] Database");
                }
            }
        },
        error: function(){
            alert("[Error] Fail to post data!");
        }
    });
}

//// insert cur element into a <tr>;
function insertTd(ele){
    var td = document.createElement("td");
    td.append(ele);
    return td;
}

//// check with DB about templates info -> loadTemplate;
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

//// list out all available templates;
var linkList = null;
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
            child.innerHTML = tem[i];
            child.onclick = function(){
                $.ajax({
                    url: "php/template.php",
                    dataType: 'json',
                    method: 'POST',
                    data: {"type":"load", "temName":this.innerHTML},
                    success: function(data){
                        if(data["status"] != null){
                            if(data["status"] == 200){
                                linkList = data["link"];
                                processControl(1);
                            }else if(data["status"] == -1){
                                alert("fail");
                            }    
                        }
                    },
                    error: function(){
                        alert("[Error] Fail to post data!");
                    }
                });
            }
            child.innerHTML = tem[i];
            newLi.append(child);
            leftTab.append(newLi);
        }
        var contentTitle = document.getElementById("contentTitle");
        contentTitle.innerHTML = "Choose/Create a template.";
    }
    var emptyBtn = document.createElement("button");
    var newLi = document.createElement("tr");
    emptyBtn.id = "step0EmptyBtn";
    emptyBtn.className = "uk-button uk-button-success uk-width-1-3 circleBut";
    emptyBtn.type = "button";
    emptyBtn.innerHTML = "Create";
    emptyBtn.addEventListener("click", function(){processControl(0); this.style.display = "none";});
    var father = document.getElementById("contentList");
    newLi.append(emptyBtn);
    father.append(newLi);
}

//// controller;
function processControl(step){
    switch(step){
        case 0:
            createStep0();
            break;
        case 1:
            createStep1();
            break;
    }
}


//// [step1] validate workflow;
// todo: better validation rules;
function validateFlow(){
    if((jsPlumb.getAllConnections().length == 0) || (jsPlumb.getAllConnections().length <= eleList.length-2)){
        return false;
    }
    return true;
}

//// [step1] -> [step2] save current created/edited template into DB;
function submitTem(){
    if(validateFlow()){
        alert("link");
        var startId = null;
        var endId = null;
        var list = Array();
        $.each(jsPlumb.getAllConnections(),function(i,e){
            startId = e.endpoints[0].anchor.elementId;
            endId = e.endpoints[1].anchor.elementId;
            list.push(document.getElementById(startId).dataset.name + ":" + document.getElementById(endId).dataset.name);
        })
        $.ajax({
            url: "php/template.php",
            dataType: 'json',
            method: 'POST',
            data: {"type":"save", "list":list},
            success: function(data){
                if(data["status"] != null){
                    if(data["status"] == 200){
                        alert("Success!");
                        window.location.href = "homepage.html";
                    }else if(data["status"] == -1){
                        alert("[Error] Database");
                    }
                }
            },
            error: function(){
                alert("[Error] Fail to post data!");
            }
        });
    }else{
        alert("Validation fail.");
    }
}