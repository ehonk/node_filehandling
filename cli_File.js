//var jsonparams = require('./jsonParams');
var fs = require('fs');
var readline  = require('readline');
var paramsfile = __dirname + '/data/params.txt';
var parameters = new Object();
var measValues = [];
parameters = JSON.parse(fs.readFileSync(paramsfile).toString());

var objTCPSocket = new Object();
var TCPListner = require('socket.io').listen(20001,{'log colors':false, 'log level':1});
var tcpclients = [];
var sockets = [];
var net = require('net');
objTCPSocket.Host="127.0.0.1";
objTCPSocket.Port="20000";

var globalMeasObject = [];
var NowDate;
var StartDate;
const dbglvldb = 1;



initMeasValues();
consolemenu();




//var readline = require('readline');
//
//var rl = readline.createInterface({
//  input: process.stdin,
//  output: process.stdout,
//  terminal: true
//});
//
//rl.on('line', function (cmd) {
//  console.log('You just typed: '+cmd);
//});



process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function (chunk) {
// process.stdout.write('data: ' + chunk);

  var eingabe = chunk;
  eingabe = eingabe.replace(/\n|\r/g, "");

  switch (eingabe) {
  case "1":
        console.log("getStatusFromFlowmeter: " + chunk);
        getStatusFromFlowmeter();
    break;

  case "2":
    console.log("getAllMeasurementsFromFlowmeter: " + chunk);
    getAllMeasurementsFromFlowmeter();
    break;

  case "3":
        sendTCP_Text_Message("GEOMETRY!");
        console.log("send GEOMETRY!: " + chunk);
    break;

  case "4":
        var tcpmessage = JSON.stringify({REQUEST: "AO"});
        sendTCP_JSON_Message(tcpmessage);
    break;

  case "5":
        var tcpmessage = JSON.stringify({REQUEST: "DOTESTACTIVE?" , "CHANNEL": 1 });
        sendTCP_JSON_Message(tcpmessage);
    break;

  case "6":
        var tcpmessage = JSON.stringify({REQUEST: "DOTESTACTIVE?" , "CHANNEL": 5 });
        sendTCP_JSON_Message(tcpmessage);
    break;

  case "7":	sendTCP_Text_Message("SETDO1|VAL1");	break;
  case "8": 	sendTCP_Text_Message("SETDO1|VAL0");	break;
  case "9":	sendTCP_Text_Message("SETDO1|VAL9");	break;

  case "10":	sendTCP_Text_Message("SETDO2|VAL1");	break;
  case "11": 	sendTCP_Text_Message("SETDO2|VAL0");	break;
  case "12":	sendTCP_Text_Message("SETDO2|VAL9");	break;

  case "13":	sendTCP_Text_Message("SETDO3|VAL1");	break;
  case "14": 	sendTCP_Text_Message("SETDO3|VAL0");	break;
  case "15":	sendTCP_Text_Message("SETDO3|VAL9");	break;

  case "16":	sendTCP_Text_Message("SETDO4|VAL1");	break;
  case "17": 	sendTCP_Text_Message("SETDO4|VAL0");	break;
  case "18":	sendTCP_Text_Message("SETDO4|VAL9");	break;

  case "19":
        sendTCP_Text_Message("SETDO5|VAL1");
    break;

  case "20":
        sendTCP_Text_Message("SETDO5|VAL0");
    break;

  case "21":
       sendTCP_Text_Message("SETDO5|VAL9");
    break;

  case "22":
        var tcpmessage = JSON.stringify({REQUEST: "DO"});
        sendTCP_JSON_Message(tcpmessage);
    break;

  case "23":
        stressTCP_Status(500);
    break;

  case "24":
        stressTCP_Status(100);
    break;
  case "25":
        stressTCP_Status(50);
    break;
  case "26":
        var tcpmessage = JSON.stringify({REQUEST: "DEVTYPE"});
        sendTCP_JSON_Message(tcpmessage);
    break;
  case "27":
        var tcpmessage = JSON.stringify({REQUEST: "ALLVALUES"});
        sendTCP_JSON_Message(tcpmessage);
    break;
  case "28":
        MeasObj_Generate_01_readFM();
    break;
  case "29":
        MeasObj_ShowData();
    break;
  case "30":
	    MeasObj_Update_01_readFM();
    break;
  case "31":
	  	MeasObj_DeleteData();
    break;
  case "32":
	  Ajax_getMeasurementMap();
    break;
  case "33":
	  var tcpmessage = JSON.stringify({REQUEST: "Logging", Text: "From the Land Down Under"});
	  sendTCP_JSON_Message_WithoutAnswer(tcpmessage);
    break;
    
  case "34":
	setTraceLevel(0);
    break;
    
  case "35":
	  setTraceLevel(2);
    break;
    
  case "36":
	getCombiSensor();
    break;
    
  case "37":
	  readFileWith_ReadFile();
	  break;
	  
  case "38":
	  parseFileWith_ReadFile();
	  break;
	    
  case "55":
    IOMenu();
    break;
  default:
    console.log (" switch default");
  }


});


