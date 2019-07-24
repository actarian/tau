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
  DOC READY
-------------------------------------------------- */
$(function () {
    backToTop();
});