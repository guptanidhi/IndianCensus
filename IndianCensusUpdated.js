/*
	In this file Converting CSV file Data to Array and then converting Array 
	to JSON format.
	And then filtering JSON Data Agewise for Literate Persons
*/

var fs = require("fs");
var lineReader = require("readline");
var files = ['./data/India2011.csv','./data/IndiaSC2011.csv','./data/IndiaST2011.csv'];

// Variable Declaration
var myarray = [];
var ageWiseArray = [];
var stateGenderWiseArray = [];
var educationArray = [];

// To read CSV files one by one and will push into 1 array
function readCSVFile(files){
	files.forEach(function(file) {
		fs.readFileSync(file).toString().split("\n").forEach(function(line, index){		
			var row = line.split(',');
			myarray.push(line);
		})
	})
	changeArrayToJSON(myarray);	
}

/*
	This method will change Array to JSON for all 3 files data &
	JSON will pass as a argument to filter data Agewise
*/
function changeArrayToJSON(myarray) {
	var jsonKeys = myarray[0].split(',');
	var rowArray = [];		
	for(var i=1;i<myarray.length;i++){
		var rowObj = {};
		var jsonValues = myarray[i].split(',');
		for(var value=0;value<jsonValues.length;value++){
			rowObj[jsonKeys[value]] = jsonValues[value];
		}
		rowArray.push(rowObj);
	}
	// Call to filter Agewise Data
	// filterAgeWiseLiteratePerson(rowArray);
	// Call to filter Genderwise Data
	// filterGenderWiseLiteratePerson(rowArray);
	// Call to filter Genderwise Data
	filterEducationCategoryWise(rowArray);
}

/*
	This method will filter Education - Category wise
*/
function filterEducationCategoryWise(array){
	array.forEach(function(value, index) {
		for(var prop in value) {			
	        if(value.hasOwnProperty(prop)) {
	        	if(prop.indexOf("Educational level") !== -1 && prop.lastIndexOf("Persons") !== -1){
        			var educationObj = {};
        			educationObj.educationLevel = prop;
        			educationObj.totalNumber = value[prop];
        			educationArray.push(educationObj);
	        	}	            
	        }	        
	    }
	});
	// console.log(JSON.stringify(educationArray));
	addValueForCommonKeys(educationArray, 'educationLevel', 'educationCategoryData.json')
}

/*
	This method will filter Statewise & GenderWise
*/
function filterGenderWiseLiteratePerson(array){
	array.forEach(function(value, index) {
		for(var prop in value) {			
	        if(value.hasOwnProperty(prop)) {	        	
	        	if(prop == "Area Name"){
        			var stateObject = {};
        			stateObject.state = value["Area Name"];
        			stateObject.graduateMale = parseInt(value["Educational level - Graduate & above - Males"]);
        			stateObject.graduateFemale = parseInt(value["Educational level - Graduate & above - Females"]);
        			stateGenderWiseArray.push(stateObject);
	        	}	            
	        }	        
	    }
	});
	// console.log(JSON.stringify(stateGenderWiseArray));
	addValueForCommonKeys(stateGenderWiseArray, 'state', 'genderStateWise.json')
}

/*
	This method will filter Agewise data of Literate persons
*/
function filterAgeWiseLiteratePerson(array){
	array.forEach(function(value, index) {
		for(var prop in value) {			
	        if(value.hasOwnProperty(prop)) {	        	
	        	if(prop == "Total/ Rural/ Urban"){
	        		if(value[prop] == "Total"){
	        			var ageObject = {};
	        			ageObject.ageGroup = value["Age-group"];
	        			ageObject.totalLiterate = value["Literate - Persons"];
	        			ageWiseArray.push(ageObject);
	        		}
	        	}	            
	        }	        
	    }
	});
	addValueForCommonKeys(ageWiseArray, 'ageGroup', 'ageWiseData.json')
}
/* This method will create new Array with adding Values of Same Keys
	and write file into Output folder with final JSON Data.
*/
function addValueForCommonKeys(array, commonObject, outputFileName){
	var tempObj = {};
	var uniqueKeyArray = [];
	for(var arrayItem in array){
		var obj1 = array[arrayItem];
		var obj2 = tempObj[obj1[commonObject]];

		if(!obj2){
			uniqueKeyArray.push(obj2 = tempObj[obj1[commonObject]] = {});
		}
		for(var k in obj1) 
			obj2[k] = k === commonObject ? obj1[commonObject] : parseInt(obj2[k]||0)+parseInt(obj1[k]);
	}
	console.log(JSON.stringify(uniqueKeyArray)); 
	fs.writeFile('output/'+outputFileName, JSON.stringify(uniqueKeyArray));
}


readCSVFile(files);