//var jsonparams = require('./jsonParams');
var fs = require('fs');
var readline  = require('readline');

var NowDate;
var StartDate;
const dbglvldb = 1;

var vutffilename = "umlaut_utf.txt";
var vansifilename = "umlaut_ansi.txt";
//	var vcombinepath = __dirname + "/Flowmeter/Log/" + vfilename;
//var vcombinepath = "/home/root/Flowmeter/Log/" + vfilename;
var vcombinepath = "" + vutffilename;
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
    console.log("# 1. utf-file -> readfile utf8 ");
    console.log("# 2. ansi-file -> readfile utf8 ");
    console.log("# 3. ansi-file -> readfile ascii ");    
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
                readfile_utf8(vutffilename);
                break;
            case "2":
                readfile_utf8(vansifilename);
                break;
            case "3":
                readfile_ascii(vansifilename);
                break;

            default:
                console.log (" switch default");
        }


    });

}

function ____File_Handling_with_readFile____() {}

function readfile_utf8(thisfilename)
{ 
	var count = 0;

    TS_ReadStart=new Date().getTime();

	fs.readFile(thisfilename, "utf8",  function(err, data) {
        if(err) throw err;
        var array = data.toString().split("\n");
        for(i in array) {
    	    count++;
            console.log(count + ".line: " + array[i]);
        }
        var TS_End=new Date().getTime();
        console.log ("[Benchmark] readFileWith_ReadFile " + (TS_End - TS_ReadStart) + " ms" );
    });




}

function readfile_ascii(thisfilename)
{ 
	var count = 0;

    TS_ReadStart=new Date().getTime();

	fs.readFile(thisfilename, "ascii",  function(err, data) {
        if(err) throw err;
        var array = data.toString().split("\n");
        for(i in array) {
    	    count++;
            console.log(count + ".line: " + array[i]);
        }
        var TS_End=new Date().getTime();
        console.log ("[Benchmark] readFileWith_ReadFile " + (TS_End - TS_ReadStart) + " ms" );
    });

ascii


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