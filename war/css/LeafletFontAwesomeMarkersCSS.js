(function() {
var cssStr = "" +
".marker-pin {" +
"	width: 30px;" +
"	height: 30px;" +
"	border-radius: 50% 50% 50% 0;" +
"	background: #c30b82;" +
"	position: absolute;" +
"	transform: rotate(-45deg);" +
"	left: 50%;" +
"	top: 50%;" +
"	margin: -15px 0 0 -15px;" +
"}" +
"" +
".marker-pin::after {" +
"	content: '';" +
"	width: 24px;" +
"	height: 24px;" +
"	margin: 3px 0 0 3px;" +
"	background: #fff;" +
"	position: absolute;" +
"	border-radius: 50%;" +
"}" +
"" +
".custom-div-icon i {" +
"	position: absolute;" +
"	width: 22px;" +
"	font-size: 22px;" +
"	left: 0;" +
"	right: 0;" +
"	margin: 10px auto;" +
"	text-align: center;" +
"}" +
"" +
".custom-div-icon i.awesome {" +
"	margin: 12px auto;" +
"	font-size: 17px;" +
"}" +
"";
d3.select(document).select("head").insert("style").text(cssStr);
})();
