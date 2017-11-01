/* Require the imported node modules to access their functions*/
var pretty = require("../../node_modules/pretty");
var cheerio = require("../../node_modules/cheerio");

//Load cheerio (according to the tutorial the library is similar to JQuery so we load into $ var or convenience) 
var $ = cheerio.load("");


/*
	A function used to take in commond line arguments (via a nodejs variable),
	and then set up a table with the specified args.
	Usage: node generateTable.js arg1 arg2 arg3 .... argx
	(Where arg must be >1)
	Example: node generateTable.js 2 2 2 will make a table with 3 rows (# of args) each with 2 columns
	inside of them. 
	As opposed to placing mulitple <td> elements in a <tr> element to create multiple-columns a new
	table (with its own <tr> and <td> elements) is constructed and placed within the main table of the 
	layoutWrapper var <table><tr><td>....Output of createMultiColumn </td></tr>
*/ 
	function createLayout () {
		if (process.argv.length < 3) {
			console.log('Usage: node ' + process.argv[1] + ' colnum1 colnum2 colnum3 .... colnumX');
			process.exit(1);
		}


		var layoutWrapper = $("<table></table>");
		var layoutSetupList = process.argv; 

		/*Iterating through the command line (process.argv) args. Note we start at 2 because in the
		array  process.argv[0] holds the path , process.argv[1] holds the process name */

		for (var position = 2; position < layoutSetupList.length; position += 1) {
			var columnCount = layoutSetupList[position];
			/* Table cannot contain negative or 0 cols*/
			if (columnCount < 1) {
				throw new Error ("The argument value has to be at least 1!");
				process.exit(1);
			}

			/* Necessary*/
			var tr = $("<tr></tr>");
			layoutWrapper.append(tr);
			var td = $("<td></td>");
			tr.append(td);

			/*If there is more than one element we append to the td of the current row another table
			using the helper function. */
			if (columnCount > 1) {
				td.append(createMultiColumn(columnCount));
			}
		}
		return layoutWrapper;
	}


	function createMultiColumn(columnCount) {
		/*Create new table and add loop through columnCount var appending one <td> element for each */
		var multiColTable = $("<table></table>");
		var tr = $("<tr></tr>");
		multiColTable.append(tr);
		for (var cols = 0; cols < columnCount; cols += 1) { 
			var td = $("<td></td>");
			tr.append(td);
		}
		return multiColTable;
	}














	/*Append to body and see console output */
	var layout = createLayout();
	$("body").append(layout);
	console.log(pretty($.html()));



/*Need to add 
	<meta charset="utf-8" />  
	<meta name="viewport" content="width=device-width, initial-scale=1" />   
  For proper media queries
*/