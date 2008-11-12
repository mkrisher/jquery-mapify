/*
 * 
 * Mapify 1.0 - Google Maps UI functionality with ease!
 * Version 0.0.1
 * @requires jQuery v1.2.3 or greater
 * 
 * Copyright (c) 2008 Michael Krisher
 * Examples and docs at: http://github.com/mkrisher/jquery-mapify/
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 * 
 */
/**
 *
 * @description Create a map object similar to Google Maps UI with custom imagery
 * 
 * @example $('mapDIV').mapify(options);
 * @desc Create a simple map UI passing options, including imagery
 * 
 * @param Object settings An object literal containing key/value pairs to provide optional settings.
 * 
 * @option String image 			            A string of the image path as the basis for the map. 
 * 												Default value: "map.gif"
 * 
 * @type jQuery
 *
 * @name mapify
 * 
 * @cat Plugins/Mapify
 * 
 * @author Michael Krisher/mike@mikekrisher.com
 */

(function($) {
	$.extend({
		mapify: new function() {
			
			var name = "mapify"
			// var coordinates = [];
			
			this.defaults = {
				image: "images/map.gif",
				debug: true
			};
			
			/* debuging utils */
			function benchmark(s,d) {
				log(s + "," + (new Date().getTime() - d.getTime()) + "ms");
			};
			
			this.benchmark = benchmark;
			
			function log(s) {
				if (typeof console != "undefined" && typeof console.debug != "undefined") {
					console.log(s);
				} else {
					alert(s);
				}
			};
						
			/* public methods */
			this.construct = function(settings) {
				
			};
			
		};
	});
})(jQuery);