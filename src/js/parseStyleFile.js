/*
	Takes in command line arg text file  in the format specified below. 
	(New version should take in normal css files no need for commas)

	Problems:
			-Does not inline styles separated by commas e.g
			h1,h2,h3{
				color:red;
			}

			-Does not support child classes like 
			.exampleClass p {
				color:blue;
			}
			(This any p class that's parent is an example class)

	Solutions: 
	1) Just realized I can use cheerio to load in the hmtl file passed via the command line.
	(Nearly identical syntax to jquery) With this I just need to save the name of one style block
	and the rules associated with it. Then when inserting into the file I will do...
	$(styleObj['name']).attr('style',styleObj['rules'])

	*/



	function parseStyles() {
		var currentComma = 0;
    // Make sure we got a filename on the command line.
    if (process.argv.length < 4) {
    	console.log('Usage: node ' + process.argv[1] + ' STLYES_FILE HTMLOUTPUTFILE');
    	process.exit(1);
    }
    // Read the file and print its contents.
    var fs = require('fs'),filename = process.argv[2];
    fs.readFile(filename, 'utf8', function(err, data) {
    	if (err) throw err;
    	var styleArr = [];
    	var index = 0;
    	var name;
    	for (var i = 0; i < data.length; i++) {
    		if (data.charAt(i) === '{'){
    			name = data.substring(index, i);        		         
    			name = name.replace(/[\n\t\r]/g,"");
    			index = i + 1;
    		}else if(data.charAt(i)==='}'){
    			var entry = new styleObj();
    			entry.name = name;
    			name = '';
    			/*Construct the rules for the selected style */
    			var styles = data.substring(index, i);
    			/*Replace all new lines chars (on all 3 OS's) with '' via regex*/
    			styles = styles.replace(/[\n\t\r]/g,"");
          /*replace with a space to make sure its inlined correctly from minified css*/
          styles = styles.replace(';','; ');
          /* Last rules in the style block has optional semicolon see if it e*/
          if(styles.charAt(styles.length-1)!==';'){
            /*append a semicolon*/
            styles+='; '
          }
         // console.log(styles);
          //console.log(styles.charAt(styles.length-1));
    			entry.rules = styles;
    			index = i + 1;
    			styleArr.push(entry);
    		}
    	}
    	addBoilerPlateStyles(styleArr);
    	inlineStyles(styleArr);
    });
}


 /*
 	Utility function to add some boilerplate code to be inlined.
 	@param The style array from the first function.
 	*/ 
 function addBoilerPlateStyles(stylesArr){
 	/*<-------------------INLINE THESE STYLES------------------------> */
 	/*Outlook fixes	*/
 	var entry =  new styleObj();
 	entry.name = '#outlook a';
 	entry.rules = 'padding:0;';
 	stylesArr.push(entry);

 	var entry =  new styleObj();
 	entry.name = 'body';
 	entry.rules = 'width:100% !important; -webkit-text; size-adjust:100%; -ms-text-size-adjust:100%; margin:0; padding:0;';
 	stylesArr.push(entry);
 	
 	var entry =  new styleObj();
 	entry.name = '.backgroundTable';
 	entry.rules = 'margin:0 auto; padding:0; width:100%;!important;';
 	stylesArr.push(entry);
 	
 	var entry =  new styleObj();
 	entry.name = '.ExternalClass';
 	entry.rules = 'width:100%;';
 	stylesArr.push(entry);
 	
 	var entry =  new styleObj();
 	entry.name = '.ExternalClass,.ExternalClass p,.ExternalClass span,.ExternalClass font,.ExternalClass td,.ExternalClass div';
 	entry.rules = 'line-height:110%;';
 	stylesArr.push(entry);

 	var entry =  new styleObj();
 	entry.name = '.ReadMsgBody';
 	entry.rules = 'width: 100%;background-color: grey;';
 	stylesArr.push(entry);
 	
 	var entry =  new styleObj();
 	entry.name = '#backgroundTable';
 	entry.rules = 'margin:0; padding:0; width:100% !important; line-height: 100% !important;';
 	stylesArr.push(entry);
 	
 	var entry =  new styleObj();
 	entry.name = 'h2';
 	entry.rules = 'color:#0066CC !important;';
 	stylesArr.push(entry);
  	
  	var entry =  new styleObj();
  	entry.name = 'table';
 	entry.rules = 'mso-table-lspace: 0pt;mso-table-rspace: 0pt;';
 	stylesArr.push(entry);
 	

 	var entry =  new styleObj();
 	entry.name = 'img';
 	entry.rules = '-ms-interpolation-mode: bicubic;';
 	stylesArr.push(entry);
 	
 	var entry =  new styleObj();
 	entry.name = 'a img';
 	entry.rules = 'border:none;';
 	stylesArr.push(entry);
  	
  	var entry =  new styleObj();
  	entry.name = '.image_fix';
 	entry.rules = 'display:block;';
 	stylesArr.push(entry);
 	
 	var entry =  new styleObj();
 	entry.name = 'p';
 	entry.rules = 'margin: 1em 0;';
 	stylesArr.push(entry);
 	

  	var entry =  new styleObj();
 	entry.name = 'h1, h2, h3, h4, h5, h6';
 	entry.rules = 'color: black !important;';
 	stylesArr.push(entry);
 	
 	var entry =  new styleObj();
 	entry.name = 'h1 a, h2 a, h3 a, h4 a, h5 a, h6 a';
 	entry.rules = 'color: blue !important;';
 	stylesArr.push(entry);
 
  	var entry =  new styleObj();
 	entry.name = 'table';
 	entry.rules = 'border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;';
 	stylesArr.push(entry);

 	var entry =  new styleObj();
 	entry.name = 'a';
 	entry.rules = 'color: orange;';
 	stylesArr.push(entry); 
 }


