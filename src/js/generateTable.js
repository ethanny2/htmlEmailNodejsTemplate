/* Require the imported node modules to access their functions*/
var pretty = require("../../node_modules/pretty");
var cheerio = require("../../node_modules/cheerio");

//Load cheerio (according to the tutorial the library is similar to JQuery so we load into $ var or convenience) 
var $ = cheerio.load("");

/*
	This will be used to build a layout that should be mostly responsive across email clients without the
	use of media queries.
*/
function createLayout() {
    if (process.argv.length < 3) {
        console.log('Usage: node ' + process.argv[1] + ' [col # row #] *max for both 4');
        process.exit(1);
    }
    /*Create base layout with 1 row for header */
    var layoutWrapper = $('<center class="wrapper"></center>');
    var webkitWrapper = $('<div class="webkit"></div>');
    var outlookWrapperStart = $('<!--[if (gte mso 9)|(IE)]><table width="600" align="center" cellpadding="0" cellspacing="0" border="0"><tr><td> <![endif]-->');
    /* Append to the end after everything is done place out side outermost Table but inside webkit-wrapper*/
    var outlookWrapperEnd = $('<!--[if (gte mso 9)|(IE)]></td></tr></table> <![endif]-->');
    var outerTable = $('<table class="outer" align="center"></table>');
    var header = $('<tr><td class="full-width-image"> <img src="https://raw.githubusercontent.com/tutsplus/creating-a-future-proof-responsive-email-without-media-queries/master/images/header.jpg" width="600"/></td></tr>');
    webkitWrapper.append(outlookWrapperStart);
    outerTable.append(header);
    /*Here the user will pass in 2 numbers. The ith argument corresponds to the ith row
    the actual value of the argument itself corresponds to number of columns in the ith row.*/
    var layoutSetupList = process.argv;
    /*Iterating through the command line (process.argv) args. Note we start at 2 because in the
    array  process.argv[0] holds the path , process.argv[1] holds the process name*/
    for (var position = 2; position < layoutSetupList.length; position += 1) {
        var columnCount = layoutSetupList[position];
        /* Table cannot contain negative or 0 cols*/
        if (columnCount < 1) {
            throw new Error("The argument value has to be at least 1!");
            process.exit(1);
        }
        if (columnCount == 1) {
            outerTable.append('<tr><td class="one-column"><table width="100%"><tr><td class="inner contents"><p class="h1">Lorem ipsum dolor sit amet</p><p>Maecenas sed ante pellentesque, posuere leo id, eleifend dolor. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent laoreet malesuada cursus. Maecenas scelerisque congue eros eu posuere. Praesent in felis ut velit pretium lobortis rhoncus ut erat.</p></td></tr></table></td></tr>');
        } else if (columnCount == 2) {
            outerTable.append('<tr><td class="two-column"> <!--[if (gte mso 9)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td width="50%" valign="top"> <![endif]--><div class="column"><table width="100%"><tr><td class="inner"><table class="contents"><tr><td> <img src="https://raw.githubusercontent.com/tutsplus/creating-a-future-proof-responsive-email-without-media-queries/master/images/two-column-01.jpg" width="280" alt=""></td></tr><tr><td class="text"> Maecenas sed ante pellentesque, posuere leo id, eleifend dolor. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.</td></tr></table></td></tr></table></div> <!--[if (gte mso 9)|(IE)]></td><td width="50%" valign="top"> <![endif]--><div class="column"><table width="100%"><tr><td class="inner"><table class="contents"><tr><td> <img src="https://raw.githubusercontent.com/tutsplus/creating-a-future-proof-responsive-email-without-media-queries/master/images/two-column-02.jpg" width="280" alt=""></td></tr><tr><td class="text"> Maecenas sed ante pellentesque, posuere leo id, eleifend dolor. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.</td></tr></table></td></tr></table></div> <!--[if (gte mso 9)|(IE)]></td></tr></table> <![endif]--></td></tr>');
        } else if (columnCount == 3) {
            outerTable.append('<tr><td class="three-column"> <!--[if (gte mso 9)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td width="200" valign="top"> <![endif]--><div class="column"><table width="100%"><tr><td class="inner"><table class="contents"><tr><td> <img src="https://raw.githubusercontent.com/tutsplus/creating-a-future-proof-responsive-email-without-media-queries/master/images/three-column-01.jpg" width="180" alt=""></td></tr><tr><td class="text"> Scelerisque congue eros eu posuere. Praesent in felis ut velit pretium lobortis rhoncus ut erat.</td></tr></table></td></tr></table></div> <!--[if (gte mso 9)|(IE)]></td><td width="200" valign="top"> <![endif]--><div class="column"><table width="100%"><tr><td class="inner"><table class="contents"><tr><td> <img src="https://raw.githubusercontent.com/tutsplus/creating-a-future-proof-responsive-email-without-media-queries/master/images/three-column-02.jpg" width="180" alt=""></td></tr><tr><td class="text"> Scelerisque congue eros eu posuere. Praesent in felis ut velit pretium lobortis rhoncus ut erat.</td></tr></table></td></tr></table></div> <!--[if (gte mso 9)|(IE)]></td><td width="200" valign="top"> <![endif]--><div class="column"><table width="100%"><tr><td class="inner"><table class="contents"><tr><td> <img src="https://raw.githubusercontent.com/tutsplus/creating-a-future-proof-responsive-email-without-media-queries/master/images/three-column-03.jpg" width="180" alt=""></td></tr><tr><td class="text"> Scelerisque congue eros eu posuere. Praesent in felis ut velit pretium lobortis rhoncus ut erat.</td></tr></table></td></tr></table></div> <!--[if (gte mso 9)|(IE)]></td></tr></table> <![endif]--></td></tr>');
        } else if (columnCount == 4) {
            outerTable.append('<tr><td class="four-column"> <!--[if (gte mso 9)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td width="150" valign="top"> <![endif]--><div class="column"><table width="100%"><tbody><tr><td class="inner"><table class="contents"><tbody><tr><td> <img src="http://icons.iconarchive.com/icons/iynque/ios7-style/128/App-Store-icon.png" width="180" alt=""></td></tr><tr><td class="text"> Scelerisque congue eros eu posuere. Praesent in felis ut velit pretium lobortis rhoncus ut erat.</td></tr></tbody></table></td></tr></tbody></table></div> <!--[if (gte mso 9)|(IE)]></td><td width="150" valign="top"> <![endif]--><div class="column"><table width="100%"><tbody><tr><td class="inner"><table class="contents"><tbody><tr><td> <img src="http://icons.iconarchive.com/icons/iynque/ios7-style/128/Camera-icon.png" width="180" alt=""></td></tr><tr><td class="text"> Scelerisque congue eros eu posuere. Praesent in felis ut velit pretium lobortis rhoncus ut erat.</td></tr></tbody></table></td></tr></tbody></table></div> <!--[if (gte mso 9)|(IE)]></td><td width="150" valign="top"> <![endif]--><div class="column"><table width="100%"><tbody><tr><td class="inner"><table class="contents"><tbody><tr><td> <img src="http://icons.iconarchive.com/icons/iynque/ios7-style/128/iTunes-Store-icon.png" width="180" alt=""></td></tr><tr><td class="text"> Scelerisque congue eros eu posuere. Praesent in felis ut velit pretium lobortis rhoncus ut erat.</td></tr></tbody></table></td></tr></tbody></table></div> <!--[if (gte mso 9)|(IE)]></td><td width="150" valign="top"> <![endif]--><div class="column"><table width="100%"><tbody><tr><td class="inner"><table class="contents"><tbody><tr><td> <img src="http://icons.iconarchive.com/icons/iynque/ios7-style/128/Messages-icon.png" width="180" alt=""></td></tr><tr><td class="text"> Scelerisque congue eros eu posuere. Praesent in felis ut velit pretium lobortis rhoncus ut erat.</td></tr></tbody></table></td></tr></tbody></table></div> <!--[if (gte mso 9)|(IE)]></td></tr></table> <![endif]--></td></tr><tr>');
        }

    }
    webkitWrapper.append(outerTable);
    webkitWrapper.append(outlookWrapperEnd);
    layoutWrapper.append(webkitWrapper);

    return layoutWrapper;
}




