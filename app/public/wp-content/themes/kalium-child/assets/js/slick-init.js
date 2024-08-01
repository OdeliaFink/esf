jQuery(document).ready(function($){
  $('.award-carousel').slick({
      autoplay: true,      // Enable autoplay
      autoplaySpeed: 3000, // 3 seconds per slide
      dots: true,          // Show navigation dots
      arrows: false,       // Hide navigation arrows
      infinite: true,      // Loop slides
      slidesToShow: 3,     // Number of slides to show
      slidesToScroll: 1,   // Number of slides to scroll at a time
      responsive: [
          {
              breakpoint: 768, // Tablet breakpoint
              settings: {
                  slidesToShow: 2,
              }
          },
          {
              breakpoint: 480, // Mobile breakpoint
              settings: {
                  slidesToShow: 1,
              }
          }
      ]
  });
});
