//var jsonparams = require('./jsonParams');
var fs = require('fs');
var readline  = require('readline');

var NowDate;
var StartDate;
const dbglvldb = 1;

var vfilename = "20170124PSC.log";
//	var vcombinepath = __dirname + "/Flowmeter/Log/" + vfilename;
//var vcombinepath = "/home/root/Flowmeter/Log/" + vfilename;
var vcombinepath = "" + vfilename;
var TS_ReadStart;
var PSCArray = [];

consolemenu();
keystrokehandler();

function consolemenu(){

    console.log("###########################################");
    console.log("# Filehandler Menu                    ");
    console.log("# 0. Fileinformation");
    console.log("# 	");
    console.log("# ReadFile");
    console.log("# 1. read complete file into Array ");
    console.log("# 2. search string in lines ");
    console.log("# 	");
    console.log("# ReadFileSync");
    console.log("# 3. readsync complete file into Array ");
    console.log("# 4. search string in lines ");
    console.log("# 	");    
    console.log("# Readline");
    console.log("# 5. read each line ");
    console.log("# 6. search string in lines ");
    console.log("# 	");
    console.log("# CreateReadstream");
    console.log("# 7. CreateReadstream complete file into Array ");
    console.log("# 8. search string in lines ");
    console.log("# 	");
    console.log("# Backwards Stream");
    console.log("# 9. CreateReadstream complete file into Array ");
    console.log("# 10. search string in lines ");
    console.log("# 	");
    console.log("# Folder Handling");
    console.log("# 20. search through folder ");
    console.log("# 21. identify newest log file");
    console.log("# 	");
    console.log("# 	");
    console.log("# Array Handling");
    console.log("# 11. Show Array ");
    console.log("# 12. Analyze Array");
    console.log("# 	");
    console.log("###########################################");
}


function keystrokehandler() {

    process.stdin.resume();
    process.stdin.setEncoding('utf8');

    process.stdin.on('data', function (chunk) {
// process.stdout.write('data: ' + chunk);

        var eingabe = chunk;
        eingabe = eingabe.replace(/\n|\r/g, "");

        switch (eingabe) {
            case "0":
                getFileInformation();
                break;

            case "1":
                readFileWith_ReadFile();
                break;

            case "2":
                parseFileWith_ReadFile();
                break;
            
            case "3":
            	readFileWith_ReadFileSync();
            	break;
            case "4":
            	parseFileWith_ReadFileSync();
            	break;

            case "5":
                readFileWith_readLine();
                break;
            case "6":
                parseFileWith_readLine();
                break;
                
            case "7":
                readFileWith_createReadStream();
                break;
            case "8":
            	parseFileWith_createReadStream();
            	break;
            	
            case "11":
            	show_PSCArray();
            	break;
            case "12":
            	convert_PSCArray_To_Object();
            	break;
            case "20":
                getFolderInformation();
                break;
            case "21":
                //getLatestFile();
                console.log (" switch getLatestFile: " + getLatestFile() );
                break;

            default:
                console.log (" switch default");
        }


    });

}

function ____File_Handling_with_readFile____() {}

function readFileWith_ReadFile()
{ 
	var count = 0;

    TS_ReadStart=new Date().getTime();

	fs.readFile(vcombinepath, function(err, data) {
        if(err) throw err;
        var array = data.toString().split("\n");
        for(i in array) {
    	    count++;
            //console.log(count + ".line: " + array[i]);
        }
        var TS_End=new Date().getTime();
        console.log ("[Benchmark] readFileWith_ReadFile " + (TS_End - TS_ReadStart) + " ms" );
    });




}

function parseFileWith_ReadFile()
{

    TS_ReadStart=new Date().getTime();

	var count = 0;
    var searchString = "0x7e 0x81";
    var parsedArray = [];
	
	fs.readFile(vcombinepath, function(err, data) {
        if(err) throw err;
        var array = data.toString().split("\n");
        for(i in array) {
    	    count++;
	        var idx = array[i].indexOf(searchString);
	        if (idx !== -1) {
                parsedArray.push(array[i]);
	    	    //console.log(count + ".line: " + array[i] + '\n');
	        }
	    
//      console.log(count + ".line: " + array[i]);
        }
        console.log (" Array Length " + array.length + " Elemente");
        console.log (" parsed Array Length " + parsedArray.length + " Elemente");

        var TS_End=new Date().getTime();
        console.log ("[Benchmark] parseFileWith_ReadFile " + (TS_End - TS_ReadStart) + " ms" );
        PSCArray = parsedArray;
	});




}

function ____File_Handling_with_readFileSync____() {}

