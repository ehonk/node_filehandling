//var jsonparams = require('./jsonParams');
var fs = require('fs');
var readline  = require('readline');
var moment = require('moment');
var iconv = require('iconv');

var NowDate;
var StartDate;
const dbglvldb = 1;

var vfilename1 = "Auszug1.txt";
var vfilename2 = "Auszug10seiten.txt";

var vfilename4 = "Auszuglongbar.txt";

var vfilename3 = "Auszuglongnormal.txt";
var vfilename5 = "Auszuglongnormal00.txt";
var vfilename6 = "Auszuglongnormal02.txt";
var vfilename7 = "Auszuglongnormal03.txt";

var vcombinepath = "" + vfilename7;
var TS_ReadStart;
var PSCArray = [];

var output = 'daten.txt';
var outstream = fs.createWriteStream(output, {flags: "w"});


nodeparser();

function toUTF8(body) {
  // convert from iso-8859-1 to utf-8
  var ic = new iconv.Iconv('iso-8859-1', 'utf-8');
  var buf = ic.convert(body);
  return buf.toString('utf-8');
}

function nodeparser(){
	
	 // Read file
	var count = 0;
	var searchstring;
	var dateReg = /^\d{2}([./-])\d{2}\1\d{4}$/
	var wasdateline = false;
	var vorgang = false;
	var betraggefunden = false;
	
    TS_ReadStart=new Date().getTime();
    
    var Buchungsdatum = "";
    var Valdatum ="";
    var PNNR="";
    var AZGNR="";
    var Vorgang="";
    var Betrag="";
    var Empfaenger = "";
    var Sender = "";
    var Bemerkung = "";
    
    var writedate = true;

    // Header erstellen in csv
    outstream.write("Buchungsdatum;Valdatum;PN-NR;AZG-NR;Vorgang;Betrag;Emfpaenger;Zahlungspflichter;Bemerkung;" + "\n");


	fs.readFile(vcombinepath,   { encoding: 'utf8' }, function(err, data) {
        if(err) throw err;

        var bodystring = data.toString('utf8').replace(/^\uFEFF/, '');
        
        var array = bodystring.split("\n");
        for(i in array) {
    	    count++;

            var linearray = array[i].split(" ");
            //console.log ("Zelle0: " + linearray[0]);

            // Schreibvorgang neues erkannt, writedate true
            if ((linearray[0].match(dateReg)) && (!writedate)) {
                //console.log ("Zelle0: " + linearray[0] + " neues erkannt, write down");
                writedate = true;
                betraggefunden = false;
               	//var outstring = Buchungsdatum + ";" + Valdatum + ";" + PNNR + ";" + AZGNR + ";" + "\n";

             	var outstring = Buchungsdatum + ";" + Valdatum + ";" + PNNR + ";" + AZGNR + ";" + Vorgang + ";" + Betrag + ";" + Empfaenger + ";" + Sender + ";" + Bemerkung + ";" + "\n";
                outstream.write(outstring);

                Buchungsdatum = "";
                Valdatum ="";
                PNNR="";
                AZGNR="";
                Vorgang="";
                Betrag="";
                Empfaenger = "";
                Sender = "";
                Bemerkung = "";
            }

            // Erkennen, writedate = false;
            if (linearray[0].match(dateReg)) {
                console.log ("Zelle0: " + linearray[0] + " Beginn");
                writedate = false;

               	Buchungsdatum = linearray[0];
            	Valdatum = linearray[1];
            	PNNR = linearray[2];
            	AZGNR = linearray[3];

               	if ((linearray[5])!==undefined ){
                	
                    if (linearray[5] === "+") {
                        Betrag = linearray[5] + linearray[6];
                    } else{
                        Betrag = linearray[5];
                    }
                   /* console.log ("Vorgang   : [4]: " + linearray[4] );
                    console.log ("Betrag   : [5]: " + linearray[5] );
                    console.log ("Betrag   : [6]: " + linearray[6] );
                    console.log ("Betrag   :  " + Betrag ); */
                	Vorgang = linearray[4];

                	betraggefunden = true;
                    //console.log ("--> Betrag gefunden: " + Betrag + " | Vorgang: " + Vorgang) ;
            	}
                vorgang = true;
            } else {
	            //console.log ("l." + i + " zeile: " + array[i] );

                    if (!betraggefunden){
                        
                        	if ( (!linearray[0].match("Emp")) && (!linearray[0].match("Beg")) && (!linearray[0].match("BIC")) ){
                                 Vorgang = linearray[0];     
                                if (linearray[1] === "+") {
                                  Betrag = linearray[1] + linearray[2];
                                } else{
                                    Betrag = linearray[1];
                                }    
                   
                            }
                        betraggefunden = true;
                    }   // Ende Betrag finden

                    // Bemerkung
            			if ( (!linearray[0].match("Emp")) 
                            && (!linearray[0].match("Beg")) 
                            && (!linearray[0].match("IBAN")) 
                            && (!linearray[0].match("BIC")) 
                            && (!linearray[0].match("Datum")) 
                            && (!linearray[0].match("Val.D"))  ){ 

            				if (linearray[0].match("BLZ")){
            					//console.log ("BLZ   : " + linearray[0]) ;
            					//console.log ("KTO   : " + linearray[1]) ;
            				} else {
                				// hier weiter
//                				 console.log ("--" + i + " cell0: " + linearray[0] + " cell1: " + linearray[1] + " cell2: " + linearray[2]);
                				 Bemerkung = linearray[0];
                         		if ( linearray[2] !== undefined ) {
                         			Bemerkung = Bemerkung + " " + linearray[1];
                        		}
                         		if ( linearray[3] !== undefined ) {
                         			Bemerkung = Bemerkung + " " + linearray[2];
                        		}
                                console.log (" ---> Bemekerung: " + Bemerkung);
            				}
            					
			
        			} // Ende Bemekrung                    

                    // Empfänger
                	if (linearray[0].match("Emp")){
                		//console.log ("Zahlungsempfaenger: " + linearray[1] + " " + linearray[2]+ " " + linearray[3] );
//                		Empfaenger = linearray[1] + "," + linearray[2]+ "," + linearray[3];
                		Empfaenger = linearray[1];

                		if ( linearray[3] !== undefined ) {
                			Empfaenger = Empfaenger + " " + linearray[2];
                		}
                		
                		if ( linearray[4] !== undefined ) {
                			Empfaenger = Empfaenger + " " + linearray[3];
                		}
                			
                	}

                    if (linearray[0].match("Beg")){
                		//console.log ("Zahlungspflichtiger: " +  linearray[1] + " " + linearray[2]) ;  
                		Sender = linearray[1];
                		
                		if ( linearray[3] !== undefined ) {
                			Sender = Sender + " " + linearray[2];
                		}
                    }


            }
            
        }
        var TS_End=new Date().getTime();
        console.log ("[Benchmark] readFileWith_ReadFile " + (TS_End - TS_ReadStart) + " ms" );
        outstream.end();
    });

}

function isDate(dateVal) {
	  var d = new Date(dateVal);
	  return d.toString() === 'Invalid Date'? false: true;
	}

