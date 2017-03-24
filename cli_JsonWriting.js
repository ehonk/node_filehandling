
var fs = require('fs');
var readline  = require('readline');
var paramsfile = __dirname + '/data/params.txt';
parameters = JSON.parse(fs.readFileSync(paramsfile).toString());

var objTCPSocket = new Object();
var TCPListner = require('socket.io').listen(20001,{'log colors':false, 'log level':1});
var tcpclients = [];
var sockets = [];
var net = require('net');
objTCPSocket.Host="127.0.0.1";
objTCPSocket.Port="20000";

consolemenu();
keystrokehandler();

function keystrokehandler() {
	process.stdin.resume();
	process.stdin.setEncoding('utf8');

	process.stdin.on('data',
			function(chunk) {

				var eingabe = chunk;
				eingabe = eingabe.replace(/\n|\r/g, "");

				switch (eingabe) {
				case "1":
					console.log("loadjsonconfiguration: " + paramsfile);
					loadjsonconfiguration();
					break;

				case "2":
					console.log("readjson: " + chunk);
					readjson(parameters);
					break;
				case "3":
					console.log("readJson: " + chunk);
					wparams = JSON.stringify(parameters, null, 4)+ '\n';
					writefilesync_wcb_ts(paramsfile, wparams, null, null, 'DISCHARGECALCULATION!', callbackDummy, null);
					break;
					
				case "4":
					console.log("readJson: " + chunk);
					wparams = JSON.stringify(parameters, null, 4)+ '\n';
					fileobj = JSON.parse(fs.readFileSync(paramsfile).toString());
					fileitsiso = fileobj.Overview.LastModified;
					writefilesync_wcb_ts(paramsfile, wparams, null, null, 'DISCHARGECALCULATION!', callbackDummy, fileitsiso );
					break;
				case "5":
					console.log("readJson: " + chunk);
					wparams = JSON.stringify(parameters, null, 4)+ '\n';
					fileobj = JSON.parse(fs.readFileSync(paramsfile).toString());
					fileitsiso = fileobj.Overview.LastModified;
					writefilesync_wcb_ts(paramsfile, wparams, null, null, 'DISCHARGECALCULATION!', callbackDummy, fileitsiso );
					break;		
				case "6":
					console.log("readJson: " + chunk);
					wparams = JSON.stringify(parameters, null, 4)+ '\n';
					writefilesync_wcb(paramsfile, wparams, null, null, 'DISCHARGECALCULATION!', callbackDummy );
                    break;
                case "7":
                    console.log("readJson: " + chunk);
                    wparams = JSON.stringify(parameters, null, 4) + '\n';
                    writefilesync_ncb(paramsfile, wparams, null, null);
                    break;	                        
				case "10":
					modify_params_ts();
					break;
				case "11":
					manipulatets_params_ts();
					break;
					
				default:
					console.log(" switch default");
				}

			});
}

function consolemenu(){
  console.log("###########################################");
  console.log("# JSON Configuration Reading / Writing Test                        ");
  console.log("# 	");
  console.log("# 1. Read JSON Configuration from File ");
  console.log("# 2. show JSON Configuration Rekursive ");
  console.log("# 3. write JSON Configuration to File OLD PROCEDURE ");
  console.log("# 	");
  console.log("# 	");
  console.log("# 5. write JSON Configuration to File with check timestamp ");
  console.log("# 6. write JSON Configuration to File current");
  console.log("# 	");
  console.log("# 7. write JSON Configuration without Callback"); 
  console.log("# 	");
  console.log("# 10. Modify Timestamp to now in paramsobject	");
  console.log("# 11. Modify Timestamp to 10mins ago in paramsobject	");
  console.log("# 	");  
  console.log("# 12. Insert new JSON Main Key ");
  console.log("# 13. Modify Overview Entries ");
  console.log("# 	");
  console.log("# 	");
  console.log("###########################################");
}


function loadjsonconfiguration(){

  parameters = JSON.parse(fs.readFileSync(paramsfile).toString());
}

