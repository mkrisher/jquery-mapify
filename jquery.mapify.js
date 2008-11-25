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
 * 
 * @param Object obj                            An object literal containing key/value pairs to overwrite default settings.
 * 
 * @option String image 			            A string of the image path as the basis for the map. 
 * 												Default value: "map.gif"
 * 
 * @option Number zoom 			                A number between 100-200. 100 completely zoomed out. 200 being the most zoomed in. 
 * 												Default value: 100
 *
 * @option Number coordinates 			        An array containing the x and y position of the map to initially jump to.
 * 												Default value: [0,0]
 *
 * @option String image 			            A string of the image path as the basis for the map. 
 * 												Default value: "map.gif"
 *
 * @option Boolean debug 			            A boolean to turn debugging messages on and off 
 * 												Default value: true
 * 
 * @type jQuery
 *
 * @name mapify
 * 
 * @cat Plugins/Mapify
 * 
 * @author Michael Krisher/mike@mikekrisher.com
 */

 (function($){
     
     // extend jquery object
     $.extend({
         
        // define mapify method
        mapify: new function() {
        
            // ------------------------------ PROPERTIES

            // define plugin name
            var name = "mapify", obj = this,

            // define the defaults
            defaults = {
             	    map_image:      "images/map.gif",
             		up_image:       "images/up.gif",
             		right_image:    "images/right.gif",
             		down_image:     "images/down.gif",
             	    left_image:     "images/left.gif",
             	    center_image:   "images/center.gif",
             	    plus_image:     "images/plus.gif",	
             		minus_image:    "images/minus.gif",
             		track_image:    "images/track.gif",
             		slider_image:   "images/slider.gif",
             		zoom:           100,
             		coordinates:    [0,0],
             		distance:       50, 
             		debug:          true
             	}; 

            // ------------------------------ PRIVATE METHODS
            
            // draw legend method, in the upper left hand corner
            function drawLegend()
            {
                debug('drawing legend: ' + elementID);
                $("#" + elementID).append("<div id=\"legend\" style=\"position:absolute; top:15px; left:15px; z-index:2; height:280px; width:78px; border:dashed 1px red;\"></div>");
                $("#legend").append("<div id=\"up\" style=\"position: absolute; top:0px; left:24px;\"><img src=" + defaults.up_image + " border=\"0\" alt=\"up\" /></div>");
                $("#legend").append("<div id=\"left\" style=\"position: absolute; top:24px; left:0px;\"><img src=" + defaults.left_image + " border=\"0\" alt=\"left\" /></div>");
                $("#legend").append("<div id=\"center\" style=\"position: absolute; top:24px; left:24px;\"><img src=" + defaults.center_image + " border=\"0\" alt=\"center\" /></div>");
                $("#legend").append("<div id=\"right\" style=\"position: absolute; top:24px; left:48px;\"><img src=" + defaults.right_image + " border=\"0\" alt=\"right\" /></div>");
                $("#legend").append("<div id=\"down\" style=\"position: absolute; top:48px; left:24px;\"><img src=" + defaults.down_image + " border=\"0\" alt=\"down\" /></div>");
                $("#legend").append("<div id=\"plus\" style=\"position: absolute; top:72px; left:24px;\"><img src=" + defaults.plus_image + " border=\"0\" alt=\"plus\" /></div>");
                $("#legend").append("<div id=\"track\" style=\"position: absolute; top:96px; left:24px;\"><img src=" + defaults.track_image + " border=\"0\" alt=\"track\" /></div>");
                $("#legend").append("<div id=\"minus\" style=\"position: absolute; top:256px; left:24px;\"><img src=" + defaults.minus_image + " border=\"0\" alt=\"minus\" /></div>");
                
                $("#up").bind("click", function(e) {
                   debug('up clicked');
                });
                
                $("#right").bind("click", function(e) {
                   debug('right clicked'); 
                });
                
                $("#down").bind("click", function(e) {
                   debug('down clicked'); 
                });
                
                $("#left").bind("click", function(e) {
                   debug('left clicked'); 
                });
                
                $("#center").bind("click", function(e) {
                   debug('center clicked'); 
                });
                
                $("#plus").bind("click", function(e) {
                   debug('plus clicked'); 
                });
                
                $("#minus").bind("click", function(e) {
                   debug('minus clicked'); 
                });
            };
            
            // draw map, adding image to the current DOM element
            function drawMap()
            {
                debug('drawing map: ' + defaults.map_image);
                $("#" + elementID).append("<img src=\"" + defaults.map_image + "\" border=\"0\" alt=\"map\" />");
            };
            
            function moveMap(direction) 
            {
                
            }
                
            // debug method, utilizing console or alerts
            function debug(s) 
            {
                if (defaults.debug == true) {
                    if (typeof console != "undefined" && typeof console.debug != "undefined") {
             		    console.log(s);
             		} else {
             			alert(s);
             		}
             	}
            };

            // ------------------------------ PUBLIC METHODS
             
            // init method, sets up the map functions and properties
            this.init = function() 
            {
                elementID = this[0].id;
                debug("initializing mapifying: " + elementID);
                return this.each(function() {
                    drawLegend();
                    drawMap();
 			    });
 			} // end init
             
        } // end mapify

    }); // end extend
    
    // extend plugin scope
	$.fn.extend({
        mapify: $.mapify.init
	});
    

})(jQuery); // return jquery object