function IOMenu(){

  console.log("###########################################");
  console.log("# IO Console Interface                        ");
  console.log("# 5.  Request Digital Out Test Channel 1 ");
  console.log("# 6.  Request Digital Out Test Channel 5 ");
  console.log("# 	");
  console.log("# 7.  send Digital Out Channel 1 High ");
  console.log("# 8.  send Digital Out Channel 1 Low ");
  console.log("# 9.  send Digital Out Channel 1 Reset ");
  console.log("# 	");
  console.log("# 10.  send Digital Out Channel 2 High ");
  console.log("# 11.  send Digital Out Channel 2 Low ");
  console.log("# 12.  send Digital Out Channel 2 Reset ");
  console.log("# 	");
  console.log("# 13.  send Digital Out Channel 3 High ");
  console.log("# 14.  send Digital Out Channel 3 Low ");
  console.log("# 15.  send Digital Out Channel 3 Reset ");
  console.log("# 	");
  console.log("# 16.  send Digital Out Channel 4 High ");
  console.log("# 17.  send Digital Out Channel 4 Low ");
  console.log("# 18.  send Digital Out Channel 4 Reset ");
  console.log("# 	");
  console.log("# 19. send Digital Out Channel 5 High ");
  console.log("# 20. send Digital Out Channel 5 Low ");
  console.log("# 21. send Digital Out Channel 5 Reset ");
  console.log("# 22. Request Digital Out Values ");
  console.log("# 	");
  console.log("###########################################");
}

function consolemenu(){
  console.log("###########################################");
  console.log("# WebUI/FLowmeter Console Interface                        ");
  console.log("# 1. Status ");
  console.log("# 2. All measurement values ");
  console.log("# 3. send GEOMETRY! ");
  console.log("# 4. Request Analog In mA Values ");
  console.log("# 	");
  console.log("# 55. IO Submenu ");
  console.log("# 22. Request Digital Out Values ");
  console.log("# 	");
  console.log("# 23. TCP STRESS TEST 0.5s Status ");
  console.log("# 24. TCP STRESS TEST 0.1s Status ");
  console.log("# 25. TCP STRESS TEST 0.05s Status ");
  console.log("# 	");
  console.log("# 26. Request DevType	");
  console.log("# 27. Request new All Values");
  console.log("# 	");
  console.log("# 28. Create New DataMap");
  console.log("# 29. Show New DataMap");
  console.log("# 30. Update New DataMap");
  console.log("# 31. Delete New DataMap");
  console.log("# 32. Old Measurment Object");
  console.log("# 33. Logging Message");
  console.log("# 34. Set TraceLevel to Low");
  console.log("# 35. Set TraceLevel to High");
  console.log("# 36. Read PSC Combisensor Protocol");  
  console.log("# 37. Read Array");  
  console.log("# 38. Read parseFile");  
  console.log("# 	");
  console.log("###########################################");
}

