var fs = require("fs");
var paramscode = require('./parameters');
var logger = require('./log');
var tcpcode = require('./tcptoflowmeter');



function readfile(filepath) {
  try
  {
  fs.readFile(filepath, function (err, data) {
    if (err) throw err;
  });
  }
  catch (err) {

  }
}

function overwritefile(filepath, newstring) {
    console.info ("# filemgr::overwritefile");

  try
  {
      // writeFileSync
      //fs.writeFile(filepath, newstring, function (err) {

    fs.writeFile(filepath, newstring, function (err) {
      if (err) throw err;
          });
  }
  catch (err) {

  }

  return 'success';
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


function OverwriteFileAndTCPCallback(filepath, newstring,  res, req, TCPMessage, callback) {


    var strlen = newstring.length;
//    console.info ("# filemgr::OverwriteFileAndTCPCallback String Length: " + strlen);

    if (strlen < 10) {
    	console.log ("-----------------------------");
    	console.log ("# ERROR PARAMETER Length == 0");
    	console.log ("-----------------------------");
//    	logger.error("node.js | ERROR beim Filewrite: " + logstr);
    }

    try
    {
      // writeFileSync
      //fs.writeFile(filepath, newstring, function (err) {
       // fs.writeFileSync(filepath, newstring, function (err) {
      fs.writeFile(filepath, newstring, function (err) {
    	  var ts_hms = new Date();
    	  var logstr = (
    			    ("0" + ts_hms.getHours()).slice(-2) + ':' +
    			    ("0" + ts_hms.getMinutes()).slice(-2) + ':' +
    			    ("0" + ts_hms.getSeconds()).slice(-2) + '.' +
    			    ("0" + ts_hms.getMilliseconds()).slice(-2) +
    			    " JSON_params.txt writing. Length:" + strlen

    	  );
    	  console.log ("------------------------------------------");
    	  console.log (logstr);
    	  console.log ("------------------------------------------");
//    	  logger.info("node.js | File Write: " + logstr);
//    	  console.log ("# filemgr::OverwriteFileAndTCPCallback Writetime: " + ts_hms);
//        tcpcode.TCP_SendLogMessage("OverwriteTCPCallbackSync: "+ strlen);
        tcpcode.TCP_SendLogMessage("Successful writen: "+ strlen);
    	  
    	  if (err){
    		  throw err;
    		  console.log ("# [ERROR] filemgr::OverwriteFileAndTCPCallback error: " + err);
    	  }
    	  callback(res, req, TCPMessage);
      });
    }
    catch (err) {

    }

    return 'success';
}

function OverwriteTCPCallbackSync_ORGINAL(filepath, newstring, res, req, TCPMessage, callback) {


    var strlen = newstring.length;
    var ts_hms = new Date();
    var tsmsg = (
    ("0" + ts_hms.getHours()).slice(-2) + ':' +
    ("0" + ts_hms.getMinutes()).slice(-2) + ':' +
    ("0" + ts_hms.getSeconds()).slice(-2) + '.' +
    ("0" + ts_hms.getMilliseconds()).slice(-2));


    if (strlen < 10) {
        console.log("-----------------------------");
        console.log("# ERROR PARAMETER Length == 0");
        console.log("-----------------------------");
//        logger.error("node.js | ERROR beim Filewrite: " + logstr);
    }

    try {
        // fs.writeFileSync(filepath, newstring, function (err) {
        var fd = fs.openSync(filepath, 'r');
        fs.writeFile(filepath, newstring, function (err) {

            if (err) {
                throw err;
                console.log("------------------------------------------");
                console.log("# [ERROR] filemgr::OverwriteTCPCallbackSync error: " + err);
                console.log("------------------------------------------");
            } else {
                console.log("------------------------------------------");
                console.log("# OverwriteTCPCallbackSync erfolgreich");
                console.log("# Time:  " + tsmsg);
                console.log("# filepath:  " + filepath);
                console.log("------------------------------------------");

//                tcpcode.TCP_SendLogMessage("OverwriteTCPCallbackSync: "+ strlen);
            }
            //fs.fsyncSync(fd);
            fs.fsync(fd, callback(res, req, TCPMessage));
        });
    }
    catch (err) {

    }

    return 'success';
}

function OverwriteTCPCallbackSync(filepath, newstring, res, req, TCPMessage, callback) {
	
	var strlen = newstring.length;
	var LastModified=null;
	var NewModified=null;
	var lastTimestamp=null;
	var newTimestamp=null;
	
	// Timestamp - Check Beginn
		
	var currentDate = new Date();
	var paramsObject = new Object();
	paramsObject = JSON.parse(newstring);
	
	if (paramsObject.Overview.LastModified !== undefined) {
		LastModified = paramsObject.Overview.LastWriting;
		NewModified = currentDate.toISOString().replace(/T/, ' ').replace(/\..+/, '') ;
	
		lastTimestamp = new Date(LastModified).getTime();
		newTimestamp = currentDate.getTime();
    
		paramsObject.Overview.LastModified = NewModified;		
		var paramstring= JSON.stringify(paramsObject, null, 4) + '\n';
		newstring = paramstring;		
	} 
	// Timestamp - Check End

//	  try {	// TODO alles exkludieren
		  
	console.log("");
	console.log("------ Begin Filewrite ------------------------------------");
	
	if (newTimestamp && lastTimestamp){
		if (newTimestamp > lastTimestamp) 
			console.log("# Timestamp Check: OK | " + (newTimestamp - lastTimestamp)/1000 + " seconds" ); 
		else {
			console.log("# [ERROR] Timestamp Check:  " + (newTimestamp - lastTimestamp)/1000 + " seconds" );
	        tcpcode.TCP_SendLogMessage("# [ERROR] Timestamp Check:  " + (newTimestamp - lastTimestamp)/1000 + " seconds" );
//			throw "Timestamp";
		}
	}  

	if (strlen < 10) {
		console.log("# [ERROR] String Length: " + strlen );
        tcpcode.TCP_SendLogMessage("# [ERROR] String Length: " + strlen );
//		throw "String Length";
    }  else 
	    	console.log("# String Length: OK | " + strlen + " Chars");

	try {	// keine kritische Abfrage von Timestamp + String
        var fd = fs.openSync(filepath, 'r');
        fs.writeFile(filepath, newstring, function (err) {

        	if (err) {
                throw err;
                console.log("# [ERROR] filemgr::OverwriteTCPCallbackSync error: " + err);
                console.log("------------------------------------------");
            } else {
                console.log("# replaced Timestamp:  " + LastModified);
                console.log("#      new Timestamp:  " + NewModified);                
                console.log("# FileWriting: " + filepath + " | Time: " + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') );
                console.log("# FileWriting was successful | OverwriteTCPCallbackSync ");
                console.log("------ End Filewrite --------------------------------------");
            	console.log("");
//            	tcpcode.TCP_SendLogMessage("Successful writen: "+ strlen);
            }
            //fs.fsyncSync(fd);
            fs.fsync(fd, callback(res, req, TCPMessage));
        });
    }
    catch (err) {
    	console.log("# [ERROR] try catch fall | Redirct mit Warnung: " + err );
    }
    return 'success';
}


function OverwriteSync(filepath, newstring,  res, req) {


    var strlen = newstring.length;
    var ts_hms = new Date();
    var tsmsg = (
		    ("0" + ts_hms.getHours()).slice(-2) + ':' +
		    ("0" + ts_hms.getMinutes()).slice(-2) + ':' +
		    ("0" + ts_hms.getSeconds()).slice(-2) + '.' +
		    ("0" + ts_hms.getMilliseconds()).slice(-2));

    if (strlen < 10) {
    	console.log ("-----------------------------");
    	console.log ("# ERROR PARAMETER Length == 0");
    	console.log ("-----------------------------");
    }
    try
    {
    	var fd = fs.openSync(filepath, 'r');
    	fs.writeFile(filepath, newstring, function (err) {

    	  if (err){
    		  throw err;
              console.log ("------------------------------------------");
    		  console.log ("# [ERROR] filemgr::OverwriteSync error: " + err);
              console.log ("------------------------------------------");
    	  } else {
    		console.log ("------------------------------------------");
    		console.log ("# OverwriteSync erfolgreich");
       	  	console.log ("# Time:  " + tsmsg);
       	  	console.log ("# filepath:  " + filepath);
       	  	console.log ("------------------------------------------");
   		  }
    	  fs.fsyncSync(fd);
      });
    }
    catch (err) {

    }

    return 'success';
}


function appendtofile(filepath, appendstring) {
  try
  {
    var log = fs.createWriteStream(filepath, {'flags': 'a'});
    // use {'flags': 'a'} to append and {'flags': 'w'} to erase and write a new file
    log.end(appendstring);
    return 'success';
  }
  catch (err) {

  }
}

function callbackAnswer () {

    console.log (" Im the Callback Answer in filemgr ");



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


exports.overwritefilesync=overwritefilesync;
exports.callbackAnswer=callbackAnswer;
exports.OverwriteFileAndTCPCallback=OverwriteFileAndTCPCallback;
exports.readfile = readfile;
exports.overwritefile = overwritefile;
exports.appendtofile = appendtofile;
exports.OverwriteTCPCallbackSync=OverwriteTCPCallbackSync;
exports.OverwriteSync=OverwriteSync;