function readFileWith_ReadFileSync() {
	
	var count = 0;
    TS_ReadStart=new Date().getTime();
    
	var objText = new Array();
	var array = fs.readFileSync(vcombinepath).toString().split("\n");

	objText.push(array[0]);

	for ( var i in array) {
		count++;
		//console.log(count + ".line: " + array[i]);
		objText.push(array[i]);

	}
	
    var TS_End=new Date().getTime();
    console.log ("[Benchmark] readFileWith_ReadFileSync " + (TS_End - TS_ReadStart) + " ms" );

}

function parseFileWith_ReadFileSync() {
	
	var count = 0;
    TS_ReadStart=new Date().getTime();
    
	var objText = new Array();
	var array = fs.readFileSync(vcombinepath).toString().split("\n");
	
    var searchString = "0x7e 0x81";
    var parsedArray = [];
    
	objText.push(array[0]);

	for ( var i in array) {
		count++;
		//console.log(count + ".line: " + array[i]);
		objText.push(array[i]);
		
        var idx = array[i].indexOf(searchString);
        if (idx !== -1) {
            parsedArray.push(array[i]);
    	    //console.log(count + ".line: " + array[i] + '\n');
        }

	}
	
    console.log (" Array Length " + array.length + " Elemente");
    console.log (" parsed Array Length " + parsedArray.length + " Elemente");
    var TS_End=new Date().getTime();
    console.log ("[Benchmark] parseFileWith_ReadFileSync " + (TS_End - TS_ReadStart) + " ms" );

}

function ____File_Handling_with_readline____() {}

function readFileWith_readLine()
{
    var count = 0;

    TS_ReadStart=new Date().getTime();


    var lineReader = require('readline').createInterface({
        input: require('fs').createReadStream(vcombinepath)
    });

    lineReader.on('line', function (line) {
        // console.log('Line from file:', line);
    });

    lineReader.on('close', function (line) {
        var TS_End=new Date().getTime();
        console.log ("[Benchmark] readFileWith_readLine " + (TS_End - TS_ReadStart) + " ms" );
    });


}

function parseFileWith_readLine()
{
    var count = 0;

    var searchString = "0x7e 0x81";
    var parsedArray = [];

    TS_ReadStart=new Date().getTime();


    var lineReader = require('readline').createInterface({
        input: require('fs').createReadStream(vcombinepath)
    });

    lineReader.on('line', function (line) {
        // console.log('Line from file:', line);
        var idx = line.indexOf(searchString);
        if (idx !== -1) {
            parsedArray.push(line);
            //console.log(count + ".line: " + array[i] + '\n');
        }
    });

    lineReader.on('close', function (line) {
        console.log (" parsed Array Length " + parsedArray.length + " Elemente");
        var TS_End=new Date().getTime();
        console.log ("[Benchmark] readFileWith_readLine " + (TS_End - TS_ReadStart) + " ms" );
    });


}

function ____File_Handling_with_createReadStream____() {}

function readFileWith_createReadStream()
{ 
	var count = 0;
	var strArray = [];
	
    TS_ReadStart=new Date().getTime();
   
    var stream = require('stream');
    var instream = fs.createReadStream(vcombinepath);
    var rl = readline.createInterface({input: instream, terminal: false});

    rl.on('line', function(line) {
    	count++;
//    	strArray = line.split(",");
    }); // Ende rl.on function

    rl.on('close', function() {
        console.log (" geparste Lines: " + count + " Lines");
        var TS_End=new Date().getTime();
        console.log ("[Benchmark] readFileWith_createReadStream " + (TS_End - TS_ReadStart) + " ms" );
    });

}


function parseFileWith_createReadStream()
{ 
	var count = 0;
	var strArray = [];
    var searchString = "0x7e 0x81";
    var parsedArray = [];
    
    TS_ReadStart=new Date().getTime();
   
    var stream = require('stream');
    var instream = fs.createReadStream(vcombinepath);
    var rl = readline.createInterface({input: instream, terminal: false});

    rl.on('line', function(line) {
    	count++;
        var idx = line.indexOf(searchString);
        if (idx !== -1) {
            parsedArray.push(line);
//            console.log(count + ".line: " + array[i] + '\n');
        }    	

    }); // Ende rl.on function

    rl.on('close', function() {
        console.log (" geparste Lines: " + count + " Lines");
        console.log (" parsed Array Length " + parsedArray.length + " Elemente");        
        var TS_End=new Date().getTime();
        console.log ("[Benchmark] readFileWith_createReadStream " + (TS_End - TS_ReadStart) + " ms" );
    });

}

