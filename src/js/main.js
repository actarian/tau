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


    btn.click(function (ev) {
        ev.preventDefault();
        $('html, body').stop().animate({ scrollTop: 0 }, 600);
    });

    //$(window).on('scroll', _.throttle(checkCondition, 700));
}

/* --------------------------------------------------
  Full Search
-------------------------------------------------- */
function fullSearch() {
    //Search Full
    $('.main-search').on('click', function(e){
        $('.section--search').toggleClass('show');
        e.preventDefault();
    });
    //Close Search
    $('.close-search').on('click', function(e){
        $('.section--search').removeClass('show');
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
  Mobile Menu
-------------------------------------------------- */
function mobileMenu() {
    //Search Full
    $('.hamburger').on('click', function(e){
        $('.mobile-menu').toggleClass('show');
        $(this).toggleClass('active');
        e.preventDefault();
    });
}

/* --------------------------------------------------
  DOC READY
-------------------------------------------------- */
$(function () {
    backToTop();
    fullSearch();
    slideProdHome();
    slideTestimonialHome();
    slideProdCorrelati();
    slideProdAbbinamento();
    mobileMenu();
});