jQuery(document).ready(function($){
    $('.movie-stills-slider').slick({
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        centerMode: true, // Enable center mode to show the edge of the next slide
        centerPadding: '15%', // Adjust the padding to control how much of the next slide is visible
        autoplay: true,
        autoplaySpeed: 2000,
        prevArrow: '<button type="button" class="slick-prev"></button>',
        nextArrow: '<button type="button" class="slick-next"></button>',
    });
});