function setTraceLevel(iTraceLevel){
	
	console.log ("< Info > [File] setTraceLevel: " + iTraceLevel);
	
	console.log ("< Info > [File] Parameters.TraceLevel: " + parameters.Logging.TraceLevel);
	
	parameters = JSON.parse(fs.readFileSync(paramsfile).toString());
	parameters.Logging.TraceLevel = parseInt(iTraceLevel);
//	filemgr.OverwriteTCPCallbackSync(paramsfile, JSON.stringify(parameters, null, 4) + '\n', res, req, 'LOGGING!', sendTCP_old);
	overwritefilesync(paramsfile, JSON.stringify(parameters, null, 4) + '\n');
}

function getCombiSensor() {

	console.log ("< Info > [File] getCombiSensor");

	touchLogFile();
}

function touchLogFilewithArray()
{ 
	var objText = new Array();
var objText2 = new Array();
var input = __dirname + '/public/data/data.csv';
var array = fs.readFileSync(input).toString().split("\n");

objText.push(array[0]);
objText2.push(array[0]);

for(var i in array) {
    var strArray = array[i];
    strArray = strArray.substring(0, 19);
    if (strArray > dtThreeDayAgo && strArray <= dtNow)
    {
      //objText += array[i] + "\n";
      objText.push(array[i]);      
    }
    if (strArray > dtThreeDayAgo2 && strArray <= dtNow2)
    {
      objText2.push(array[i]);      
    }      
}

}

function readFileWith_ReadFile()
{ 

	var count = 0;
	var vfilename = "20170124PSC.log";
//	var vcombinepath = __dirname + "/Flowmeter/Log/" + vfilename;
	var vcombinepath = "/home/root/Flowmeter/Log/" + vfilename;
	
	fs.readFile(vcombinepath, function(err, data) {
    if(err) throw err;
    var array = data.toString().split("\n");
    for(i in array) {
    	count++;
        console.log(count + ".line: " + array[i]);
    }
});

}

function parseFileWith_ReadFile()
{ 

	var count = 0;
	var vfilename = "20170124PSC.log";
//	var vcombinepath = __dirname + "/Flowmeter/Log/" + vfilename;
	var vcombinepath = "/home/root/Flowmeter/Log/" + vfilename;
	
	var searchString = "Profiler::doMeasurement";
	
	fs.readFile(vcombinepath, function(err, data) {
    if(err) throw err;
    var array = data.toString().split("\n");
    for(i in array) {
    	count++;
	    var idx = array[i].indexOf("Profiler::doMeasurement");
	    if (idx !== -1) {
	    	console.log(count + ".line: " + array[i] + '\n');
	    }
	    
//        console.log(count + ".line: " + array[i]);
    }
	});

}

