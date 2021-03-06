/* --------------------------------------------------
  BackToTop
-------------------------------------------------- */
function backToTop() {

	var btn = $('.back-to-top');

	// Nasconde il bottone se lo scroll è inferiore
	// all'altezza della finestra
	function checkCondition() {
		var winH = window.outerHeight,
			scrollTop = $(window).scrollTop();

		if (scrollTop > winH) {
			btn.fadeIn();
		} else {
			btn.fadeOut();
		}
	}

	btn.click(function(ev) {
		ev.preventDefault();
		$('html, body').stop().animate({ scrollTop: 0 }, 600);
	});

}

/* --------------------------------------------------
  Full Search
-------------------------------------------------- */
function fullSearch() {
	//Search Full
	$('.main-search').on('click', function(e) {
		$('.section--search').toggleClass('show');
		$('body').toggleClass('no-scroll');
		e.preventDefault();
	});
	//Close Search
	$('.close-search').on('click', function(e) {
		$('.section--search').removeClass('show');
		$('body').toggleClass('no-scroll');
		e.preventDefault();
	});
}

/* --------------------------------------------------
  Slide Prodotti Home
-------------------------------------------------- */
function slideProdHome() {
	$('.section--home-slide-prodotti .slide').slick({
		arrows: false,
		dots: true,
		slidesToShow: 1,
		slidesToScroll: 1,
		centerMode: true,
		focusOnSelect: true,
		responsive: [
			{
				breakpoint: 1441,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 1
				}
            },
			{
				breakpoint: 1025,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 2
				}
            },
			{
				breakpoint: 767,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1
				}
            }
        ]
	});
}

/* --------------------------------------------------
  Slide Testimonial Home
-------------------------------------------------- */
function slideTestimonialHome() {
	$('.section--home-testimonial .slide').slick({
		arrows: false,
		dots: true,
		slidesToShow: 1,
		slidesToScroll: 1,
		responsive: [
			{
				breakpoint: 767,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1
				}
        }
        ]
	});
}

/* --------------------------------------------------
  Slide Prodotti Correlati
-------------------------------------------------- */
function slideProdCorrelati() {
	$('.section--product-related .slide').slick({
		arrows: false,
		dots: true,
		slidesToShow: 1,
		slidesToScroll: 1,
		centerMode: true,
		focusOnSelect: true,
		responsive: [
			{
				breakpoint: 1441,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 1
				}
            },
			{
				breakpoint: 1025,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 2
				}
            },
			{
				breakpoint: 767,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1
				}
            }
        ]
	});
}

/* --------------------------------------------------
  Slide Prodotti Abbinamento
-------------------------------------------------- */
function slideProdAbbinamento() {
	$('.section--product-abbinamento .slide').slick({
		arrows: false,
		dots: true,
		slidesToShow: 1,
		slidesToScroll: 1,
		centerMode: true,
		focusOnSelect: true,
		responsive: [
			{
				breakpoint: 1441,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 1
				}
            },
			{
				breakpoint: 1025,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 2
				}
            },
			{
				breakpoint: 767,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1
				}
            }
        ]
	});
}

/* --------------------------------------------------
  Slide Info Listing Prodotto
-------------------------------------------------- */
function slideInfoListingProd() {
	$('.listing--info--slide').slick({
		arrows: false,
		dots: true,
		slidesToShow: 1,
		slidesToScroll: 1
	});
}

/* --------------------------------------------------
  Mobile Menu
-------------------------------------------------- */
function mobileMenu() {
	//Search Full
	$('.hamburger').on('click', function(e) {
		$('.mobile-menu').toggleClass('show');
		$(this).toggleClass('active');
		e.preventDefault();
		$('.navbar-toggler').toggleClass('collapsed');
	});
}

function jumpTo() {
	$("a.scrollLink").click(function(event) {
		event.preventDefault();
		$("html, body").animate({ scrollTop: $($(this).attr("href")).offset().top }, 500);
	});
}

