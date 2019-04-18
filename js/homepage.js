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

function checkLogin(){
	$.ajax({
        url: "php/account.php",
        dataType: 'json',
        method: 'POST',
        data: {"type":"check"},
        success: function(data){
        	if(data["status"] != null){
        		if(data["status"] == 200){
        			listRepo();
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
            url: "php/repository.php",
            dataType: 'json',
            method: 'POST',
            data: {"type":"create", "name":name.value, "des":des.value, "user": cookie.get("user")},
            success: function(data){
                if(data["status"] != null){
                    if(data["status"] == 200){
                        alert("success!");
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

function createUpload(){
    var bar = document.getElementById('js-progressbar');

    UIkit.upload('.js-upload', {

        url: '',
        multiple: true,

        beforeSend: function (environment) {
            console.log('beforeSend', arguments);

            // The environment object can still be modified here. 
            // var {data, method, headers, xhr, responseType} = environment;

        },
        beforeAll: function () {
            console.log('beforeAll', arguments);
        },
        load: function () {
            console.log('load', arguments);
        },
        error: function () {
            console.log('error', arguments);
        },
        complete: function () {
            console.log('complete', arguments);
        },

        loadStart: function (e) {
            console.log('loadStart', arguments);

            bar.removeAttribute('hidden');
            bar.max = e.total;
            bar.value = e.loaded;
        },

        progress: function (e) {
            console.log('progress', arguments);

            bar.max = e.total;
            bar.value = e.loaded;
        },

        loadEnd: function (e) {
            console.log('loadEnd', arguments);

            bar.max = e.total;
            bar.value = e.loaded;
        },

        completeAll: function () {
            console.log('completeAll', arguments);

            setTimeout(function () {
                bar.setAttribute('hidden', 'hidden');
            }, 1000);

            alert('Upload Completed');
        }

    });
}

//// [step1] create routine;
function createStep1(){
    // display previous btn;
    var emptyBtn = document.getElementById("step0EmptyBtn");
    emptyBtn.style.display = "none";
    // title;
    document.getElementById("contentTitle").innerHTML = "Step1. Set Input && Output";
    var father = document.getElementById("tableBody");
    father.innerHTML = "";
    var row = document.createElement("tr");
    row.style.width = "600px";
    father.append(row);
    // input;
    var row = document.createElement("tr");
    var input = document.createElement("td");
    input.innerHTML = "Input: ";
    row.append(input);
    var inputDiv = document.createElement("select");
    inputDiv.className = "dropdown";
    inputDiv.id = "step0Input";
    inputDiv.innerHTML = "<option disabled selected></option>";
    inputDiv.onchange = function(){ // dynamically load;
        var choose = $("#step0Input").find("option:selected").text();
        var inputTr = document.getElementById("Step0Input_holder");
        inputTr .innerHTML = "<td></td>";
        switch(choose){
            case "From file path":
                var newInput = document.createElement("input");
                inputTr.append(insertTd(newInput));
                inputTr.style.display = "";
                break;
            case "Upload":
                var newInput = document.createElement("input");
                newInput.multiple = "";
                newInput.type = "file";
                var newBtn = document.createElement("button");
                newBtn.type = "button";
                newBtn.className = "uk-button uk-button-default";
                newBtn.tabindex = "-1";
                inputTr.append(insertTd(newInput));
                inputTr.ukFormCustom = "";
                inputTr.style.display = "";
                break;
        }
    };
    var option0 = document.createElement("option");
    option0.innerHTML = "From file path";
    inputDiv.append(option0);
    var option1 = document.createElement("option");
    option1.innerHTML = "Upload";
    inputDiv.append(option1);
    row.append(insertTd(inputDiv));
    father.append(row);
    // input-prepared-div:
    var row = document.createElement("tr");
    row.innerHTML = "<td></td>";
    row.id = "Step0Input_holder";
    row.style.display = "none";
    father.append(row);
    // output;
    var row = document.createElement("tr");
    var output = document.createElement("td");
    output.innerHTML = "Output: ";
    row.append(output);
    var outputDiv = document.createElement("select");
    outputDiv.className = "dropdown";
    outputDiv.id = "step0Output";
    outputDiv.innerHTML = "<option disabled selected></option>";
    var option0 = document.createElement("option");
    option0.innerHTML = "Terminal";
    outputDiv.append(option0);
    var option1 = document.createElement("option");
    option1.innerHTML = "Download";
    outputDiv.append(option1);
    row.append(insertTd(outputDiv));
    father.append(row);
    // create submit btn;
    var row = document.createElement("tr");
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "uk-button-success uk-button circleBut uk-width-expand";
    btn.innerHTML = "Submit";
    btn.style.width = "150px";
    btn.addEventListener("click", function(){
        submitRepo();
    });
    row.append(insertTd(btn));
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "uk-button-success uk-button circleBut uk-width-expand";
    btn.innerHTML = "Delete";
    btn.style.width = "150px";
    btn.addEventListener("click", function(){
        deleteRepo();
    });
    row.append(insertTd(btn));
    father.append(row);
}

//// delete current repo;
function deleteRepo(){
    $.ajax({
        url: "php/repository.php",
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

function listRepo(){
    $.ajax({
        url: "php/repository.php",
        dataType: 'json',
        method: 'POST',
        data: {"type":"list"},
        success: function(data){
            if(data["status"] != null){
                if(data["status"] == 200){
                    loadRepo(data["repo"]);
                }else if(data["status"] == -1){
                    document.getElementById("contentTitle").innerHTML = "<b>Warning: No available Project.</b>";
                    loadRepo(data["repo"]);
                }
            }
        },
        error: function(){
            alert("[Error] Fail to post data!");
        }
    });
    
}

function loadRepo(repo){
    console.log(repo);
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
            child.innerHTML = repo[i];
            child.onclick = function(){
                $.ajax({
                    url: "php/repository.php",
                    dataType: 'json',
                    method: 'POST',
                    data: {"type":"load", "repoName":this.innerHTML},
                    success: function(data){
                        if(data["status"] != null){
                            if(data["status"] == 200){
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
            child.innerHTML = repo[i];
            newLi.append(child);
            leftTab.append(newLi);
        }
        var contentTitle = document.getElementById("contentTitle");
        contentTitle.innerHTML = "Choose/Create a project.";
    }
    var emptyBtn = document.createElement("button");
    var newLi = document.createElement("li");
    emptyBtn.id = "step0EmptyBtn";
    emptyBtn.className = "uk-button uk-button-success uk-width-1-3 circleBut";
    emptyBtn.innerHTML = "Create";
    emptyBtn.addEventListener("click", function(){this.style.display="none"; processControl(0);}, false);
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

//// [step1] -> [step2] save current created/edited repo into DB;
function submitRepo(){
    alert(1);
    // if(validateFlow()){
    //     alert("link");
    //     var startId = null;
    //     var endId = null;
    //     var list = Array();
    //     $.each(jsPlumb.getAllConnections(),function(i,e){
    //         startId = e.endpoints[0].anchor.elementId;
    //         endId = e.endpoints[1].anchor.elementId;
    //         list.push(document.getElementById(startId).dataset.name + ":" + document.getElementById(endId).dataset.name);
    //     })
    //     $.ajax({
    //         url: "php/template.php",
    //         dataType: 'json',
    //         method: 'POST',
    //         data: {"type":"save", "list":list},
    //         success: function(data){
    //             if(data["status"] != null){
    //                 if(data["status"] == 200){
    //                     alert("Success!");
    //                     window.location.href = "homepage.html";
    //                 }else if(data["status"] == -1){
    //                     alert("[Error] Database");
    //                 }
    //             }
    //         },
    //         error: function(){
    //             alert("[Error] Fail to post data!");
    //         }
    //     });
    // }else{
    //     alert("Validation fail.");
    // }
}