function touchLogFile()
{
	console.log ("< Info > [File] touchLogFile");
    
    var logcontent = new Object();
    logcontent = '';

    var sys = require('sys')
    var exec = require('child_process').exec;
    var child;
    var childdelete;
    
	var vfilename = "20170124PSC.log";
//	var vcombinepath = __dirname + "/Flowmeter/Log/" + vfilename;
	var vcombinepath = "/home/root/Flowmeter/Log/" + vfilename;

	var stats = fs.statSync(vcombinepath);
	var fileSizeInBytes = stats["size"];
	var filedate = stats["mtime"];
	
	 //Convert the file size to megabytes (optional)
	var fileSizeInMegabytes = fileSizeInBytes / 1000000.0;
	console.log ("< Info > [File] touchLogFile File: " + vcombinepath + " | Size: " + fileSizeInMegabytes + "Mb");

    // 20170124PSC.log
	
	var i;
	var count = 0;
//	require('fs').createReadStream(vcombinepath)
//	  .on('data', function(chunk) {
//	    for (i=0; i < chunk.length; ++i)
//	      if (chunk[i] == 10) count++;
//	  })
//	  .on('end', function() {
//	    console.log("Linecount : " + count);
//	  });
//	
//	
	
	readline.createInterface({
	    input     : createReadStream(vcombinepath),
	    terminal  : false
	  }).on('line', function(line) {
	    var idx = line.indexOf("Profiler::doMeasurement");
	    if (idx !== -1) {
	    	console.log(line + '\n');
	    }
	  }).on('close', function() {
//	    res.end();
	  });
	
//	var idx = line.indexOf(THE_SUBSTRING);
//    if (idx !== -1) {
//      res.write(line + '\n');
//    }
    
//	 < Receive > Profiler::doMeasurement 
//    try
//    {
//        	logcontent = fs.readFileSync(vcombinepath).toString();
////        	console.log("Lines: :" + logcontent);
//    }
//    catch(err)
//    {
//   	
//	logcontent = 'No Logfile';
////	console.log("Lines: :" + logcontent);
//    }

}
function standard_touchLogFile()
{
	console.log ("< Info > [File] touchLogFile");
    
    var logcontent = new Object();
    logcontent = '';

    var sys = require('sys')
    var exec = require('child_process').exec;
    var child;
    var childdelete;
    
    // 20170124PSC.log
    
    try
    {
	childdelete = exec("rm HydroVision/smallLogFile.txt", function (error, stdout, stderr) {
//    	sys.print('stdout: ' + stdout);
//    	sys.print('stderr: ' + stderr);

        	child = exec("tail ../../home/root/Flowmeter/Log/" + req.body.objfilename + " -n 1000 > HydroVision/smallLogFile.txt", function (error, stdout, stderr) {
//        	sys.print('stdout: ' + stdout);
//        	sys.print('stderr: ' + stderr);


        	logcontent = fs.readFileSync(__dirname +'/smallLogFile.txt').toString();

        	logcontent=logcontent+updatetime;
//        	console.log("NoOfLastLine:" + dataLogging["NoOfLastLine"]);
//        	console.log("Lines: :" + logcontent);

        	res.contentType('json');
        	res.send({ data: JSON.stringify(logcontent), NoOfLastLine: dataLogging["NoOfLastLine"] });

        	if (error !== null) {
        	  console.log('exec error: ' + error);
        	  }
        	});

	});

    }
    catch(err)
    {
	logcontent = 'No Logfile';
	res.contentType('json');
	res.send({ data: JSON.stringify(logcontent), NoOfLastLine: dataLogging["NoOfLastLine"] });
    }

}

function stressTCP_Status(timerate) {

    var myVar = setInterval(function(){ getStatusFromFlowmeter() }, timerate);

}

function getStatusFromFlowmeter(){

  var tcpmessage="{\"REQUEST\":\"STATUS\"}";
  var tcp_client = net.connect({port:objTCPSocket.Port}, function(){
    tcp_client.write(tcpmessage);
//		console.log("STATUS -> " + tcpmessage);
    console.log ("< Info > [TCP] tcptoflowmeter::TCP_Status | REQUEST: " + tcpmessage);
  });

  tcp_client.on('data', function(data){
    console.log ("< Info > [TCP] tcptoflowmeter::TCP_Status | Incoming Status: " + data.toString());
    tcp_client.end();

    //consolemenu();
  });

  tcp_client.on('error', function(error) {

    //filemgr.appendtofile(log_file, "ERROR TCP :" + NowDate + ": " + error.toString() + '\n');
    console.log ("< Error > [TCP] tcptoflowmeter::TCP_Status | error: " + error.toString());
    tcp_client.destroy();

  });


}
function overwritefilesync(filepath, newstring) {

    console.log("< Info > filemgr::overwritefilesync Length: " + newstring.length);
    var strlen = newstring.length;

    if (strlen < 10) {
        console.log("-----------------------------");
        console.log("# ERROR PARAMETER Length == 0");
        console.log("-----------------------------");
    }
    try {
        fs.writeFileSync(filepath, newstring, function (err) {
            console.log("-----------------------------");
            console.log("< ERROR > filemgr::overwritefilesync error Length: " + err);
            console.log("-----------------------------");



            if (err) throw err;
        });
    }
    catch (err) {

    }

    return 'success';
}