function ____File_Handling_Backwards____() {}


function ____File_Informations____() {}


function getFileInformation()
{
    console.log ("< Info > [File] touchLogFile");

    var logcontent = new Object();
    logcontent = '';

    var sys = require('sys')
    var exec = require('child_process').exec;
    var child;
    var childdelete;



    var stats = fs.statSync(vcombinepath);
    var fileSizeInBytes = stats["size"];
    var filedate = stats["mtime"];

    //Convert the file size to megabytes (optional)
    var fileSizeInMegabytes = fileSizeInBytes / 1000000.0;
    console.log ("< Info > [File] touchLogFile File: " + vcombinepath + " | Size: " + fileSizeInMegabytes + "Mb");

}


function ____Folder_Informations____() {}


function getFolderInformation(){

    console.log ("< Info > [AJAX] AjaxGetMonthlyDataFiles: ");

    //var vcombinepath = "/home/root/Flowmeter/Log/" + vfilename;

    var folderpath = "/home/pi/coding_node/node_filehandling";

    var filenames;
    filenames = fs.readdirSync( folderpath );

    var filelist = new Object();


    for(var i in filenames) {

        var fileobj = new Object();
        var filena = filenames[i];

        var stats = fs.statSync(folderpath + "/" + filenames[i]);
        var fileSizeInBytes = stats["size"]
        var fileSizeInMegabytes = fileSizeInBytes / 1000000.0

        fileobj.filename =  filenames[i];
        fileobj.fileSizeInMegabytes =  fileSizeInMegabytes;
        fileobj.atime = stats["atime"];
        fileobj.ctime = stats["ctime"];
        fileobj.mtime = stats["mtime"];

        filelist[filena] = fileobj
        console.log("Filename Name: " + filenames[i] + "  | size: " + fileSizeInMegabytes + " | modify: " + stats["mtime"] );
    }


}

