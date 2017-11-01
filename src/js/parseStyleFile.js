/*A script used for parsing inline HTML email styles via a passed in text file. 
 -Cannot use comments in Yahoo! Mail in style tag
 - Cannot use more than 1 class name on older versions of outlook email
 - Cannot use complicated (anything involving rules or 2 or more classes e.g body .myclass{...} )
 You can leave the media query styles in the <head> of your email, as clients that support media queries don’t strip out the <head> or <style> areas.
 Because inline styles have the highest specificity in the cascade, 
 it’s necessary for every media query style rule you write needs to be marked with a !important declaration
 */


/*
	Takes in command line arg text file  in the format specified below. Classes/styles are
	separated by commas, (even the final one) and the file is terminated when the END string
	(all caps) is reached
	*/
	function parseStyles(){
	//Array with each index containing a class/styles 
	var styleArr = [] ;
	var currentComma=0;

	// Make sure we got a filename on the command line.
	if (process.argv.length < 3) {
		console.log('Usage: node ' + process.argv[1] + ' FILENAME.txt');
		process.exit(1);
	}
	// Read the file and print its contents.
	var fs = require('fs'), filename = process.argv[2];
	fs.readFile(filename, 'utf8', function(err, data) {
		if (err) throw err;
		console.log('OK: ' + filename);
		//console.log(data)
		for(var i=0;i<data.length;i++){
			/*Check if the comma is from a "complex" style defintion targeting 2 or more classes
			WHICH YOU'RE not supposed to do, but just as a precation */
			if(data.charAt(i)==',' && data.charAt(i-1)=='}'){
				/* Construct new instance of styleObj and add it to the array */
				var rawString = data.substring(currentComma,i);
				var entry  = new styleObj();

				/*Gets the name in front of the style (could be .class ,#id , normal elem)*/
				var name = rawString.substring(0,rawString.indexOf('{'));
				/*Check what type of selector it is, and remove [. or  #] selector if present */
				if(name.indexOf('.')>-1){
					entry.type='class=';
					name = name.replace('.','');
					name= name.trim();

				}else if(name.indexOf('#')>-1){
					entry.type='id=';
					name = name.replace('#','');
					name= name.trim();

				}else{
					/*Must be a normal element*/
					entry.type='normal'
					name= name.trim();
				}
				entry.name = name; 
				/*Construct the rules for the selected style */
				var styles = rawString.substring(rawString.indexOf('{')+1,rawString.indexOf('}'));
				/*I guess I'll leave it as a string instead, easier to insert. 
				Replace all new lines chars (on all 3 OS's) with nothing*/
				styles = styles.replace(/(\r\n|\n|\r)/gm,"");
				styles = styles.replace(/\t/g, '');
				entry.ruleArray = styles;
				currentComma = i +1;
				//console.log(rawString);
				console.log(entry);
				console.log('**********************************');
			}
		}
	});
}



/*Class (one of the ways to define is a function in javascript) to help parse styles 
  @param name The name of the style without prefixes such as . or # 
  @param type The type of style selector it implemented. For 
  */
  function styleObj() {
  	this.name = "";
  	this.type = "";
  	this.ruleArray = "";
  }


  parseStyles();


// .table{
// 	font-size:16px;
// },

// .tr{
// 	background-color:red;
// },

// .td{
// 	opacity:1;
// },END