function sendTCP_Text_Message(tcpmessage){

  //var tcpmessage="{\"REQUEST\":\"STATUS\"}";
  var tcp_client = net.connect({port:objTCPSocket.Port}, function(){
    tcp_client.write(tcpmessage);
//		console.log("STATUS -> " + tcpmessage);
    console.log ("[TCP] sendTCP_Text_Message | tcpmessage: " + tcpmessage);
  });

  tcp_client.on('data', function(data){
    console.log ("[TCP] sendTCP_Text_Message |  Incoming : " + data.toString());
    tcp_client.end();

    consolemenu();
  });

  tcp_client.on('error', function(error) {

    //filemgr.appendtofile(log_file, "ERROR TCP :" + NowDate + ": " + error.toString() + '\n');
    console.log ("< Error > [TCP] tcptoflowmeter::TCP_Status | error: " + error.toString());
    tcp_client.destroy();

  });


}

function sendTCP_JSON_Message(tcpmessage){

  var tcp_client = net.connect({port:objTCPSocket.Port}, function(){
    tcp_client.write(tcpmessage);
//		console.log("STATUS -> " + tcpmessage);
    console.log ("[TCP] tcptoflowmeter::TCP_Status | tcpmessage: " + tcpmessage);
  });

  tcp_client.on('data', function(data){
    console.log ("[TCP] tcptoflowmeter::TCP_Status |   Incoming: " + data.toString());
    tcp_client.end();

    consolemenu();
  });

  tcp_client.on('error', function(error) {

    //filemgr.appendtofile(log_file, "ERROR TCP :" + NowDate + ": " + error.toString() + '\n');
    console.log ("< Error > [TCP] tcptoflowmeter::TCP_Status | error: " + error.toString());
    tcp_client.destroy();

  });

}

function sendTCP_JSON_Message_WithoutAnswer(tcpmessage){

	  var tcp_client = net.connect({port:objTCPSocket.Port}, function(){
	    tcp_client.write(tcpmessage);
//			console.log("STATUS -> " + tcpmessage);
	    console.log ("[TCP] tcptoflowmeter::TCP_Status | tcpmessage: " + tcpmessage);
	    tcp_client.end();
	  });

	  tcp_client.on('error', function(error) {

	    //filemgr.appendtofile(log_file, "ERROR TCP :" + NowDate + ": " + error.toString() + '\n');
	    console.log ("< Error > [TCP] tcptoflowmeter::TCP_Status | error: " + error.toString());
	    tcp_client.destroy();

	  });

	}

function getAllMeasurementsFromFlowmeter(){

  var outData = [];

  console.log ("Start TCP Communication"  );
  strMsg = '';
  if(measValues.length > 1){
    client = new net.Socket();
    currID = 1;

    client.setTimeout(60000, function(){
      console.log({ data: "TimeOut: " + objTCPSocket.Host + ":"+ objTCPSocket.Port});
      client.destroy();
    });

    client.connect(objTCPSocket.Port, objTCPSocket.Host, function(){
      client.write('{"REQUEST":"'+ measValues[currID] + '"}');
      console.log ("< Info > [TCP] client_connect TCP_RequestValue " + measValues[currID]);
    });

    client.on('data', function(data) {
      outData.push(createMeasValueObj( JSON.parse(data)  ));

      currID++;
      if(currID < measValues.length){
        client.write('{"REQUEST":"'+ measValues[currID] + '"}');
//				console.log ("< Info > [TCP] Request: " + measValues[currID]);
      }
      else{

        client.destroy();
      }
    });

    client.on('close', function() {
      //console.log('Connection closed');
      consolemenu();
    });

    client.on('error', function(error) {

    });
  } else {
    console.log("# ERROR tcptoflowmeter::TCP_Requestvalue | measValues.length == 0: ");
  }


}