/*Function to add some common boilerplate code into the <head> tag. 
Call after every style that can be inlined has already been inlined*/
function addBoilerPlateCode() {
    var headElem = $("head");
    var styleElem = $("<style></style>");
    var htmlElem = $('html');

    htmlElem.attr('xmlns', 'http://www.w3.org/1999/xhtml');
    htmlElem.attr(' xmlns:o', 'urn:schemas-microsoft-com:office:office');
    htmlElem.attr('xmlns:v', 'urn:schemas-microsoft-com:vml');
    headElem.append('<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>');
    headElem.append('<meta name="format-detection" content="telephone=no">');
    headElem.append('<meta name="viewport" content="width=device-width, initial-scale=1">');
    headElem.append('<meta http-equiv="X-UA-Compatible" content="IE=9; IE=8; IE=7; IE=EDGE" />');

    /*<-------------------INLINE THESE STYLES------------------------> */
    /*Outlook fixes	*/
    styleElem.append('#outlook a { padding:0; }');
    styleElem.append('body{ width:100% !important; -webkit-text; size-adjust:100%; -ms-text-size-adjust:100%; margin:0; padding:0; }');
    styleElem.append('.backgroundTable {margin:0 auto; padding:0; width:100%;!important;}');
    styleElem.append('.ExternalClass {width:100%;}');
    styleElem.append('.ExternalClass,.ExternalClass p,.ExternalClass span,.ExternalClass font,.ExternalClass td,.ExternalClass div{line-height: 110%;}');
    styleElem.append('.ReadMsgBody {width: 100%;background-color: grey;}');
    styleElem.append('#backgroundTable {margin:0; padding:0; width:100% !important; line-height: 100% !important;}');
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
    styleElem.append('table { border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; }');
    /*Yahoo uniform link color */
    styleElem.append('a {color: orange;}');

    /*<-------------------INLINE THESE STYLES------------------------> */
    styleElem.append('h1 a:active, h2 a:active,  h3 a:active, h4 a:active, h5 a:active, h6 a:active {color: red !important;}');
    styleElem.append('h1 a:visited, h2 a:visited,  h3 a:visited, h4 a:visited, h5 a:visited, h6 a:visited {color: purple !important;}');
    /*Fix of more table padding and spacing in Outlook 2010 */
    styleElem.append('table td {border-collapse: collapse;}');

    /* To prevent yahoo from converting keywords into links*/
    styleElem.append('.yshortcuts a{background: none !important;border-bottom: none !important;}');


    /*MEDIA QUERIES DO NOT INLINE */
    styleElem.append('@media only screen and (max-device-width: 480px) {a[href^="tel"], a[href^="sms"] {text-decoration: none;color: black;pointer-events: none;cursor: default;}.mobile_link a[href^="tel"], .mobile_link a[href^="sms"] {	text-decoration: default;color: orange !important;pointer-events: auto;cursor: default;}}');
    styleElem.append('@media only screen and (min-device-width: 768px) and (max-device-width: 1024px){a[href^="tel"], a[href^="sms"] {text-decoration: none;color: blue; pointer-events: none;cursor: default;}.mobile_link a[href^="tel"], .mobile_link a[href^="sms"] {text-decoration: default;color: orange !important;pointer-events: auto;cursor: default;}}');
    styleElem.append('@media screen and (max-width:400px){.four-column .column,.three-column .column,.two-column .column,.two-column img{max-width:100%!important}.three-column img{max-width:50%!important}.four-column img{max-width:25%!important}}@media screen and (min-width:401px) and (max-width:620px){.four-column .column{max-width:25%!important}.three-column .column{max-width:33%!important}.two-column .column{max-width:50%!important}}');




    headElem.append(styleElem);
    headElem.append('<!-- Targeting Windows Mobile --><!--[if IEMobile 7]><style type="text/css"></style><![endif]-->');
    headElem.append(' <!--[if (gte mso 9)|(IE)]><style type="text/css">table {border-collapse: collapse;}</style><![endif]-->');
}











/*Append to body and see console output */
var layout = createLayout();
layout= layout.substring(layout.indexOf('<html>'),layout.length);
console.log(layout);
$("body").append(layout);
addBoilerPlateCode();
/*Remove console.log output generated by package json script*/

//console.log(pretty($.html()));