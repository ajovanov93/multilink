////////////////////////////////////////////////////////////////////////////////
///                                                                          ///
///                Copyright (c) Aleksandar Jovanov 2014                     ///
///                                                                          ///
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
window.protocolRE = /(https?|ftp|mailto):\/{2}/;

window.linksRE    = /.*links=([a-zA-Z0-9.\-,:\/]*)/;

window.modeRE     = /.*mode=(automatic|manual)/;

////////////////////////////////////////////////////////////////////////////////
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


////////////////////////////////////////////////////////////////////////////////
function runStartupChecks () {
    if (!'localStorage' in window) {
	   alert ("Local storage is not supported.");
    }
}

////////////////////////////////////////////////////////////////////////////////
function redirectLink (link) {
    // Do not open links that execute javascript code
    if (link.match (/javascript:/)) {
	   return;
    }

    // Assume http if protocol is not supplied
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

// Only for automatic redirects. Manual redirects are instantenous.
function redirectWaitProgress () {
    window.redirectWaitSeconds -= 1;

    if (window.redirectWaitSeconds == 0) {
    	redirect (getLinks ());

    	clearInterval (window.redirectWait);

    	var btn = document.querySelector ("#redirect-btn");

    	btn.innerHTML = "Redirected. Happy browsing.";
    	
    	btn.disabled  = true;
    } else {
	   document.querySelector ("#redirect-btn").innerHTML = "You will be redirected in " + window.redirectWaitSeconds + " seconds. Click to stop."
    }
}

////////////////////////////////////////////////////////////////////////////////
function fillLinksList () {
    var ul = document.querySelector ("#links");

    links  = getLinks ();

    links.forEach (function (link) {
    	var li = document.createElement ("li");
    	
    // Assume http if protocol is not supplied
    if (!link.match (protocolRE))
        link = "http://" + link;

    	li.innerHTML = "<a href='" + link + "'>" + link + "</a>";

    	ul.appendChild (li);
    });
}

function noLinks () {
    //console.log ("No links")

    var ul = document.querySelector ("#links");

    ul.innerHTML = "<li class='no-links-error'> Sorry. You got a malformed url. </li>";   

    var btn = document.querySelector ("#redirect-btn");

    btn.disabled  = true;
    btn.innerHTML = "No links :(";
}

////////////////////////////////////////////////////////////////////////////////
function buttonClicked () {
    if (window.redirectWait === 1) {
    	clearInterval (window.redirectWait);

    	// clearInterval will only stop the functions from firing again, it will not recycle the interval id
    	// so we do it manually
    	window.redirectWait = -1;

    	this.innerHTML = "Redirect";
    } else {
    	redirect (getLinks ()); 

    	this.innerHTML = "Redirected. Happy browsing.";
    	
    	this.disabled  = true;
    }
}

function linkClicked () {
    Settings.toggleAutomatic ();

    this.innerHTML = Settings.isAutomaticAllowed () ? "(disable)" : "(enable)";

    document.querySelector ("#automatic-allowed").innerHTML = 
        Settings.isAutomaticAllowed () ? "enabled" : "disabled"; 
}

////////////////////////////////////////////////////////////////////////////////
function setupGUI () {
    var allowAutomaticLink = document.querySelector ("#allow-automatic-link");

    document.querySelector ("#redirect-btn").addEventListener ("click", buttonClicked);

    allowAutomaticLink.addEventListener ("click", linkClicked);

    allowAutomaticLink.innerHTML = Settings.isAutomaticAllowed () ? "(disable)" : "(enable)";

    document.querySelector ("#automatic-allowed").innerHTML = 
        Settings.isAutomaticAllowed () ? "enabled" : "disabled"; 

    fillLinksList ();
}

////////////////////////////////////////////////////////////////////////////////
window.onload = function () {
    runStartupChecks ();

    var mode     = getMode  ();
    var links    = getLinks ();

    Settings.load ();

    setupGUI ();

    if (links == []) {
	   return;
    }

    if (mode == "automatic" && Settings.isAutomaticAllowed ()) {
    	window.redirectWaitSeconds = Settings.getTimeout ();
    	
    	window.redirectWait = setInterval (redirectWaitProgress, 1000);
    }
}