function getLatestFile(){

    var folderpath = "/home/pi/coding_node/node_filehandling/";

    var files = fs.readdirSync(folderpath);

     var out = [];
        files.forEach(function(file) {
            var stats = fs.statSync(folderpath + "/" +file);
            if( stats.isFile()  ) {
                if (!file.indexOf("201")) {
                out.push({"file":file, "mtime": stats.mtime.getTime()});
                }
            }
        });
        out.sort(function(a,b) {
            return b.mtime - a.mtime;
        })
        return (out.length>0) ? out[0].file : "";

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

function ____Handle_Log_Arrays____() {}

function show_PSCArray(){
	
	var count = 0;
    for(i in PSCArray) {
    	count++;
    	console.log(count + ".line: " + PSCArray[i]);
    }
}

function convert_PSCArray_To_Object(){
	
	var jsonPSCObj = new Object();
	var count = 0;
	
    for(i in PSCArray) {
    	console.log ("## Beginn der Schleife");
    	console.log("Kontrollstring: " + PSCArray[i]);
    	strArray = PSCArray[i].split(" ");
    	
    	count++;
    	var starthex = 0;
    	var hexlength = 0;
    	
    	for(i in strArray) {
    		hexlength++;
    		var idx = strArray[i].indexOf("0x81");
            if (idx !== -1) {
            	starthex = i;
            	console.log ("array." + i + " | " + strArray[i] + " idx: " + idx + " - TREFFER at " + starthex);
            }  
           
    	}
        if (starthex!=0 && hexlength > 30) {

          var OnePSCObj = new Object();
          var iCounter = parseInt(starthex);
          console.log (" Verabeitung mit Starthex: " + starthex + " Laenge: " + hexlength);
          console.log (" Verabeitung mit Wert: " + strArray[starthex]);
          console.log (" ++++++++++++++++++++++++++");
          console.log ("ts  :" + strArray[0] );
          console.log ("w00 :" + strArray[iCounter] + " | " + strArray[iCounter-1]);
          console.log ("w01 :" + strArray[iCounter + 2] + " | " + strArray[iCounter + 1]);
          console.log ("w02 :" + strArray[iCounter + 4] + " | " + strArray[iCounter + 3] + " || int: " + (parseInt(strArray[iCounter + 4]) * 256 + parseInt(strArray[iCounter + 3]) ) );
          console.log ("w03 :" + strArray[iCounter + 6] + " | " + strArray[iCounter + 5] + " || int: " + (parseInt(strArray[iCounter + 6]) * 256 + parseInt(strArray[iCounter + 5]) ) );
          console.log ("w04H :" + strArray[iCounter + 7]+ " || int: " + parseInt(strArray[iCounter + 7]) );
          console.log ("w04L :" + strArray[iCounter + 8]+ " || int: " + parseInt(strArray[iCounter + 8])  );
          console.log ("w05 :" + strArray[iCounter + 10] + " | " + strArray[iCounter + 9] + " || int: " + (parseInt(strArray[iCounter + 10]) * 256 + parseInt(strArray[iCounter + 9]) ) );
          console.log ("w06 :" + strArray[iCounter + 12] + " | " + strArray[iCounter + 11] + " || int: " + (parseInt(strArray[iCounter + 12]) * 256 + parseInt(strArray[iCounter + 11]) ) );
          console.log ("w07 :" + strArray[iCounter + 14] + " | " + strArray[iCounter + 13] + " || int: " + (parseInt(strArray[iCounter + 14]) * 256 + parseInt(strArray[iCounter + 13]) ) );
          console.log ("w08H :" + strArray[iCounter + 15]+ " || int: " + parseInt(strArray[iCounter + 15]));
          console.log ("w08L :" + strArray[iCounter + 16]+ " || int: " + parseInt(strArray[iCounter + 16]));
          console.log ("w09 :" + strArray[iCounter + 18] + " | " + strArray[iCounter + 17] + " || int: " + (parseInt(strArray[iCounter + 18]) * 256 + parseInt(strArray[iCounter + 17]) ) );
          console.log ("w10H :" + strArray[iCounter + 18]+ " || int: " + parseInt(strArray[iCounter + 18]));
          console.log ("w10L :" + strArray[iCounter + 19]+ " || int: " + parseInt(strArray[iCounter + 19]));
          console.log ("w11H :" + strArray[iCounter + 20]+ " || int: " + parseInt(strArray[iCounter + 20]));
          console.log ("w11L :" + strArray[iCounter + 21]+ " || int: " + parseInt(strArray[iCounter + 21]));   
          console.log ("w12H :" + strArray[iCounter + 22]+ " || int: " + parseInt(strArray[iCounter + 22]));
          console.log ("w12L :" + strArray[iCounter + 23]+ " || int: " + parseInt(strArray[iCounter + 23]));
          console.log ("w13 :" + strArray[iCounter + 25] + " | " + strArray[iCounter + 24] + " || int: " + (parseInt(strArray[iCounter + 25]) * 256 + parseInt(strArray[iCounter + 24]) ) );


          console.log (" ++++++++++++++++++++++++++");

          OnePSCObj.Timestamp = strArray[0];
          OnePSCObj.w0 = strArray[iCounter] + " " + strArray[iCounter-1]  ;
          OnePSCObj.w1 = strArray[iCounter + 2] + " " + strArray[iCounter + 1];
          OnePSCObj.w2  = + (parseInt(strArray[iCounter + 4]) * 256 + parseInt(strArray[iCounter + 3]) ) ;
          OnePSCObj.w3  = + (parseInt(strArray[iCounter + 6]) * 256 + parseInt(strArray[iCounter + 5]) ) ;
          OnePSCObj.w4h = parseInt(strArray[iCounter + 7]);
          OnePSCObj.w4l = parseInt(strArray[iCounter + 8]);
          OnePSCObj.w5 =  (parseInt(strArray[iCounter + 10]) * 256 + parseInt(strArray[iCounter + 9]) );
          OnePSCObj.w6 =(parseInt(strArray[iCounter + 12]) * 256 + parseInt(strArray[iCounter + 11]) );
          OnePSCObj.w7 = (parseInt(strArray[iCounter + 14]) * 256 + parseInt(strArray[iCounter + 13]) );
          OnePSCObj.w8h = parseInt(strArray[iCounter + 15]);
          OnePSCObj.w8l = parseInt(strArray[iCounter + 16]);
          OnePSCObj.w9 = (parseInt(strArray[iCounter + 18]) * 256 + parseInt(strArray[iCounter + 17]) );
          OnePSCObj.w10h = parseInt(strArray[iCounter + 18]);
          OnePSCObj.w10l = parseInt(strArray[iCounter + 19]);
          OnePSCObj.w11h = parseInt(strArray[iCounter + 20]);
          OnePSCObj.w11l = parseInt(strArray[iCounter + 21]);
          OnePSCObj.w12h = parseInt(strArray[iCounter + 22]);
          OnePSCObj.w12l = parseInt(strArray[iCounter + 23]);
          OnePSCObj.w13 = (parseInt(strArray[iCounter + 25]) * 256 + parseInt(strArray[iCounter + 24]) );

            jsonPSCObj.push(OnePSCObj);
        }
        console.log ("## Ende der Schleife");
    }
	
}
