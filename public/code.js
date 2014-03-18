window.protocolRE = /(https?|ftp|mailto):\/\//;

window.linksRE    = /.*links=([a-zA-Z0-9.\-,:\/]*)/;

window.modeRE     = /.*mode=(automatic|manual)/;

function getLinks () {
    var url   = window.location.href;

    try {
	var links = linksRE.exec (url)[1];

	var result = links.split (",");

	if (result[0] != "")
	    return result;
	else
	    throw "InvalidArgument: links mustn't be empty";
    } catch (ex) {
	noLinks ();

	return [];
    }
}

function getMode () {
    var url = window.location.href;

    try {
	var mode = modeRE.exec (url) [1];

	return mode;
    } catch (ex) {
	return "manual";
    }
}

function redirectLink (link) {
    // Do not open links that execute javascript code
    if (link.match (/javascript:/)) {
	return;
    }

    // Assume http if not protocol supplied
    if (!link.match (protocolRE))
	link = "http://" + link;

    var win = window.open (link, "_blank");

    //win.focus ();
}

function redirect (links) {
    for (i = 0; i < links.length; i++) {
	var link = links [i];

	redirectLink (link);
    }
}

function redirectWaitProgress () {
    window.redirectWaitSeconds -= 1;

    if (window.redirectWaitSeconds == 0) {
	redirect (getLinks ());

	clearInterval (window.redirectWait);

	document.querySelector ("#redirect_btn").innerHTML = "Redirected. Happy browsing.";
	
	document.querySelector ("#redirect_btn").disabled  = true;
    } else {
	document.querySelector ("#redirect_btn").innerHTML = "You will be redirected in " + window.redirectWaitSeconds + " seconds. Click to disable."
    }
}

function buttonClicked () {
    if (window.redirectWait) {
	clearInterval (window.redirectWait);

	document.querySelector ("#redirect_btn").innerHTML = "Redirect";
    } else {
	redirect (getLinks ()); 

	document.querySelector ("#redirect_btn").innerHTML = "Redirected. Happy browsing.";
	
	document.querySelector ("#redirect_btn").disabled  = true;
    }
}

function fillLinksList () {
    var ul = document.querySelector ("#links");

    links  = getLinks ();

    links.forEach (function (link) {
	var li = document.createElement ("li");
	
	li.innerHTML = link;

	ul.appendChild (li);
    });
}

function noLinks () {
    console.log ("No links")

    var ul = document.querySelector ("#links");

    ul.innerHTML = "<li class='no-links-error'> Sorry. You got a malformed url. </li>";   

    var btn = document.querySelector ("#redirect_btn");

    btn.disabled  = true;
    btn.innerHTML = "No links :(";
}

window.onload = function () {
    var mode  = getMode  ();
    var links = getLinks ();

    if (links == []) {
	return;
    }

    document.querySelector ("#redirect_btn").addEventListener ("click", buttonClicked);

    fillLinksList ();

    if (mode == "automatic") {
	window.redirectWaitSeconds = 5;
	
	window.redirectWait = setInterval (redirectWaitProgress, 1000);
    }
}

