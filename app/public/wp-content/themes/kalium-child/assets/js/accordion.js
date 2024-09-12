jQuery(document).ready(function($) {
  $('.accordion-header').on('click', function() {
      $(this).toggleClass('active').next('.accordion-content').slideToggle();
      $(this).find('.accordion-icon').toggleClass('rotated');
  });

  gsap.registerPlugin(ScrollTrigger);
  let revealAnimations = [];
  
  // Scroll
  // const lenis = new Lenis({
  //   lerp: 0.07
  // });
  
  // lenis.on('scroll', ScrollTrigger.update)
  // gsap.ticker.add((time)=>{
  //   lenis.raf(time * 3000)
  // })
  
  // Reveal
  // document.querySelectorAll('.reveal').forEach(text => {
  //   // Split text
  //   let splitText = new SplitType(text, {
  //     type: 'words'
  //   })
  
  //   // Animation
  //   const section = text.closest('section');
  //   // console.log('SECTION', section)
  //   gsap.from(splitText.words, {
  //     opacity: 0,
  //     x: -100,
  //     ease: 'none',
  //     stagger: 1,
  //     duration: 5,
  //     scrollTrigger: {
  //       trigger: section,
  //       start: 'top-=22 top',
  //       // end: 'center top',
  //       // pinSpacing: false, 
  //       scrub: true,
  //       markers: true,
  //       pin: true,
  //     }
  //   })
  // })

  // Scroll
const lenis = new Lenis({
  lerp: 0.07
});

lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add((time)=>{
  lenis.raf(time * 1000)
})

// Reveal
document.querySelectorAll('.reveal').forEach(text => {
  // Split text
  let splitText = new SplitType(text, {
    type: 'words'
  })

  // Animation
  const section = text.closest('section');
  gsap.from(splitText.words, {
    opacity: 0.1,
    ease: 'none',
    stagger: 1,
    duration: 5,
    scrollTrigger: {
      trigger: section,
      start: 'top-=180 top', 
      // start: 'top-=280 top', 
      end: () => `+=${window.innerHeight / 3}px`,
      scrub: true,
      markers: false,
      pin: true,
    }
  })
})

document.addEventListener("DOMContentLoaded", function() {
  // Get the current lang parameter from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const lang = urlParams.get('lang');

  // If a lang parameter exists, append it to all internal links
  if (lang) {
      const internalLinks = document.querySelectorAll('a[href^="/"], a[href^="./"], a[href^="../"]');
      internalLinks.forEach(function(link) {
          const url = new URL(link.href, window.location.origin);
          url.searchParams.set('lang', lang);
          link.href = url.href;
      });
  }
});






  // $('.movie-stills-slider').slick({
  //   autoplay: false,
  //   autoplaySpeed: 4000,
  //   arrows: false, 
  //   prevArrow: true,
  //   nextArrow: true,
  //   // 3 seconds between slides
  //   // other Slick settings
  // });
  
  // // Pausing on hover
  // $('.movie-stills-slider').on('mouseenter', function() {
  //   $(this).slick('slickPause');
  // }).on('mouseleave', function() {
  //   $(this).slick('slickPlay');
  // });

  document.addEventListener('DOMContentLoaded', function() {
    var scrollSections = document.querySelectorAll('.scrollable-content');
    
    scrollSections.forEach(section => {
        section.addEventListener('click', function() {
            // Toggle scrolling animation
            var scrollElement = section.querySelector('.auto-scroll');
            if (scrollElement.style.animationPlayState === 'running') {
                scrollElement.style.animationPlayState = 'paused';
            } else {
                scrollElement.style.animationPlayState = 'running';
            }
        });
    });
});
  

  
  
//   (function($) {
//     $(document).ready(function() {
//         // Regular expression to match words in all caps
//         var capsRegex = /\b[A-Z]{2,}\b/g;

//         // Iterate over each film item in the accordion
//         $('.accordion-item').each(function() {
//             var content = $(this).html();
//             // Replace all caps words with wrapped span including custom class
//             var updatedContent = content.replace(capsRegex, function(match) {
//                 return '<span class="all-caps">' + match + '</span>';
//             });
//             // Update the content
//             $(this).html(updatedContent);
//         });
//     });
// })(jQuery)




  
});
