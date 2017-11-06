/*
	Takes in command line arg text file  in the format specified below. Classes/styles are
	separated by commas, (even the final one). (e.g body{color:red}, p{display:none},)
	*/
	function parseStyles() {
    //Array with each index containing a class/styles 
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
    	for (var i = 0; i < data.length; i++) {
            /*Check if the comma is from a "complex" style defintion targeting 2 or more classes
            WHICH YOU'RE not supposed to do, but just as a precation */
            if (data.charAt(i) == ',' && data.charAt(i - 1) == '}') {
            	/* Construct new instance of styleObj and add it to the array */
            	var rawString = data.substring(currentComma, i);
            	var entry = new styleObj();
            	/*Gets the name in front of the style (could be .class ,#id , normal elem)*/
            	var name = rawString.substring(0, rawString.indexOf('{'));
            	/*Check what type of selector it is, and remove [. or  #] selector if present */
            	if (name.indexOf('.') > -1) {
            		entry.type = 'class=';
            		name = name.replace('.', '');
            		name = name.trim();

            	} else if (name.indexOf('#') > -1) {
            		entry.type = 'id=';
            		name = name.replace('#', '');
            		name = name.trim();

            	} else {
            		/*Must be a normal element*/
            		entry.type = ''
            		name = name.trim();
            	}
            	entry.name = name;
            	/*Construct the rules for the selected style */
            	var styles = rawString.substring(rawString.indexOf('{') + 1, rawString.indexOf('}'));
            	/*Replace all new lines chars (on all 3 OS's) with '' via regex*/
            	styles = styles.replace(/(\r\n|\n|\r)/gm, "");
            	styles = styles.replace(/\t/g, '');
            	entry.rules = styles;
            	currentComma = i + 1;
            	styleArr.push(entry);
            }
        }
        /*At the end insert the styles inlined into the specified HTML file */
        var position = 0;
        var new_pos = 0;
        var num = countElements();
        for (var i = 0; i < num; i++) {
        	if (new_pos !== undefined || new_pos!== null) {
        		new_pos = inlineStyles(styleArr, position);
        		console.log(new_pos + ' at position i ' + i);
        		position = new_pos;
        	}
        }
    });
}



/*
	Utility function to count the number of elements in the passed in HTML file. To determine
	how many times to loop through the file
	*/
	function countElements() {
		var fs = require('fs'),filename = process.argv[3];
		data = fs.readFileSync(filename).toString();
		var elemCount = 0;
		var curElem = '';
		for (var i = 0; i < data.length; i++) {
			if (data.charAt(i) == '<' && data.charAt(i + 1) != '/') {
				inElem = 1;
			} else if (data.charAt(i) == '>' && inElem > 0) {
				inElem = -1;
				curElem += '>';
				elemCount++;
				console.log('Found: ' + curElem + "as " + elemCount + ' index.');
				curElem = '';
			}
			if (inElem > 0) {
				curElem += data.charAt(i);
			}
		}
		return elemCount;
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
  	this.type = "";
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
	function inlineStyles(styles, position) {
		var fs = require('fs'),filename = process.argv[3];
		data = fs.readFileSync(filename).toString();
		var styleInstance;
		var curElem;
    /*Indicates wheather the loop is between 2 '<' and '>' symbols which incidates a new
    element */
    var inElem = -1;
    for (var i = position; i < data.length; i++) {
    	/* Look for the names in the data, don't parse ending tags. */
    	if (data.charAt(i) == '<' && data.charAt(i + 1) != '/') {
    		inElem = 1;
    	} else if (data.charAt(i) == '>' && inElem > 0) {
    		/*Element ended append inline styles 1 position before the closing >.*/
    		inElem = -1
    		curElem += '>';
    		var selector;
            var styleString = 'style=" '; // End with '"'
            var insertPosition = i - 1;
            /*See if current element has any matching class, id or element */
            for (var j = 0; j < styles.length; j++) {
            	/*Construct appropriate substring from style array*/
            	if (styles[j]['type'] === 'class=') {
            		selector = styles[j]['type'] + '"' + styles[j]['name'] + '"';
            	} else if (styles[j]['type'] === 'id=') {
            		selector = styles[j]['type'] + '"' + styles[j]['name'] + '"';
            	} else if (styles[j]['type'] === '') {
            		selector = styles[j]['name'];
            	}
            	if (curElem.indexOf(selector) > -1) {
            		/* If yes apply the styles */
            		styleString += styles[j]['rules'].trim();
            	}
            }
           // var entry = new finalStyle(styleString, insertPosition, styleString.length);
           if (styleString !== 'style=" ') {
           	styleString += ' "';
               // styleInstance = (entry);
               curElem = '';
               var content = data.toString();
               content = content.substring(insertPosition+1);
               content+=' ';
                var writeFile = fs.openSync(filename, 'r+'); //Open for reading and writing
                var buffString = '" ' + styleString + content;
                let buffer = new Buffer(buffString);
                fs.writeSync(writeFile, buffer, 0, buffer.length, insertPosition);
                fs.close(writeFile, function() {
                	console.log('wrote the file successfully');
                });
                /* Reopen the file but skip current element, return the insert position of the
                string + the length of the string to figure out where to search from */
                return insertPosition + styleString.length;
                break;
            }
        } /*else if '>' ending element */
        if (inElem > 0) {
        	/* Build the string*/
        	curElem += data.charAt(i);
        }
    } /*i for loop */
}


/*Function to add some common boilerplate code into the <head> tag. 
Call after every style that can be inlined has already been inlined*/
function addBoilerPlateCode(){
	var headElem = document.head.innerHTML;
	var htmlElem = document.documentElement;
	var styleElem = $('<style></style>');
	headElem.append('<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>');
	headElem.append('<meta name="format-detection" content="telephone=no">'); 
	headElem.append('<meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0; user-scalable=no;">');
	headElem.append('<meta http-equiv="X-UA-Compatible" content="IE=9; IE=8; IE=7; IE=EDGE" />');
	htmlElem.setAttribute('xmlns', '"http://www.w3.org/1999/xhtml"',);
	/*Outlook fixes */
	styleElem.append();

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