/* --------------------------------------------------
  Color 44 gatti
-------------------------------------------------- */
function color44Gatti() {
	//Blu
	$('.color--blue2 .bullet').on('click', function(e) {
		$('.nav--colors').find('.color').removeClass('active');
		$(this).parent().toggleClass('active');
		$('.44-blu').fadeIn();
		$('.44-giallo').hide();
		$('.44-rosa').hide();
		$('.44-fucsia').hide();
	});
	//Fucsia
	$('.color--fucsia .bullet').on('click', function(e) {
		$('.nav--colors').find('.color').removeClass('active');
		$(this).parent().toggleClass('active');
		$('.44-blu').hide();
		$('.44-giallo').hide();
		$('.44-rosa').hide();
		$('.44-fucsia').fadeIn();
	});
	//Giallo
	$('.color--yellow .bullet').on('click', function(e) {
		$('.nav--colors').find('.color').removeClass('active');
		$(this).parent().toggleClass('active');
		$('.44-blu').hide();
		$('.44-fucsia').hide();
		$('.44-rosa').hide();
		$('.44-giallo').fadeIn();
	});
	//Rosa
	$('.color--pink .bullet').on('click', function(e) {
		$('.nav--colors').find('.color').removeClass('active');
		$(this).parent().toggleClass('active');
		$('.44-blu').hide();
		$('.44-fucsia').hide();
		$('.44-giallo').hide();
		$('.44-rosa').fadeIn();
	});
}

/* --------------------------------------------------
  Slide 44 Gatti
-------------------------------------------------- */
function slide44Gatti() {
	$('.slide-44-gatti').slick({
		arrows: false,
		dots: false,
		fade: true,
		autoplay: true,
		autoplaySpeed: 2000,
		slidesToShow: 1,
		slidesToScroll: 1
	});
}

/* --------------------------------------------------
  Personaggi Mobile
-------------------------------------------------- */
function personaggiMobile() {
	$('.personaggi-mobile').slick({
		arrows: false,
		dots: true,
		slidesToShow: 2,
		slidesToScroll: 1,
		responsive: [
			{
				breakpoint: 1399,
				settings: {
					slidesToShow: 3,
					slidesToScroll: 1
				}
            },
			{
				breakpoint: 1024,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 1
				}
            },
			{
				breakpoint: 767,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1
				}
            }
        ]
	});
}

/* --------------------------------------------------
  gattiProdHover
-------------------------------------------------- */
function gattiProdHover() {
	$('.milady').mouseover(function() {
		$('.viola .spazzolino').addClass('bounce');
		$('.viola .ombra').addClass('scale');
	});
	$('.milady').mouseleave(function() {
		$('.viola .spazzolino').removeClass('bounce');
		$('.viola .ombra').removeClass('scale');
	});
	$('.pilon').mouseover(function() {
		$('.rosa .spazzolino').addClass('bounce');
		$('.rosa .ombra').addClass('scale');
	});
	$('.pilon').mouseleave(function() {
		$('.rosa .spazzolino').removeClass('bounce');
		$('.rosa .ombra').removeClass('scale');
	});
	$('.lampo').mouseover(function() {
		$('.blu .spazzolino').addClass('bounce');
		$('.blu .ombra').addClass('scale');
	});
	$('.lampo').mouseleave(function() {
		$('.blu .spazzolino').removeClass('bounce');
		$('.blu .ombra').removeClass('scale');
	});
	$('.meatball').mouseover(function() {
		$('.giallo .spazzolino').addClass('bounce');
		$('.giallo .ombra').addClass('scale');
	});
	$('.meatball').mouseleave(function() {
		$('.giallo .spazzolino').removeClass('bounce');
		$('.giallo .ombra').removeClass('scale');
	});
}

/* --------------------------------------------------
  DOC READY
-------------------------------------------------- */
$(function() {
	backToTop();
	fullSearch();
	slideProdHome();
	slideTestimonialHome();
	slideProdCorrelati();
	slideProdAbbinamento();
	slideInfoListingProd();
	mobileMenu();
	color44Gatti();
	gattiProdHover();
	slide44Gatti();
	personaggiMobile();
});
