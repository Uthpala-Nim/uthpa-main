(function ($) {
	
	"use strict";

	// Page loading animation
	$(window).on('load', function() {

        $('#js-preloader').addClass('loaded');

    });


	$(window).scroll(function() {
	  var scroll = $(window).scrollTop();
	  var box = $('.header-text').height();
	  var header = $('header').height();

	  if (scroll >= box - header) {
	    $("header").addClass("background-header");
	  } else {
	    $("header").removeClass("background-header");
	  }
	})

	var width = $(window).width();
		$(window).resize(function() {
		if (width > 767 && $(window).width() < 767) {
			location.reload();
		}
		else if (width < 767 && $(window).width() > 767) {
			location.reload();
		}
	})

	const elem = document.querySelector('.trending-box');
	const filtersElem = document.querySelector('.trending-filter');
	if (elem) {
		const rdn_events_list = new Isotope(elem, {
			itemSelector: '.trending-items',
			layoutMode: 'masonry'
		});
		if (filtersElem) {
			filtersElem.addEventListener('click', function(event) {
				if (!matchesSelector(event.target, 'a')) {
					return;
				}
				const filterValue = event.target.getAttribute('data-filter');
				rdn_events_list.arrange({
					filter: filterValue
				});
				filtersElem.querySelector('.is_active').classList.remove('is_active');
				event.target.classList.add('is_active');
				event.preventDefault();
			});
		}
	}


	// Menu Dropdown Toggle
	if($('.menu-trigger').length){
		$(".menu-trigger").on('click', function() {	
			$(this).toggleClass('active');
			$('.header-area .nav').slideToggle(200);
		});
	}


	// Menu elevator animation
	$('.scroll-to-section a[href*=\\#]:not([href=\\#])').on('click', function() {
		if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
			var target = $(this.hash);
			target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
			if (target.length) {
				var width = $(window).width();
				if(width < 991) {
					$('.menu-trigger').removeClass('active');
					$('.header-area .nav').slideUp(200);	
				}				
				$('html,body').animate({
					scrollTop: (target.offset().top) - 80
				}, 700);
				return false;
			}
		}
	});


	// Page loading animation
	$(window).on('load', function() {
		if($('.cover').length){
			$('.cover').parallax({
				imageSrc: $('.cover').data('image'),
				zIndex: '1'
			});
		}

		$("#preloader").animate({
			'opacity': '0'
		}, 600, function(){
			setTimeout(function(){
				$("#preloader").css("visibility", "hidden").fadeOut();
			}, 300);
		});
	});
    
    // API Testing and Demo Functions
    $(document).ready(function() {
        console.log('Frontend loaded, testing API connections...');
        
        // Test API connections
        testAPIConnections();
        
        // Add some sample data if needed
        setTimeout(addSampleGames, 2000);
    });
    
    async function testAPIConnections() {
        console.log('Testing API connections...');
        
        // Test Analytics Service
        try {
            const analyticsResponse = await fetch(`${CONFIG.ANALYTICS_SERVICE_URL}/health`);
            console.log('Analytics Service:', analyticsResponse.ok ? 'Connected' : 'Failed');
        } catch (error) {
            console.error('Analytics Service connection failed:', error);
        }
        
        // Test Game Service
        try {
            const gameResponse = await fetch(`${CONFIG.GAME_SERVICE_URL}/health`);
            console.log('Game Service:', gameResponse.ok ? 'Connected' : 'Failed');
        } catch (error) {
            console.error('Game Service connection failed:', error);
        }
        
        // Test Order Service
        try {
            const orderResponse = await fetch(`${CONFIG.ORDER_SERVICE_URL}/health`);
            console.log('Order Service:', orderResponse.ok ? 'Connected' : 'Failed');
        } catch (error) {
            console.error('Order Service connection failed:', error);
        }
    }
    
    async function addSampleGames() {
        console.log('Adding sample games...');
        
        const sampleGames = [
            { name: "Cyberpunk Adventure", category: "RPG", released_at: "2024-01-15", price: 49.99 },
            { name: "Space Warrior", category: "Action", released_at: "2024-02-10", price: 39.99 },
            { name: "Mystery Detective", category: "Adventure", released_at: "2024-03-05", price: 29.99 }
        ];
        
        for (const game of sampleGames) {
            try {
                const result = await createGame(game);
                if (result) {
                    console.log('Created game:', result);
                }
            } catch (error) {
                console.error('Error creating game:', error);
            }
        }
        
        // Get and display all games
        try {
            const games = await getGames();
            console.log('All games:', games);
        } catch (error) {
            console.error('Error fetching games:', error);
        }
    }


})(window.jQuery);