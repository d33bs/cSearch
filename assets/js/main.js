head.ready(function(){
var cSearch = Backbone.View.extend({
	el : "#solutionview",
	initialize : function(){
		$("#sq").focus();
		this.resize();
		$(window).on("resize",this.resize);
                //site listing options
		this.sites = {
			"DuckDuckGo" : "http://duckduckgo.com/?q=",
    			"Ask.com" : "http://www.ask.com/web?q=",
    			"Lycos" : "http://search.lycos.com/web/?q=",
    			"Bing Search" : "http://www.bing.com/search?q=",
    			"Yahoo Search" : "http://search.yahoo.com/bin/search?p=",
    			"Yandex" : "http://www.yandex.com/search/?text="
		};
		this.settings_open = false;
		this.info_open = false;
		this.quad = {
			"1" : "DuckDuckGo",
    			"2" : "Ask.com",
    			"3" : "Lycos",
    			"4" : "Bing Search"
		};
		this.quad_defaults = $.extend({},this.quad);
		if(!!window.localStorage){
			if(localStorage.getItem("search") == null){
				localStorage.setItem("search",JSON.stringify(this.quad));
			}else if(localStorage.getItem("search") !== null){
				this.quad = JSON.parse(localStorage.getItem("search"));
			}
		}else{
			//no localstorage
		}
		this.set_selects();
	},
    	events : {
		"keydown #sq" : "search",
    		"mouseover #topwrap span" : "hover_in_settings",
		"mouseout #topwrap span" : "hover_out_settings",
		"click #settings_click" : "open_settings",
		"click #info_click" : "open_info",
		"click #settings .box_close" : "close_settings",
		"click #info .box_close" : "close_info",
		"change .quad select" : "quad_change",
		"click #defaults" : "set_defaults",
		"click .window_control .icon-resize-full" : "maximize",
		"click .window_control .icon-resize-small" : "minimize",
		"mouseover .quadrant" : "hover_in_quad",
		"mouseout .quadrant" : "hover_out_quad",
    "click #sq" : "focus_sq",
			
	},
        //set the quadrants to their default sites
	set_defaults : function(e){
		this.quad = $.extend({},this.quad_defaults);
		localStorage.setItem("search",JSON.stringify(this.quad));
		this.set_selects();
	},
        //change the quandrant search site
	quad_change : function(e){
		this.quad[$(e.currentTarget).parent().attr("id").replace("s","")] = $(e.currentTarget).val();
		localStorage.setItem("search",JSON.stringify(this.quad));
	},
        //open settings window
	open_settings : function(e){
		if(!this.settings_open){
			this.close_info();
			$("#settings").show();
			this.settings_open = true;
		}else{
			this.close_settings();
		}
	},
        //open info window
	open_info : function(e){
		if(!this.info_open){
			this.close_settings();
			$("#info").show();
			this.info_open = true;
		}else{
			this.close_info();
		}
	},
        //close settings window
	close_settings : function(e){
		$("#settings").hide();
		this.settings_open = false;
	},
        //close info window
	close_info : function(e){
		$("#info").hide();
		this.info_open = false;
	},
        //hover over settings button
    	hover_in_settings : function(e){
		$(e.currentTarget).stop();
		$(e.currentTarget).animate({color:"#eee"},"fast");	
	},
        //hover outside settings button
    	hover_out_settings : function(e){
		$(e.currentTarget).stop();
		$(e.currentTarget).animate({color:"#aaa"},"fast");		
	},
        //resize the display wrapper to correct proportions
    	resize : function(){
		$("#displaywrap").css({"height":$("html").height()-(45)});
	},
        //on pressing enter perform the search query
	search : function(e){
		if(e.keyCode === 13){
			this.clear();
			var sq = $(e.currentTarget).val();
			var mod_sq = sq.replace(/ /g,"+");
			var view = this;
			$.each(view.quad,function(i,x){
				view.ex_search(i,view.sites[x]+mod_sq);
			});
		}
	},
        //clear the quadrant results to prepare for new content
	clear : function(){
		$.each($(".quadrant"),function(i,x){
			if($(this).children("i").length<=0){
				$(this).append("<i class=\"icon-spinner icon-spin spinner\"></i>");
			}
			if($(this).children(".window_control").length<=0){
				$(this).append("<span class=\"window_control\"><i class=\"icon-resize-full\"></i></span>");
			}				
		});
	},
        //load the src for the quadrant
	ex_search : function(type,url){
		$("#m"+type).attr("src",url);
		$("#m"+type).load(function(){
			$(this).parent().children("i").remove();
		});
	},
        //set the current settings quadrant select boxes
	set_selects : function(){
		$("#settings .quad select").html("");
		var view = this;
		$.each($("#settings .quad select"),function(i,x){
			$.each(view.sites,function(b,y){
				if(view.quad[i+1] === b){
					$(x).append("<option value=\""+b+"\" selected=\"selected\">"+b+"</option>");
				}else{
					$(x).append("<option value=\""+b+"\">"+b+"</option>");
				}
			});
		});
	},
        //maximize a quadrant
	maximize: function(e){
		$(".quadrant").css({"width":"0","height":"0","display":"none"});		
		$(e.currentTarget).parent().parent().css({"width":"100%","height":"100%","display":"block"});
		$(e.currentTarget).parent().html("<i class=\"icon-resize-small\"></i>");
	},
        //minimize a quadrant
	minimize : function(e){
		$(".quadrant").css({"width":"50%","height":"50%","display":"block"});
		$(e.currentTarget).parent().css("display","none");
		$(e.currentTarget).parent().html("<i class=\"icon-resize-full\"></i>");
	},
        //hover inside a quadrant
	hover_in_quad : function(e){
		$(e.currentTarget).children(".window_control").css("display","block");
	},
        //hover outside a quadrant
	hover_out_quad : function(e){
		$(e.currentTarget).children(".window_control").css("display","none");
	},
        //focus in the top search query box and highlight the query
	focus_sq : function(e){
    $(e.currentTarget).select();
	}
});
var csearch = csearch || {
	init: function(){
		this.csearch = new cSearch();
  	}
};
//site initialization
csearch.init();
Backbone.history.start();
//head.js end 
});
head.js(
{jquery: "assets/js/lib/jquery.min.js"},
{jqueryui: "assets/js/lib/jquery.ui.min.js"},
{underscore: "assets/js/lib/underscore.min.js"},
{backbone: "assets/js/lib/backbone.min.js"},
{bbls: "assets/js/lib/backbone.localstorage.min.js"},
{json: "assets/js/lib/json2.js"}
);
