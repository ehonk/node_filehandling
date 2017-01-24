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

consolemenu();
keystrokehandler();

function consolemenu(){

    console.log("###########################################");
    console.log("# Filehandler Menu                    ");
    console.log("# 0. Fileinformation");
    console.log("# 	");
    console.log("# ReadFile");
    console.log("# 1. read complete file into Array ");
    console.log("# 2. search string in array ");
    console.log("# 	");
    console.log("# Readline");
    console.log("# 5. read each line ");
    console.log("# 6. search string in array ");
    console.log("# 	");
    console.log("# readFileSync");
    console.log("# 7. read complete file into Array ");
    console.log("# 68. search string in array ");
    console.log("# 	");
    console.log("# CreateReadstream");
    console.log("# 4. read complete file ");
    console.log("# 5. get complete file into array");
    console.log("# 6. search string in array ");
    console.log("# 	");
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

            case "5":
                readFileWith_readLine();
                break;
            case "6":
                parseFileWith_readLine();
                break;

            default:
                console.log (" switch default");
        }


    });
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
    var searchString = "Profiler::doMeasurement";
    var parsedArray = [];
	
	fs.readFile(vcombinepath, function(err, data) {
        if(err) throw err;
        var array = data.toString().split("\n");
        for(i in array) {
    	    count++;
	        var idx = array[i].indexOf("Profiler::doMeasurement");
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
	});




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

    var searchString = "Profiler::doMeasurement";
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