function initMeasValues(){

  console.log ("# tcptoflowmeter::initMeasValues Measuremnt Values ?");

  var input = __dirname + '/public/data/data.csv';
  var fsread = fs.createReadStream(input, {start: 0, end: 4096});
  var line='';
  var first = false;

  fsread.on('readable',function(){
    if(!first){
      line += fsread.read();
      if(line.indexOf('\n') > 0){
        var larr = line.split('\n');
        console.log(larr[0]);
        measValues = larr[0].split(',');
        first = true;
      }
    }

  })

};

function createMeasValueObj(tempObj){

  var propsOfObj = Object.keys(tempObj);
  var mvName = propsOfObj[0];
  var org_name = mvName;

  var cutidx = mvName.lastIndexOf('_');
  if(cutidx > 0){
    mvName = mvName.substring(0, cutidx);
  }

  // Dynamically BaseUnit
  var dynamicBaseUnit=getBaseUnitDynamic(mvName);


  var conversion = 1;
  var displayUnit = "";
  var SIUnit = "";

  if(dynamicBaseUnit != null){

    var unitConversionObj = findlevel1("MeasurementUnits");
    var unitDisplayObj = findlevel1("UnitDisplay");
    var uDisplay = unitDisplayObj[dynamicBaseUnit];

    var aConversionObj = unitConversionObj[dynamicBaseUnit];

    if (aConversionObj!=undefined){
        SIUnit = aConversionObj.Base;
        displayUnit=uDisplay;

        if(aConversionObj.Base != uDisplay){
      conversion = aConversionObj[uDisplay];
      displayUnit=uDisplay;
        }


    } else {


    }

  }

  console.log ("# Name: " + propsOfObj[0] + " \t | value: " + tempObj[propsOfObj[0]] + " \t | baseUnit: " + dynamicBaseUnit ) ;

  var retObj = {name:propsOfObj[0], value:tempObj[propsOfObj[0]],baseUnits:dynamicBaseUnit, conversion:conversion, displayUnit:displayUnit, SIUnit:SIUnit };
  return retObj;


}

function getBaseUnitDynamic(Value) {

    var found;
    var vBaseUnitName=null;
    found = parameters["MeasurementValues"];

    for(var BaseUnits in found){

      var foundstring=found[BaseUnits];

      for(var cells in foundstring){
    if (Value===foundstring[cells])
        vBaseUnitName=BaseUnits;
      }

  }





    return vBaseUnitName;
}

function findlevel1(paramname)
{
  //parameters = JSON.parse(fs.readFileSync(paramsfile).toString());
  var found;

  found = parameters[paramname];
  return found;
}

function json_replaceInfinity(jsonstring){

//	jsonstring = jsonstring.replace(/inf/gi, "\"\"");
  jsonstring = jsonstring.replace(/\binf/gi, "\"\"");


  return jsonstring;

}

function MeasObj_Generate_01_readFM(){

	  if (dbglvldb > 0) console.log ("< Info > MeasObj_Generate_01_readFM ");

	  StartDate = new Date();
      var tcpmessage = JSON.stringify({REQUEST: "ALLVALUES"});

      var tcp_client = net.connect({port:objTCPSocket.Port}, function(){
    	  tcp_client.write(tcpmessage);
    	  console.log ("[TCP] tcptoflowmeter::TCP_Status | tcpmessage: " + tcpmessage);
      });

      tcp_client.on('data', function(data){
    	  console.log ("[TCP] tcptoflowmeter::TCP_Status |   Incoming: " + data.toString());
    	  tcp_client.end();
    	  MeasObj_Generate_02_build(data);
      });

      tcp_client.on('error', function(error) {
    	  console.log ("< Error > [TCP] tcptoflowmeter::TCP_Status | error: " + error.toString());
    	  tcp_client.destroy();
      });

}



