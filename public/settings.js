////////////////////////////////////////////////////////////////////////////////
///                                                                          ///
///                Copyright (c) Aleksandar Jovanov 2014                     ///
///                                                                          ///
////////////////////////////////////////////////////////////////////////////////

Settings = {
    automaticAllowed: false,

    timeout: 5,
    
    strToBool: function (value) {
    	if (value === "true") 
    	    return true;
    	else if (value === "false")
    	    return false;
    	else
    	    throw "ValueError: A bool can only be true or false. The supplied value is: " + value;
    },

    ////////////////////////////////////////////////////////////
    isAutomaticAllowed: function () {
	   return Settings.automaticAllowed;
    },

    toggleAutomatic: function () {
    	Settings.automaticAllowed = !Settings.automaticAllowed;

    	window.localStorage ["allow_automatic"] = Settings.automaticAllowed;
    },

    //////////////////////////////////////////////////////////// 
    getTimeout: function () {
	   return Settings.timeout;
    },

    setTimeout: function (value) {
    	Settings.timeout = value;

    	window.localStorage ["timeout"] = value;
    },

    //////////////////////////////////////////////////////////// 
    load: function () {
    	Settings.automaticAllowed = Settings.strToBool (window.localStorage ["allow_automatic"] || "false");

    	Settings.timeout          = parseInt (window.localStorage ["timeout"] || "5");
    }
}