function modify_params_ts(){
	
	console.log ("gelesener LastModified: " + parameters.Overview.LastModified);
	console.log ("gelesener LastWriting: " + parameters.Overview.LastWriting);
	var currentDate = new Date();
	parameters.Overview.LastModified = currentDate.toISOString().replace(/T/, ' ').replace(/\..+/, '') ;
	console.log ("neuer Timestamp: " + parameters.Overview.LastModified);
	console.log ("neuer LastWriting: " + parameters.Overview.LastWriting);
}

function manipulatets_params_ts(){
	
	console.log ("gelesener LastModified: " + parameters.Overview.LastModified);
	console.log ("gelesener LastWriting: " + parameters.Overview.LastWriting);
	var currentDate = new Date();
	parameters.Overview.LastModified = "2017-03-15 12:00:00" ;
	console.log ("neuer Timestamp: " + parameters.Overview.LastModified);
	console.log ("neuer LastWriting: " + parameters.Overview.LastWriting);
}

function readjson(JSONObject){

  for(var key in JSONObject) {
    if (JSONObject[key] !== null && typeof JSONObject[key]  === 'object' ) {
      //console.log("--.key: " + key + " | is null or object" );
      if (typeof JSONObject[key]  === 'object' ) {
          console.log( " --key: " + key + " | val is Object" );
        readjson(JSONObject[key] );
    }
    } else {
        console.log("  " + String.fromCharCode(9501) + " key: " + key + " | value: " + JSONObject[key] );
    }
  }
}