function MeasObj_Generate_02_build(jsondata){

	if (dbglvldb > 0) console.log ("< Info > MeasObj_Generate_02_build ");

	var jsonstring=jsondata.toString();
	jsonstring=json_replaceInfinity(jsonstring);

	var JSONObject=JSON.parse(jsonstring);

	if (JSONObject["RESPONSE"])
		delete JSONObject.RESPONSE;

	for(var key in JSONObject) {
		if (JSONObject[key] !== null && typeof JSONObject[key]  !== 'object' && key !== "RESPONSE") {

			// 1. Baseunit bekommen

			var mvName=key;
			var dynmaicBaseUnit="";
			var conversion = 1;
			var displayUnit = "";
			var SIUnit = "";

			var cutidx = mvName.lastIndexOf('_');
			if(cutidx > 0){
				mvName = mvName.substring(0, cutidx);
			}

			// Dynamically BaseUnit
				dynmaicBaseUnit=getBaseUnitDynamic(mvName);


				if(dynmaicBaseUnit){
        var unitConversionObj = findlevel1("MeasurementUnits");
        var unitDisplayObj = findlevel1("UnitDisplay");
        var uDisplay = unitDisplayObj[dynmaicBaseUnit];
        var aConversionObj = unitConversionObj[dynmaicBaseUnit];

        if (aConversionObj!=undefined){
            SIUnit = aConversionObj.Base;
            displayUnit=uDisplay;

            if(aConversionObj.Base != uDisplay){
              conversion = aConversionObj[uDisplay];
              displayUnit=uDisplay;
            }
        }

      } else {
//        console.log("--.key: " + key + " | value: " + JSONObject[key] + " | dynmaicBaseUnit:" + dynmaicBaseUnit + " -> NO Conversion Calculcation");
      }

//      console.log("# " + key + " | value: " + JSONObject[key] + " | Base:" + dynmaicBaseUnit + " | conv: " + conversion + " | DisplayUnit: " + displayUnit);

      // Ende Algorithmus f�r Verarbeitung:
      var retObj = {
          name:mvName,
          value: JSONObject[key] ,
          baseUnits:dynmaicBaseUnit,
          conversion:conversion,
          displayUnit:displayUnit,
          SIUnit:SIUnit
          };
        globalMeasObject.push( retObj );

    } else {
      console.log("--.key: " + key + " | is null or object" );
    }



  }

  if (dbglvldb == 1) console.log ("< Info > MeasObj_Generate_02_build finish after: " + (new Date().getTime() - StartDate) + " ms" );

}

function MeasObj_ShowData(){


  console.log("MeasObj_ShowData L�nge: " + globalMeasObject.length);
  console.log("+++++++++++++++++++++++++++++++++++++ Show Measurement Object +++++++++++++++++++++++++++++++++++++" );

  for (var i = 0; i < globalMeasObject.length; i++) {
    console.log("-show: " + globalMeasObject[i].name + " | value: "
        + globalMeasObject[i].value + " | baseunit: "
        + globalMeasObject[i].baseUnits + " | conv: "
        + globalMeasObject[i].conversion + " | display: "
        + globalMeasObject[i].displayUnit + " | SIUnit: "
        + globalMeasObject[i].SIUnit

    );
  }
  console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ " );

}

function MeasObj_DeleteData(){

	  globalMeasObject = [];
	  if (dbglvldb > 0) console.log ("< Info > MeasObj_Generate_01_readFM Object Length: " + globalMeasObject.length);

}

function MeasObj_Update_01_readFM(){

	  if (dbglvldb > 0) console.log ("< Info > MeasObj_Generate_01_readFM ");

	  StartDate = new Date();
	  var tcpmessage = JSON.stringify({REQUEST: "ALLVALUES"});

	  var tcp_client = net.connect({port:objTCPSocket.Port}, function(){
	    tcp_client.write(tcpmessage);
	    console.log ("[TCP] tcptoflowmeter::TCP_Status | tcpmessage: " + tcpmessage);
	  });

	  tcp_client.on('data', function(data){
	    console.log ("[TCP] tcptoflowmeter::TCP_Status |   Incoming: " + data.toString());
	    tcp_client.end();
	    MeasObj_Update_02_update(data);
	  });

	  tcp_client.on('error', function(error) {
	    console.log ("< Error > [TCP] tcptoflowmeter::TCP_Status | error: " + error.toString());
	  tcp_client.destroy();

	  });
}

