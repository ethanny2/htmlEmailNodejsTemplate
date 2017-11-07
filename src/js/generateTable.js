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

	Note: First table 

	*/ 
	function createLayout () {
		if (process.argv.length < 3) {
			console.log('Usage: node ' + process.argv[1] + ' colnum1 colnum2 colnum3 .... colnumX');
			process.exit(1);
		}


		var layoutWrapper = $('<table cellpadding="0" cellspacing="0"></table>');
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
		var multiColTable = $('<table cellpadding="0" cellspacing="0"></table>');
		var tr = $("<tr></tr>");
		multiColTable.append(tr);
		for (var cols = 0; cols < columnCount; cols += 1) { 
			var td = $("<td></td>");
			tr.append(td);
		}
		return multiColTable;
	}




/*Function to add some common boilerplate code into the <head> tag. 
Call after every style that can be inlined has already been inlined*/
function addBoilerPlateCode(){
	var headElem = $("head");
	var styleElem = $("<style></style>");
	var htmlElem  = $('html');
	htmlElem.attr('xmlns','http://www.w3.org/1999/xhtml');
	htmlElem.attr(' xmlns:o','urn:schemas-microsoft-com:office:office');
	htmlElem.attr('xmlns:v','urn:schemas-microsoft-com:vml');
	headElem.append('<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>');
	headElem.append('<meta name="format-detection" content="telephone=no">'); 
	headElem.append('<meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0; user-scalable=no;">');
	headElem.append('<meta http-equiv="X-UA-Compatible" content="IE=9; IE=8; IE=7; IE=EDGE" />');
	//htmlElem.setAttribute('xmlns', '"http://www.w3.org/1999/xhtml"');
	/*Outlook fixes	 */
	styleElem.append('#outlook a { padding:0; }');
	styleElem.append('body{ width:100% !important; -webkit-text; size-adjust:100%; -ms-text-size-adjust:100%; margin:0; padding:0; }');
	styleElem.append('.backgroundTable {margin:0 auto; padding:0; width:100%;!important;}');
	styleElem.append('.ExternalClass {width:100%;}');
	styleElem.append('.ExternalClass,.ExternalClass p,.ExternalClass span,.ExternalClass font,.ExternalClass td,.ExternalClass div{line-height: 110%;}');
	styleElem.append('.ReadMsgBody {width: 100%;background-color: grey;}');
	/*Override green header color in outlook*/
	styleElem.append('h2{color:#0066CC !important;}'); 
	/*Make images resize nicely on IE */
	styleElem.append('table{mso-table-lspace: 0pt;mso-table-rspace: 0pt;}'); 
	styleElem.append('img {-ms-interpolation-mode: bicubic;}');
	/* Remove border when linking images*/
	styleElem.append('a img {border:none;}');
	/* This is a fix for Gmail/hotmail it to remove the extra space it adds below images*/
	styleElem.append('.image_fix {display:block;}');
	/*Yahoo Paragraph fix */
	styleElem.append('p {margin: 1em 0;}');
	/*Reset of hotmail header colors */
	styleElem.append('h1, h2, h3, h4, h5, h6 {color: black !important;}');
	styleElem.append('h1 a, h2 a, h3 a, h4 a, h5 a, h6 a {color: blue !important;}');
	styleElem.append('h1 a:active, h2 a:active,  h3 a:active, h4 a:active, h5 a:active, h6 a:active {color: red !important;}');
	styleElem.append('h1 a:visited, h2 a:visited,  h3 a:visited, h4 a:visited, h5 a:visited, h6 a:visited {color: purple !important;}');
	/*Fix of more table padding and spacing in Outlook 2010 */
	styleElem.append('table td {border-collapse: collapse;}');
	styleElem.append('table { border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; }');
	/*Yahoo uniform link color */
	styleElem.append('a {color: orange;}');
	/* To prevent yahoo from converting keywords into links*/
	styleElem.append('.yshortcuts a{background: none !important;border-bottom: none !important;}');


	/*MEDIA QUERIES DO NOT INLINE */
	styleElem.append('@media only screen and (max-device-width: 480px) {a[href^="tel"], a[href^="sms"] {text-decoration: none;color: black;pointer-events: none;cursor: default;}.mobile_link a[href^="tel"], .mobile_link a[href^="sms"] {	text-decoration: default;color: orange !important;pointer-events: auto;cursor: default;}}');
	styleElem.append('@media only screen and (min-device-width: 768px) and (max-device-width: 1024px){a[href^="tel"], a[href^="sms"] {text-decoration: none;color: blue; pointer-events: none;cursor: default;}.mobile_link a[href^="tel"], .mobile_link a[href^="sms"] {text-decoration: default;color: orange !important;pointer-events: auto;cursor: default;}}');
	styleElem.append('@media screen and (max-width: 630px){*[class="mobile-column"] {display: block;} *[class="mob-column"] {float: none !important;width: 100% !important;} *[class="hide"] {display:none !important;} *[class="100p"] {width:100% !important; height:auto !important;} *[class="condensed"] {padding-bottom:40px !important; display: block;} *[class="center"] {text-align:center !important; width:100% !important; height:auto !important;} *[class="100pad"] {width:100% !important; padding:20px;} *[class="100padleftright"] {width:100% !important; padding:0 20px 0 20px;} *[class="100padtopbottom"] {width:100% !important; padding:20px 0px 20px 0px;}}');
	styleElem.append('@media all and (max-width: 599px){.container600{width: 100%;}}');

	headElem.append(styleElem);
	headElem.append('<!-- Targeting Windows Mobile --><!--[if IEMobile 7]><style type="text/css"></style><![endif]-->');
	headElem.append('<!--[if gte mso 9]><style>/* Target Outlook 2007 and 2010 */</style><![endif]-->');
}











/*Append to body and see console output */
var layout = createLayout();
$("body").append(layout);
addBoilerPlateCode();
console.log(pretty($.html()));



