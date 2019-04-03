function clearInput(){
    var inputList = document.getElementsByTagName("input");
    for(var i=0; i<inputList.length; i++){
        inputList[i].value = "";
    }
}

function checkName(name){
    var warnDiv = document.getElementById("warning");
    if((name).length < 3){
        setWarn("<b>Warning:</b> Too short Username!");
        return;
    }
}

function checkPwd(input){
    var inputList = document.getElementsByTagName("input");
    var warnDiv = document.getElementById("warning");
    for(var i=0; i<inputList.length; i++){
    	if((inputList[i].value.length < 6) && (i > 0)){
    		setWarn("<b>Warning:</b> Too short Password!");
        	return;
    	}
    }
    if(inputList.length > 2){
    	var input0 = document.getElementById("pwd");
    	var input1 = document.getElementById("pwd1");
    	if(input0.value != input1.value){
	        setWarn("<b>Warning:</b> Different Passwords.");
	        return;
	    };
    }
    recoverWarn();
}

function recoverWarn(){
    var warnDiv = document.getElementById("warning");
    warnDiv.innerHTML = "";
    warnDiv.style.display = "none";
}

function setWarn(str){
    var warnDiv = document.getElementById("warning");
    warnDiv.innerHTML = str;
    warnDiv.style.color = "red";
    warnDiv.style.display = "";
}