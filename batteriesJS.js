

function Battery(id,name,condition,percent,location,comments,handler,updated){
	this.name = name;
	this.id = id;
	this.condition = condition;
	this.percent = percent;
	this.location = location;
	this.comments = comments;
	this.handler = handler;
	this.updated = updated;
}

function unpackBatteries(){
	return localStorage.batteryList.split("¶").map(function(battery){return new Battery(battery.split("§")[0],battery.split("§")[1],battery.split("§")[2],battery.split("§")[3],battery.split("§")[4],battery.split("§")[5],battery.split("§")[6],battery.split("§")[7])/**/;},this);
}

function twoPlace(number){
	if(number < 10){
		return "0" + number;
	}else{
		return number;
	}
}

function currentTime(){
	var date = new Date();
	return twoPlace(date.getHours()) + ":" + twoPlace(date.getMinutes()) + ":" + twoPlace(date.getSeconds()) + " on " + date.getMonth() + "/" + date.getDate() + "/" + date.getFullYear();
}

function clearInfo(){
	document.getElementById("batteryName").value = "";
	document.getElementById("batteryCondition").value = "good";
	document.getElementById("batteryPercent").value = 130;
	document.getElementById("batteryLocation").value = "charging";
	document.getElementById("batteryComments").value = "";
	document.getElementById("batteryHandler").value = "";
	document.getElementById("batteryUpdated").innerHTML = "00:00:00 on 1/1/1970";
	document.getElementById("batteryComments").disabled = true;
	for(var i = 1 ; i < document.getElementsByTagName("input").length ; i++){
		document.getElementsByTagName("input")[i].disabled = true;
	}
	for(var i = 0 ; i < document.getElementsByTagName("select").length ; i++){
		document.getElementsByTagName("select")[i].disabled = true;
	}
	batteryOpened = -1;
}

var batteryList = localStorage.batteryList === undefined || localStorage.batteryList === "" ? [] : unpackBatteries();
batteryList[-1] = {
	save:function(){},
	delete:function(){}
}

var batteryOpened = -1;

function packBattery(battery){
	return battery.id + "§" + battery.name + "§" + battery.condition + "§" + battery.percent + "§" + battery.location + "§" + battery.comments + "§" + battery.handler + "§" + battery.updated;
}

function packAllBatteries(){
	var packedBatteries = "";
	for(var i = 0 ; i < batteryList.length ; i++){
		packedBatteries += packBattery(batteryList[i]);
		if(i !== batteryList.length - 1){
			packedBatteries += "¶" ;
		}
	}
	return packedBatteries;
}

Battery.prototype.display = function(){
	var li = document.createElement("LI");
	var t = document.createTextNode(this.name); 
	li.setAttribute("id", "battery-" + this.id);
	li.addEventListener("click",function(){batteryList[Number(this.id.slice(8,9))].openBattery()});
	li.appendChild(t);
	var span = document.createElement("span");
	span.setAttribute("class","extraText");
	if(this.percent > 100 && this.location === "notCharging"){
		t = document.createTextNode("Available");
		span.setAttribute("style","background-color:rgb(100,255,100);");
	}else if(this.location === "onRobot" || this.location === "inUse"){
		t = document.createTextNode("In Use");
		span.setAttribute("style","background-color:rgb(255,255,100);");
	}else{
		t = document.createTextNode("Not Available");
		span.setAttribute("style","background-color:rgb(255,100,100);");
	}
	li.appendChild(document.createElement("BR"));
	span.appendChild(t);
	li.appendChild(span);
	t = document.createTextNode("Logged by " + this.handler + " at " + this.updated);
	span = document.createElement("span");
	span.setAttribute("class","extraText");
	span.setAttribute("style","font-size:10px;");
	span.appendChild(t);
	li.appendChild(document.createElement("BR"));
	li.appendChild(span);
	document.getElementById("BatteryUL").appendChild(li);

}

Battery.prototype.openBattery = function(){
	for(var i = 0 ; i < document.getElementsByTagName("input").length ; i++){
		document.getElementsByTagName("input")[i].disabled = false;
	}
	for(var i = 0 ; i < document.getElementsByTagName("select").length ; i++){
		document.getElementsByTagName("select")[i].disabled = false;
	}
	document.getElementById("batteryName").value = this.name;
	document.getElementById("batteryCondition").value = this.condition;
	document.getElementById("batteryPercent").value = this.percent;
	document.getElementById("batteryLocation").value = this.location;
	document.getElementById("batteryComments").value = this.comments;
	document.getElementById("batteryHandler").value = this.handler;
	document.getElementById("batteryUpdated").innerHTML = this.updated;
	document.getElementById("batteryComments").disabled = false;
	batteryOpened = this.id;
}




Battery.prototype.save = function(){
	if(document.getElementById("batteryHandler").value === "" || document.getElementById("batteryName").value === "" || document.getElementById("batteryHandler").value === "anonymous"){
		window.alert("Please make sure the battery is named and you identify yourself!");
	}else{
		this.name = document.getElementById("batteryName").value;
		this.condition = document.getElementById("batteryCondition").value;
		this.percent = document.getElementById("batteryPercent").value;
		this.location = document.getElementById("batteryLocation").value;
		this.comments = document.getElementById("batteryComments").value;
		this.handler = document.getElementById("batteryHandler").value;
		var date = new Date();
		this.updated = currentTime();
		document.getElementById("batteryUpdated").innerHTML = this.updated;
		localStorage.batteryList = packAllBatteries();
		updateBatteryDisplay();
	}
}

Battery.prototype.delete = function(){
	if(window.confirm("Are you sure you want to delete \""+this.name+"\"?")){
		for(var i = this.id ; i < batteryList.length ; i++){
			batteryList[i].id--;
		}
		batteryList.splice(this.id+1,1);
		localStorage.batteryList = packAllBatteries();
		updateBatteryDisplay();
		clearInfo();
	}
}


function updateBatteryDisplay(){
	document.getElementById("BatteryUL").innerHTML = "";
	for(var i = 0 ; i < batteryList.length ; i++){
		batteryList[i].display();
	}
}


function newElement() {
	var currentBattery = batteryList.push(
		document.getElementById("BatteryInput").value === "" ?
			new Battery(batteryList.length,"Battery-" + batteryList.length,"good",130,"notCharging","","anonymous",currentTime()) :
			new Battery(batteryList.length,document.getElementById("BatteryInput").value,"good",130,"notCharging","","anonymous",currentTime())
	) - 1;
	
	batteryList[currentBattery].display();
	
	document.getElementById("BatteryInput").value = "";

	localStorage.batteryList = packAllBatteries();
}

function clearAllBatteries(){
	if(window.confirm("Are you sure you want to delete all batteries?")){
		batteryList = [];
		document.getElementById("BatteryUL").innerHTML = "";
		localStorage.removeItem("batteryList");
				batteryList[-1] = {
			save:function(){},
			delete:function(){}
		}
		clearInfo();
	}
}
updateBatteryDisplay();