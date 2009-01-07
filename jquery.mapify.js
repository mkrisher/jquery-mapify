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
 * TODO: refactor add zoom_levels, make dynamic based on image_sizes count
 * TODO: enable zoom scale (track)
 * TODO: refactor zoom property to start at 0
 */
/**
 *
 * @description Create a map object similar to Google Maps UI with custom imagery
 * 
 * @example $("#map").mapify();
 * 
 * @param Object obj          An object literal containing key/value pairs to overwrite default settings.
 * 
 * @option String map_image 	A string of the base naming convention for the map image(s). 
 * 												    Default value: "map.gif"
 * 
 * @option String up_image 	  A string of the image path for the up button image. 
 * 												    Default value: "up.gif"
 * 
 * @option String right_image A string of the image path for the right button image. 
 * 												    Default value: "right.gif"
 *
 * @option String down_image 	A string of the image path for the down button image. 
 * 												    Default value: "down.gif"
 *
 * @option String left_image 	A string of the image path for the left button image. 
 * 												    Default value: "left.gif"
 *
 * @option String center_image A string of the image path for the center button image. 
 * 												    Default value: "center.gif"
 *
 * @option String plus_image 	A string of the image path for the plus button image. 
 * 												    Default value: "plus.gif"
 *
 * @option String minus_image A string of the image path for the minus button image. 
 * 												    Default value: "minus.gif"
 *
 * @option String track_image A string of the image path for the track button image (zoom scale). 
 * 												    Default value: "track.gif"
 *
 * @option String slider_image A string of the image path for the slider button image (zoom handle). 
 * 												    Default value: "slider.gif"
 *
 * @option Number zoom 		    An integer representing the image in the images array to start with (starts at 1). 
 * 												    Default value: 1
 *
 * @option Array zoom_sizes 	An array of the resolutions of the various map images. 
 * 												    Default value: [[800,600], [1600,1200], [3200,2400]]
 *
 * @option Array coordinates  An array containing the x and y position of the map to initially center on.
 * 												    Default value: [200,200]
 *
 * @option Integer distance 	An integer of the pixels the map should move when directional button is clicked. 
 * 												    Default value: 256
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
            var name = "mapify", obj = this, preZoomLeft = null, preZoomTop = null, preZoomZoomLevel = null,
            
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
              coordinates:    [200,200],
              distance:       256,
              speed:          100,
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
                  $("#map_image").animate({ 
                    top: next >= getBounds()[1] ? next : getBounds()[1],
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
                  $("#map_image").animate({ 
                    left: next >= getBounds()[0] ? next : getBounds()[0],
                  }, defaults.speed);
                });
                
                $("#center").bind("click", function(e) {
                  var leftOffset = (getCoordinates()[0] > $("#map_image").parent().width() / 2) ? -1 : 1;
                  var topOffset = (getCoordinates()[1] >= $("#map_image").parent().height() / 2) ? -1 : 1;
                  var left = (getCoordinates()[0] - $("#map_image").parent().width() / 2) * leftOffset;
                  var top = (getCoordinates()[1] - $("#map_image").parent().height() / 2) * topOffset;
                  $("#map_image").animate({ 
                    left: left >= getBounds()[0] ? left : getBounds()[0],
                    top: top >= getBounds()[1] ? top : getBounds()[1],
                  }, defaults.speed);
                });
                
                $("#plus").bind("click", function(e) {
                  if (defaults.zoom < defaults.zoom_levels) {
                    setCoordinates();
                    defaults.zoom++;
                    zoom();  
                  }
                });
                
                $("#minus").bind("click", function(e) {
                  if (defaults.zoom > 1) {
                    setCoordinates();
                    defaults.zoom--;
                    zoom();
                  }
                });
            };
            
            // draw map, adding image to the current DOM element
            function drawMap() {
              // remove any previous image
              $("#map_image").remove();
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
              
              // center on the passed coordinates
              $("#center").click();
            };
            
            // draw a container element that will define the draggable bounds area
            function drawContainer() {
              // remove any previous container
              $("#map_container").remove();
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

            // define the pre-zoom coordinates
            function setCoordinates() {
              // get current coordinates
              preZoomLeft = ($("#map_image").position().left * -1) + ($("#" + elementID).width()/2);
              preZoomTop = ($("#map_image").position().top * -1) + ($("#" + elementID).height()/2);
              preZoomZoomLevel = defaults.zoom;
            }
            
            // convert coordinates post zoom
            function getCoordinates() {
              if (preZoomLeft != null) {
                var widthDiff = defaults.zoom_sizes[defaults.zoom - 1][0] / defaults.zoom_sizes[preZoomZoomLevel - 1][0];
                var heightDiff = defaults.zoom_sizes[defaults.zoom - 1][1] / defaults.zoom_sizes[preZoomZoomLevel - 1][1];
                var postZoomLeft = preZoomLeft * widthDiff;
                var postZoomTop = preZoomTop * heightDiff;
                defaults.coordinates = [postZoomLeft, postZoomTop];
              }
              return defaults.coordinates;
            }
            
            // get the left and top bounds, when moving and centering
            function getBounds() {
              var left = ($("#map_image").width() - $("#map_image").parent().width()) * -1;
              var top = ($("#map_image").height() - $("#map_image").parent().height()) * -1;
              return [left, top];
            }
            
            // redraw the map using the new zoom level, manage zoom buttons
            function zoom() {
              // redraw the map with a new image, using the new zoom settings
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
            
            // define the offset (x and y) of the element being mapified, so we can offset the image of the map to match the edges
            function setOffset () {
              // define the offset of the "map" element in the window
              offsetX = $("#" + elementID).position().top;
              offsetY = $("#" + elementID).position().left;
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
                setOffset();
 			        });
 			      }
             
        } // end mapify

    }); // end extend
    
  // extend plugin scope
	$.fn.extend({
    mapify: $.mapify.init
	});
  
})(jQuery); // return jquery object