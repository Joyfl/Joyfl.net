// Constants
LOGO_HEIGHT = 150;
MENU_HEIGHT = 98;
SECTION_OFFSET = 116;
DIVIDER_HEIGHT = 96;
DIVIDER_OFFSET = MENU_HEIGHT - DIVIDER_HEIGHT / 2 + SECTION_OFFSET;
DIVIDER_DETECTOR = DIVIDER_OFFSET - SECTION_OFFSET;

// Variables
scrollFlag = false;
sectionFlag = [false, false, false];
sections = [];

// Initializer
$(window).load(function(){
	initSection();
	initMap();
	setEvents();
	$(this).scroll(); // For FireFox
});


// Functions

function initSection()
{
	sections = [];
	var sectionNames = ["product", "team", "contact"];
	for(var i in sectionNames)
	{
		var name = sectionNames[i];
		var section = {};
		section["name"] = name;
		section["offset"] = $("#%s".$(name)).position().top;
		sections.push(section);
	}
}

function initMap()
{
	var position = new daum.maps.LatLng(37.488189, 126.906434);
	var map = new daum.maps.Map($("#contact-map")[0], { center: position, level: 4 });
	var zoomControl = new daum.maps.ZoomControl();
	var mapTypeControl = new daum.maps.MapTypeControl();
	var marker = new daum.maps.Marker({ position: position });
	map.addControl(zoomControl, daum.maps.ControlPosition.RIGHT);
	map.addControl(mapTypeControl, daum.maps.ControlPosition.TOPRIGHT);
	marker.setMap(map);
}

function scrollTo(target)
{
	var offset = $("#%s".$(target)).position().top - DIVIDER_DETECTOR + 1;
	if(target == "about") offset = LOGO_HEIGHT;
	$("html, body").animate({ scrollTop: offset }, 400);
}

function setEvents()
{
	// Window Resize Event
	$(window).resize(function(){ initSection(); });

	// Menu Click Event
	$(".menu").click(function(){ scrollTo($(this).attr("alt")); });

	// Menu Hover Event
	$(".menu").mouseenter(function(){ $(this).attr("src", "/images/text/%s_selected.png".$($(this).attr("alt"))); });
	$(".menu").mouseleave(function(){ $(this).attr("src", "/images/text/%s.png".$($(this).attr("alt"))); });
	
	// Team Hover Event
	$(".detector").circlemouse({
		onMouseEnter: function(event){ $("#bubble-%s".$(event.attr("member"))).show(); },
		onMouseLeave: function(event){ $("#bubble-%s".$(event.attr("member"))).hide(); }
	});
	
	// Header Scroll Event
	$(window).scroll(function(){
		var scrollTop = $(this).scrollTop();
		var scrollLeft = $(this).scrollLeft();
		if(scrollFlag && scrollTop <= LOGO_HEIGHT)
		{
			$("#header").css({ position: "absolute", top: "0", left: "0" });
			$("#divider-about").css({ position: "absolute", top: "auto" });
			scrollFlag = false;
		}
		else if(!scrollFlag && scrollTop > LOGO_HEIGHT)
		{
			$("#header").css({ position: "fixed", top: "-%dpx".$(LOGO_HEIGHT) });
			$("#divider-about").css({ position: "fixed", top: "%dpx".$(DIVIDER_OFFSET) });
			scrollFlag = true;
		}
		if(scrollTop > LOGO_HEIGHT)
		{
			$("#header").css("left", "-%dpx".$(scrollLeft));
			$("#divider-about").css("left", "-%dpx".$(scrollLeft));
		}
		for(var i in sections)
		{
			var name = sections[i].name;
			var offset = sections[i].offset;
			var divider = $("#divider-%s".$(name));
			var section = $("#%s".$(name));
			if(sectionFlag[i] && scrollTop <= offset - DIVIDER_DETECTOR)
			{
				divider.css({ position: "absolute", top: "auto", left: "0"});
				sectionFlag[i] = false;
			}
			else if(!sectionFlag[i] && scrollTop > offset - DIVIDER_DETECTOR)
			{
				divider.css({ position: "fixed", top: "%dpx".$(DIVIDER_OFFSET) });
				sectionFlag[i] = true;
			}
			if(scrollTop > offset - DIVIDER_DETECTOR) divider.css("left", "-%dpx".$(scrollLeft));
		}
	});
}