function overwritefilesync(filepath, configstring) {

    console.log("< Info > filemgr::overwritefilesync Length: " + configstring.length);
    var strlen = configstring.length;

    if (strlen < 10) {
        console.log("-----------------------------");
        console.log("# ERROR PARAMETER Length == 0");
        console.log("-----------------------------");
    }
    try {
        fs.writeFileSync(filepath, configstring, function (err) {
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



function sendTCP_old(res, req, tcpmsg)
{

    if (dbglvlpm >= 1) console.log ("< Info > parameters::sendTCP Msg: " + tcpmsg);

      var strMsg = '';
	  var client = new net.Socket();

	  client.setTimeout(3000, function()
	  {
	    client.destroy();

	    //req.flash('warn', 'Successfully saved, but connection error to : ' + objTCPSocket.Host + ':' + objTCPSocket.Port + ' = ' + ' Time Out' );
	    req.session.messages='Successfully saved, but connection error to : ' + objTCPSocket.Host + ':' + objTCPSocket.Port + ' = Time out';
	    res.redirect('back');
	    //close.log("Timeout 3000");

	  });

	  client.connect(objTCPSocket.Port, objTCPSocket.Host, function() {
	    // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client
	    client.write(tcpmsg);
//	    console.log("Write Port: " + objTCPSocket.Port);
	  });

	  // Add a 'data' event handler for the client socket
	  // data is what the server sent to this socket
	  client.on('data', function(data) {
	  	 strMsg = data;
//	     console.log('DATA: ' + data);
	    // Close the client socket completely
	    client.destroy();

	    //req.flash('info', 'Successfully saved : ' +  strMsg);
	    req.session.messages='Successfully saved : ' +  strMsg;		//Meldung in der UI

//	    backURL=req.header('Referer') || '/';
//	    req.session.directpage = '/awesome';
//	    req.session.save();
	    res.redirect('back');

	  });

	  // Add a 'close' event handler for the client socket
	  client.on('close', function() {
          if (dbglvlpm >= 21) console.log ("< Info > Connection closed: ");
	    // console.log('Connection closed');
	  });

	  // Add a 'error' event handler for the client socket
	  client.on('error', function(error) {
	    //req.flash('warn', 'Successfully saved, but connection error to : ' + objTCPSocket.Host + ':' + objTCPSocket.Port + ' = ' + error );
	    req.session.messages='Successfully saved, but connection error to : ' + objTCPSocket.Host + ':' + objTCPSocket.Port + ' = ' + error;
	    res.redirect('back');
	  });

}

function callbackDummy(msg ) {

    console.log (" Im the Callback Answer in filemgr : " + msg);



}


/*
 * 
 * 		console.log ("File iso: "  + fileitsiso + " | filets: " + filets);
 * 		console.log ("Para iso: "  + paramstsiso +" | parats: " + paramsts);
 * 		console.log ("Delta: "  + (filets - paramsts)/1000 + " seconds");
 * 
 */

/**
 * Main Function for writing configuration to params.txt. 
 * including sending TCP Message to Flowmeter after successful writing
 * @param {string} filepath - path+filename to params.txt.
 * @param {string} configstring - parameter als json string.
 * @param {object} res - express::HTTP response.
 * @param {object} req - express::HTTP request
 * @param {string} TCPMessage - Message to FlowMeter.
 * @param {string} callback - sendtcpmessage als callback function..
 * @param {string} fileitsiso - timestamp in iso-format from saved params.txt.
 */
function writefilesync_wcb_ts(filepath, configstring, res, req,  TCPMessage, callback, fileitsiso) {
	
	// Timestamp-Check
	var currentDate = new Date();
	var paramsObject = new Object();	
	paramsObject = JSON.parse(configstring); //Configuration Object
		
	// Update Timestamp in params.txt
	if (paramsObject.Overview.LastModified !== undefined) {
		
		// generating iso-times
		var paramstsiso = paramsObject.Overview.LastModified; // Timestamp aus der Konfiguration aus dem WebUI
	
		var filets = new Date(fileitsiso).getTime();	//Linux timestamp from iso
		var paramsts = new Date(paramstsiso).getTime();	//Linux timestamp from iso
		
		if (fileitsiso < paramstsiso) {
			
			// zu speicherende Konfiguration ist neuer
			paramsObject.Overview.LastModified = currentDate.toISOString().replace(/T/, ' ').replace(/\..+/, '') ;	
			paramsObject.Overview.LastWriting = currentDate.toISOString().replace(/T/, ' ').replace(/\..+/, '') ;
			configstring = JSON.stringify(paramsObject, null, 4) + '\n';	
			console.log ("# Params-Timecheck: TS params_object ist neuer als gespeicherte ");
		} else {
			console.log ("# [ERROR] Params-Timecheck: Aeltere Konfiguration ");
			//tcpcode.sendlogmessage("# [ERROR] Timestamp Check | fileitsiso: " + fileitsiso + " params_ts: " + paramstsiso );
		}
	} 

	console.log("------ Begin Filewrite ------------------------------------");

	if (configstring.length > 10) {	//check empty configuration
	  try {	
	    var fd = fs.openSync(filepath, 'r');
		fs.writeFile(filepath, configstring, function (err) {
			if (err) {
			  throw err;
              console.log("# [ERROR] filemgr::writefilesync_wcb_ts error: " + err);
              console.log("------------------------------------------");
            } else {
              console.log("# replaced Timestamp:  " + fileitsiso);
              console.log("#      new Timestamp:  " + paramstsiso);                
              console.log("# FileWriting: " + filepath );
              console.log("# filemgr::writefilesync_wcb_ts was successful   ");
              console.log("------ End Filewrite --------------------------------------");
              console.log("");
            }
         //fs.fsyncSync(fd); //Aufruf ohne Callback
         fs.fsync(fd, callback(res, req, TCPMessage));
       });
      } catch (err) {
    	console.log("# [ERROR] try catch fall | Redirct mit Warnung: " + err );
    	// Error Message in UI
    	//req.session.messages=' Error Parameter Writing' + error;
	    //res.redirect('back');
      } 
      return 'success';

	} else {
	  console.log("# [ERROR] String Length: " + configstring.length );
      tcpcode.sendlogmessage("# [ERROR] String Length: " + configstring.length );
	}
}

/**
 * Main Function for writing configuration to params.txt. 
 * including sending TCP Message to Flowmeter after successful writing
 * @param {string} filepath - path+filename to params.txt.
 * @param {string} configstring - parameter als json string.
 * @param {object} res - express::HTTP response.
 * @param {object} req - express::HTTP request
 * @param {string} TCPMessage - Message to FlowMeter.
 * @param {string} callback - sendtcpmessage als callback function..
 */
function writefilesync_wcb(filepath, configstring, res, req,  TCPMessage, callback){
	
	var strlen = configstring.length;
	var lastmod=null;
	var thismod=null;
	var lastTimestamp=null;
	var newTimestamp=null;
	
	// generate Timestamp 
	var currentDate = new Date();
	var paramsObject = new Object();
	paramsObject = JSON.parse(configstring);
	
	if (paramsObject.Overview.LastModified !== undefined) {
		lastmod = paramsObject.Overview.LastWriting;
		thismod = currentDate.toISOString().replace(/T/, ' ').replace(/\..+/, '') ;
		paramsObject.Overview.LastModified = thismod;		
		configstring = JSON.stringify(paramsObject, null, 4) + '\n';	
	} 
	
	console.log("------ Begin Filewrite ------------------------------------");

	if (strlen > 10) {
		try {	
	        var fd = fs.openSync(filepath, 'r');
	        fs.writeFile(filepath, configstring, function (err) {

	        	if (err) {
	                throw err;
                    console.log("# [ERROR] filemgr::writefilesync_wcb error: " + err);
	                console.log("------------------------------------------");
	            } else {
	                console.log("# replaced Timestamp:  " + lastmod);
	                console.log("#      new Timestamp:  " + thismod);                
	                console.log("# FileWriting: " + filepath + " | Time: " + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') );
                    console.log("# FileWriting was successful | writefilesync_wcb -> TCP");
	                console.log("------ End Filewrite --------------------------------------");
	            	console.log("");

	            }
	            //fs.fsyncSync(fd);
	            fs.fsync(fd, callback(res, req, TCPMessage));
	        });
	    }
	    catch (err) {
	    	// Error Message in UI
	    	//req.session.messages=' Error Parameter Writing' + error;
		    //res.redirect('back');
	    	
	    }
	    return 'success';
    }  else {
		console.log("# [ERROR] String Length: " + strlen );
        tcpcode.TCP_SendLogMessage("# [ERROR] String Length: " + strlen );

    }


}

function writefilesync_ncb(filepath, configstring,  res, req) {


    var strlen = configstring.length;
    var lastmod = null;
    var thismod = null;
    var currentDate = new Date();
    thismod = currentDate.toISOString().replace(/T/, ' ').replace(/\..+/, '');

    var paramsObject = new Object();
    paramsObject = JSON.parse(configstring);

    if (paramsObject.Overview.LastModified !== undefined) {
        lastmod = paramsObject.Overview.LastWriting;
        paramsObject.Overview.LastModified = thismod;
        configstring = JSON.stringify(paramsObject, null, 4) + '\n';
    } 

    if (strlen > 10) {
        try {
            var fd = fs.openSync(filepath, 'r');
            fs.writeFile(filepath, configstring, function (err) {

                if (err) {
                    throw err;
                    console.log("------------------------------------------");
                    console.log("# [ERROR] filemgr::OverwriteSync error: " + err);
                    console.log("------------------------------------------");
                } else {
                    console.log("------------------------------------------");
                    console.log("# replaced Timestamp:  " + lastmod);
                    console.log("#      new Timestamp:  " + thismod);
                    console.log("# FileWriting: " + filepath + " | Time: " + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''));
                    console.log("# FileWriting was successful | writefilesync_ncb ");
                    console.log("------------------------------------------");
                }
                fs.fsyncSync(fd);
            });
        }
        catch (err) {

        }

    } else {
        console.log("-----------------------------");
        console.log("# ERROR PARAMETER Length == 0");
        console.log("-----------------------------");
    }

 

    return 'success';
}


