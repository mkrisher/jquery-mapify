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
 * TODO: add logic for overwriting defaults with options passed in
 * TODO: adding zoom in and zoom out logic, making it as easy as possible to add multiple resolutions of the "map" for zoom levels
 */
/**
 *
 * @description Create a map object similar to Google Maps UI with custom imagery
 * 
 * @example $("#map").mapify();
 * 
 * @param Object obj          An object literal containing key/value pairs to overwrite default settings.
 * 
 * @option String image 	    A string of the image path as the basis for the map. 
 * 												    Default value: "map.gif"
 * 
 * @option Number zoom 		    A number between 100-200. 100 completely zoomed out. 200 being the most zoomed in. 
 * 												    Default value: 100
 *
 * @option Number coordinates An array containing the x and y position of the map to initially jump to.
 * 												    Default value: [0,0]
 *
 * @option String image 			A string of the image path as the basis for the map. 
 * 												    Default value: "map.gif"
 *
 * @option Boolean debug 			A boolean to turn debugging messages on and off 
 * 												    Default value: true
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
             		zoom:           2,
             		zoom_levels:    3,
             		zoom_sizes:     [[800,600], [1600,1200], [3200,2400]],
             		coordinates:    [1200,600],
             		distance:       256,
             		speed:          500,
             		debug:          true
             	};
            
            // ------------------------------ PRIVATE METHODS
            
            // draw legend method, in the upper left hand corner
            function drawLegend() {
                $("#" + elementID).append("<div id=\"legend\" style=\"position:absolute; top:15px; left:15px; z-index:1001; height:280px; width:78px;\"></div>");
                $("#legend").append("<div id=\"up\" style=\"position: absolute; top:0px; left:24px;\"><img src=" + defaults.up_image + " border=\"0\" alt=\"up\" /></div>");
                $("#legend").append("<div id=\"left\" style=\"position: absolute; top:24px; left:0px;\"><img src=" + defaults.left_image + " border=\"0\" alt=\"left\" /></div>");
                $("#legend").append("<div id=\"center\" style=\"position: absolute; top:24px; left:24px;\"><img src=" + defaults.center_image + " border=\"0\" alt=\"center\" /></div>");
                $("#legend").append("<div id=\"right\" style=\"position: absolute; top:24px; left:48px;\"><img src=" + defaults.right_image + " border=\"0\" alt=\"right\" /></div>");
                $("#legend").append("<div id=\"down\" style=\"position: absolute; top:48px; left:24px;\"><img src=" + defaults.down_image + " border=\"0\" alt=\"down\" /></div>");
                $("#legend").append("<div id=\"plus\" style=\"position: absolute; top:72px; left:24px;\"><img src=" + defaults.plus_image + " border=\"0\" alt=\"plus\" /></div>");
                //$("#legend").append("<div id=\"track\" style=\"position: absolute; top:96px; left:24px;\"><img src=" + defaults.track_image + " border=\"0\" alt=\"track\" /></div>");
                $("#legend").append("<div id=\"minus\" style=\"position: absolute; top:96px; left:24px;\"><img src=" + defaults.minus_image + " border=\"0\" alt=\"minus\" /></div>");
                
                $("#up").bind("click", function(e) {
                  var next = ( $("#map_image").position().top + defaults.distance ) + offsetX;
                  var bounds = 0;
                  $("#map_image").animate({ 
                    top: next >= bounds ? bounds : next,
                  }, defaults.speed);
                });
                
                $("#down").bind("click", function(e) {
                  var next = ($("#map_image").position().top - defaults.distance) - offsetX;
                  var bounds = ($("#map_image").height() - $("#map_image").parent().height()) * -1;
                  $("#map_image").animate({ 
                    top: next >= bounds ? next : bounds,
                  }, defaults.speed);
                });
                
                $("#left").bind("click", function(e) {
                  var next = ($("#map_image").position().left + defaults.distance) + offsetY;
                  var bounds = 0;
                  $("#map_image").animate({ 
                    left: next <= bounds ? next : bounds,
                  }, defaults.speed);
                });
                
                $("#right").bind("click", function(e) {
                  var next = ($("#map_image").position().left - defaults.distance) - offsetX;
                  var bounds = ($("#map_image").width() - $("#map_image").parent().width()) * -1;
                  $("#map_image").animate({ 
                    left: next >= bounds ? next : bounds,
                  }, defaults.speed);
                });
                
                $("#center").bind("click", function(e) {
                  var leftOffset = (defaults.coordinates[0] > $("#map_image").parent().width() / 2) ? -1 : 1;
                  var topOffset = (defaults.coordinates[1] >= $("#map_image").parent().height() / 2) ? -1 : 1;
                  $("#map_image").animate({ 
                    left: (defaults.coordinates[0] - $("#map_image").parent().width() / 2) * leftOffset,
                    top: (defaults.coordinates[1] - $("#map_image").parent().height() / 2) * topOffset,
                  }, defaults.speed);
                });
                
                $("#plus").bind("click", function(e) {
                  if (defaults.zoom < defaults.zoom_levels) {
                    defaults.zoom++;
                    zoom();  
                  }
                });
                
                $("#minus").bind("click", function(e) {
                  if (defaults.zoom > 1) {
                    defaults.zoom--;
                    zoom();
                  }
                });
            };
            
            // draw map, adding image to the current DOM element
            function drawMap() {
              var default_image = defaults.map_image.substring(0, defaults.map_image.indexOf('.')) + '_' + defaults.zoom + defaults.map_image.substring(defaults.map_image.indexOf('.'));
              var width = defaults.zoom_sizes[defaults.zoom - 1][0];
              var height = defaults.zoom_sizes[defaults.zoom - 1][1];
              $("#" + elementID).append("<div id=\"map_image\"><img src=\"" + default_image + "\" border=\"0\" width=\"" + width + "\" height=\"" + height + "\" alt=\"map\"/></div>");
              // define width and height of element
              $("#map_image").width($("#map_image img").width());
              $("#map_image").height($("#map_image img").height());
              // draw a container to help with dragging bounds
              drawContainer();
              $("#map_image").draggable({
                zIndex: 	1000,
              	ghosting:	false,
              	opacity: 	1,
              	cursor: 'hand',
              	containment: $("#map_container")
              });
            };
            
            // draw a container element that will define the draggable bounds area
            function drawContainer() {
              $("#" + elementID).before("<div id=\"map_container\"></div>");
              
              // calculate width and height for container
              $("#map_container").width( $("#map_image").width() > $("#" + elementID).width() ? $("#map_image").width() + ($("#map_image").width() - $("#" + elementID).width()) : $("#" + elementID).width() );
              $("#map_container").height( $("#map_image").height() > $("#" + elementID).height() ? $("#map_image").height() + ($("#map_image").height() - $("#" + elementID).height()) : $("#" + elementID).height() );
              
              // calculate position for container, used to restrict drag of #map_image
              var left = $("#" + elementID).position().left - (($("#map_container").width() - $("#" + elementID).width())/2);
              var top = $("#" + elementID).position().top - (($("#map_container").height() - $("#" + elementID).height())/2);
              $("#map_container").css({'position' : 'absolute'});
              $("#map_container").css({'left' : left});
              $("#map_container").css({'top' : top});
              
              // resize contaier so image can't be dragged past x=0
              $("#map_container").width( $("#map_image").width() );
            }
            
            // define the offset (x and y) of the element being mapified
            function defineOffset () {
              // define the offset of the "map" element in the window
              offsetX = $("#" + elementID).position().top;
              offsetY = $("#" + elementID).position().left;
            }
            
            // load new image to mimic zoom
            function  zoom() {
              // load a new image
              $("#map_image").remove();
              $("#map_container").remove();
              drawMap();
              
              // disable buttons depending on zoom number
              if(defaults.zoom == 1) {
                $("#minus").animate({ 
                  opacity: 0.5,
                }, defaults.speed);
              } else {
                $("#minus").animate({ 
                  opacity: 1,
                }, defaults.speed);
              }
              
              if(defaults.zoom == defaults.zoom_levels) {
                $("#plus").animate({ 
                  opacity: 0.5,
                }, defaults.speed);
              } else {
                $("#plus").animate({ 
                  opacity: 1,
                }, defaults.speed);
              }

            }
            
            // debug method, utilizing console or alerts
            function debug(s) {
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
              return this.each(function() {
                drawLegend();
                drawMap();
                defineOffset();
 			        });
 			      } // end init
             
        } // end mapify

    }); // end extend
    
  // extend plugin scope
	$.fn.extend({
    mapify: $.mapify.init
	});
  
})(jQuery); // return jquery object