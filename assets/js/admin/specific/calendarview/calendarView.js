( function( $ ){
	var eventRenderer = function( event, element ) {
		if ( typeof event.htmlTitle !== "undefined" && event.htmlTitle.length ) {
			element.find( ".fc-title" ).html( $( "<span>" + event.htmlTitle + "</span>" ) );
		}
	};

	$( '.calendar-view' ).each( function(){
		var $calendarView = $( this )
		  , sourceUrl      = $calendarView.data( "sourceUrl" )
		  , aspectRatio    = $calendarView.data( "aspectRatio" ) || 2
		  , config         = cfrequest.config        || {}
		  , $container     = $calendarView.closest( ".calendar-view-container" )
		  , $favouritesDiv = $container.find( ".calendar-view-favourites" )
		  , fetchEvents, getAdditionalDataForAjaxFetch, getFavourites;

		fetchEvents = function( start, end, timezone, callback ){
			var data = $.extend( {}, { start:start.format(), end:end.format() }, getAdditionalDataForAjaxFetch() );

			$.ajax( sourceUrl, {
				  method  : "post"
				, data    : data
				, success : function( data ) { callback( data ) }
			} );
		};

		getAdditionalDataForAjaxFetch = function(){
			var additionalData = {}
			  , favourites = getFavourites();

			if ( favourites && favourites.length ) {
				additionalData.savedFilters = favourites;
			}

			return additionalData;
		};

		getFavourites = function() {
			if ( $favouritesDiv.length ) {
				var favourites = [];

				$favouritesDiv.find( ".filter.active" ).each( function(){
					favourites.push( $( this ).data( "filterId" ) );
				} );

				return favourites.join( "," );
			}

			return "";
		};

		if ( $favouritesDiv.length ) {
			$favouritesDiv.on( "click", ".filter", function( e ){
				e.preventDefault();

				var $filter = $( this )
				  , $otherFilters = $filter.siblings( ".filter" );

				$filter.toggleClass( "active" ).find( ":focus" ).blur();

				$calendarView.fullCalendar( "refetchEvents" );
			} );
		}

		config.events      = fetchEvents;
		config.eventRender = eventRenderer;
		config.aspectRatio = aspectRatio;

		if ( typeof config.views !== "undefined"
			&& typeof config.views.month !== "undefined"
			&& typeof config.views.month.columnHeaderFormat !== "undefined"
			&& config.views.month.columnHeaderFormat == 'ddd' ) {
			config.views.month.columnHeaderText = function(mom) {
				return mom._locale.__proto__._weekdaysShort[ ( mom.weekday() + ( config.firstDay||0 ) ) % 7 ];
			}
		}

		$calendarView.fullCalendar(config);
	} );
} )( presideJQuery );