////////////////////////////////////////////////////////////////////////////////
///                                                                          ///
///                Copyright (c) Aleksandar Jovanov 2014                     ///
///                                                                          ///
////////////////////////////////////////////////////////////////////////////////

function timeoutEntryTextChanged () {
    console.log ("change");

    var re = /^[0-9]+$/;

    var text = this.value;

    var messageElem = document.querySelector ("#timeout-validation-message");

    var ok = re.test (text);

    if (ok) {
    	Settings.setTimeout (parseInt (text));

    	messageElem.innerHTML = "";
    } else {
	   messageElem.innerHTML = "Use only numbers.";
    }
}

window.onload = function () {
    Settings.load ();

    var te = document.querySelector ("#timeout-entry");

    te.value = Settings.getTimeout ();
    
    te.addEventListener ("keyup", timeoutEntryTextChanged);
}