function MeasObj_Update_02_update(jsondata){

	  if (dbglvldb > 0) console.log ("< Info > MeasObj_Update_01_readFM ");

	  var jsonstring=jsondata.toString();
	  jsonstring=json_replaceInfinity(jsonstring);
	  var JSONObject=JSON.parse(jsonstring);

	  if (JSONObject["RESPONSE"])
	    delete JSONObject.RESPONSE;

	  for (var i = 0; i < globalMeasObject.length; i++) {
//		    console.log("-show: " + globalMeasObject[i].name  + " | new Value: " + JSONObject[globalMeasObject[i].name]);
		    globalMeasObject[i].value = JSONObject[globalMeasObject[i].name];
	  }

	  if (dbglvldb > 0) console.log ("< Info > MeasObj_Update_02_update finish after: " + (new Date().getTime() - StartDate) + " ms" );

}


function getBaseUnitDynamic(Value) {

//	console.log("search for Baseunit: " + Value );

    var found;
    var vBaseUnitName=null;
    found = parameters["MeasurementValues"];

    for(var BaseUnits in found){
//    	console.log("# BaseUnits: " + BaseUnits + " | vals: " +  found[BaseUnits]);

      var foundstring=found[BaseUnits];

      for(var cells in foundstring){
    if (Value===foundstring[cells])
//			console.log("### BaseUnits MATCH: " + Value + " | foundstring[cells]: " +  foundstring[cells] + "  | Baseunit: " + BaseUnits);
        vBaseUnitName=BaseUnits;
      }

  }


    return vBaseUnitName;
}


function Ajax_getMeasurementMap(){

    NowDate = new Date();

    StartDate = new Date();
  var LoadTime = new Date().getTime();

  if (dbglvldb == 1) console.log ("< Info > Ajax_getMeasurementMap -> " );

  var NowDate = new Date();
  var outData = [];

  strMsg = '';

  if(measValues.length > 1){

      for (var i = 0; i < measValues.length; i++)
    {
    var mvName=measValues[i];
    var orgName=measValues[i];

//		console.log (" I: " + i + " Messwert " + mvName) ;

    // Messwertname Index Entfernung
    var cutidx = mvName.lastIndexOf('_');
    if(cutidx > 0){
      mvName = mvName.substring(0, cutidx);
    }

    // Dynamically BaseUnit
    var dynmaicBaseUnit=getBaseUnitDynamic(mvName);

//		if dynmaicBaseUnit==null
//		    dynmaicBaseUnit="";
//		if(dynmaicBaseUnit.length > 0){

    var conversion = 1;
    var displayUnit = "";
    var SIUnit = "";

    if(dynmaicBaseUnit != null){

      var unitConversionObj = findlevel1("MeasurementUnits");
      var unitDisplayObj = findlevel1("UnitDisplay");
      var uDisplay = unitDisplayObj[dynmaicBaseUnit];

      var aConversionObj = unitConversionObj[dynmaicBaseUnit];

      if (aConversionObj!=undefined){
          SIUnit = aConversionObj.Base;
          displayUnit=uDisplay;

          if(aConversionObj.Base != uDisplay){
        conversion = aConversionObj[uDisplay];
        displayUnit=uDisplay;
          }


      } else {


      }

    }

		console.log (" ## Name: " + orgName + " baseUnit " + dynmaicBaseUnit + " | Factor: " + conversion + " | display: " + displayUnit  ) ;
    var retObj = {
      name:orgName,
      value: 0 ,
      baseUnits:dynmaicBaseUnit,
      conversion:conversion,
      displayUnit:displayUnit,
      SIUnit:SIUnit
      };
    outData.push( retObj );

    }
  }

  if (dbglvldb == 1) console.log ("< Info > Ajax_getMeasurementMap finish after: " + (new Date().getTime() - LoadTime) + " ms" );



};



