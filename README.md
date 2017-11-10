# htmlEmailNodejsTempl

Usage: As of now, navigate to the src/js directory to use the scripts

1. To create a responsive boilerplate for an html email
	Usage: 
		node generateTable.js [i=1] numCol [i=2] numCol ... [i=x]numCol

		Where the ith argument corresponds to the ith row in the table layout. And the value of the arguement itself is the number of columns.

	Example: 
		node generateTable.js 1 2 2 4 > output.html

		Generates responsive boilerplate for a layout with 4 row with 1 col, 2 colums ,2 columns and 4 columns in that order and puts the output into the specified html file.


2. To inline a CSS file on a specified html file 
Usage:
	node parseStyleFile.js yourFile.css output.html 

	Example:
		node parseStyle.js ../testFiles/minified_test.css output.html 
		Inlines CSS into specified html file while added some boiler plate code in the style element for meida queries and other HTML email hacks/fixes.

	***Note: Psudeo elements do not work inlined, do not use these. Don't use comments either,
	it is best to run your CSS through a minifier first. This done automatically in the future ***



To do:
- Update Package.json scripts to run the javascript files with out navigating to the directory they are in.
-Create a footer for the boilerplate HTML.
-Find places (free) to test email on different clients.
-Add a minifier tool so that the CSS file is automatically minified (and comments are removed) before.
-Line more necessary styles from the CSS file.
-Clean repo of test files