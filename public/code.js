window.protocolRE = /(https?|ftp|mailto):\/\//;

window.linksRE    = /.*links=([a-zA-Z0-9.\-,:\/]*)/;

window.modeRE     = /.*mode=(redirect|split)/;

function getLinks () {
	var url   = window.location.href;

	try {
		var links = linksRE.exec (url)[1];

		return links.split (",");
	} catch (ex) {
		document.write ("error: links are null");

		return [];
	}
}

function getMode () {
	var url = window.location.href;

	try {
		var mode = modeRE.exec (url) [1];

		return mode;
	} catch (ex) {
		return "redirect";
	}
}

function redirectLink (link) {
	// do not open links that execute javascript code
	if (link.match (/javascript:/)) {
		return;
	}

	if (!link.match (protocolRE))
		link = "http://" + link;

	var win = window.open (link, "_blank");

	win.focus ();
}

function redirect (links) {
	for (i = 0; i < links.length; i++) {
		var link = links [i];

		redirectLink (link);
	}
}

function split (links) {
	console.log ("Split view")
}