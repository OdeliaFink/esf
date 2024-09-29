jQuery(document).ready(function($) {
  $('.accordion-header').on('click', function() {
      $(this).toggleClass('active').next('.accordion-content').slideToggle();
      $(this).find('.accordion-icon').toggleClass('rotated');
  });

  gsap.registerPlugin(ScrollTrigger);
  let revealAnimations = [];

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
  console.log("SLUT");

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
  console.log("SLUT");
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
});
