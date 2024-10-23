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
      end: () => `+=${window.innerHeight / 1.5}px`,
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

jQuery(document).ready(function($) {
  // Force reset the slider if it was already initialized
  if ($('.movie-stills-slider').hasClass('slick-initialized')) {
      $('.movie-stills-slider').slick('unslick'); // Reset existing slider
  }

  // Reinitialize the slider with autoplay disabled forcefully
  $('.movie-stills-slider').slick({
      autoplay: false,  // Disable autoplay globally
      autoplaySpeed: 99999, // Ensure it won't autoplay if somehow triggered
      slidesToShow: 3,  // Default number of slides to show
      slidesToScroll: 1,
      infinite: true,
      prevArrow: '<button type="button" class="slick-prev"></button>', // Remove text
      nextArrow: '<button type="button" class="slick-next"></button>',
      dots: true,       // Enable dots for navigation
      arrows: true,     // Enable navigation arrows
      speed: 500,       // Adjust speed for smoother experience
      pauseOnHover: false, // Make sure hover does not re-enable autoplay
      responsive: [
          {
              breakpoint: 1024, // Settings for tablets
              settings: {
                  autoplay: false, // Force autoplay off for tablet view
                  slidesToShow: 2, // Show 2 slides on tablets
                  slidesToScroll: 1,
                  infinite: true,
                  dots: true
              }
          },
          {
              breakpoint: 768, // Settings for mobile devices
              settings: {
                  autoplay: false, // Force autoplay off for mobile view
                  slidesToShow: 1, // Show 1 slide on mobile
                  slidesToScroll: 1,
                  arrows: true, // Disable arrows on mobile to save space
                  dots: true      // Keep dots for navigation
              }
          }
      ]
  });
});


// const portfolioPage = document.querySelectorAll(".portfolio-container-and-title");

// const portfolioItemsContainer = document.getElementById('portfolio_args['id']');
// const portfolioItems = Array.from(portfolioItemsContainer.querySelectorAll('.portfolio-item'));

// if(portfolioPage.length > 0) {
  
//   var filterButtons = document.querySelectorAll('.film-filters button');
//   console.log(filterButtons, 'filter buttons')
//     // Log the buttons found
//     console.log('Filter Buttons:', filterButtons);
  
//     // Add event listeners to the filter buttons
//     filterButtons.forEach(function (button) {
//       button.addEventListener('click', function () {
//         var filter = this.getAttribute('data-filter');
//         console.log('Filter button clicked: ' + filter);
  
//         // Fetch the portfolio data via the REST API
//         fetch('http://esf.local/wp-json/wp/v2/portfolio?per_page=100')
//           .then(response => response.json())
//           .then(data => {
//             console.log('Portfolio Data:', data);
  
//             // Filter items based on the release_status
//             const releasedItems = data.filter(item => item.acf.release_status === 'released');
//             const comingSoonItems = data.filter(item => item.acf.release_status === 'coming-soon');
  
//             console.log(releasedItems, "releasedItems")
//             console.log(comingSoonItems, "coming soon items")
  
//             // DOM Elements where the items will be appended
//             const releasedSection = document.querySelector('#released-items');
//             const comingSoonSection = document.querySelector('#coming-soon-items');
  
//             // Clear previous content
//             releasedSection.innerHTML = '';
//             comingSoonSection.innerHTML = '';
  
//             // Show filtered items based on the button clicked
//             if (filter === 'released') {
//               releasedItems.forEach(item => {
//                 const newItem = document.createElement('div');
//                 newItem.textContent = item.title.rendered;
//                 releasedSection.appendChild(newItem);
//               });
//             } else if (filter === 'coming-soon') {
//               comingSoonItems.forEach(item => {
//                 const newItem = document.createElement('div');
//                 newItem.textContent = item.title.rendered;
//                 comingSoonSection.appendChild(newItem);
//               });
//             }
//           })
//           .catch(error => console.error('Error fetching portfolio data:', error));
//       });
//     });
// }




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