/*Class (one of the ways to define is a function in javascript) to help parse styles 
  @param name The name of the style without prefixes such as . or # 
  @param type The type of style selector it implemented. If there was a ..
  	. type is 'class='
  	# type is 'id='
  	neither (. nor #) is blank
  @param rules holds the styling for the rules used the specified CSS selector.
  */
  function styleObj() {
  	this.name = "";
  	this.rules = "";
  }


/*
	Utility function used to create finalStyle object array and generate final inline strings
	and correct insertion position.
	Format is [node fileName.js readinCSS.txt outputHTML.html]
	@param Styles is an array of styleObj 
	@param position  The index in the document from where to the conintue the search (so elems
	do not overlap)
	(This is to be used after the user has generated and filled out their HTML classes)
	*/
	function inlineStyles(styles) {
		var fs = require('fs'),	filename = process.argv[3];
	//	console.log(styles);
		var cheerio = require("../../node_modules/cheerio");
		var data = fs.readFileSync(filename).toString();
		$ = cheerio.load(data);
		//console.log($.html());
		//process.exit(1);
		var styleInstance;
		var curElem;
		var inElem = -1;
		for (var i = 0; i < styles.length; i++) {
			$(styles[i]['name']).attr("style", function(){
				var retVal = $(this).attr("style");
				/*Converting undefined retval obj to empty string literal */
				retVal = (retVal || '') + '';
				return retVal + styles[i]['rules']; 	
			});
		} /*i for loop */ 
		//console.log($.html());
		var writeData = ($.html());
        var writeFile = fs.openSync(filename, 'r+'); //Open for reading and writing
        var buffString = writeData;
        let buffer = new Buffer(buffString);
        fs.writeSync(writeFile, buffer, 0, buffer.length, 0);
        fs.close(writeFile, function() {
        	console.log('wrote the file successfully');
        }); 
    }

    parseStyles();




















/*A script used for parsing inline HTML email styles via a passed in text file. 
 -Cannot use comments in Yahoo! Mail in style tag
 - Cannot use more than 1 class name on older versions of outlook email
 - Cannot use complicated (anything involving rules or 2 or more classes e.g body .myclass{...} )
 You can leave the media query styles in the <head> of your email, as clients that support media queries don’t strip out the <head> or <style> areas.
 Because inline styles have the highest specificity in the cascade, 
 it’s necessary for every media query style rule you write needs to be marked with a !important declaration
 */