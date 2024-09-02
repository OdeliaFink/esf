jQuery(document).ready(function($) {
  $('.accordion-header').on('click', function() {
      $(this).toggleClass('active').next('.accordion-content').slideToggle();
      $(this).find('.accordion-icon').toggleClass('rotated');
  });

  gsap.registerPlugin(ScrollTrigger);
  let revealAnimations = [];
  
  // Scroll
  const lenis = new Lenis({
    lerp: 0.07
  });
  
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time)=>{
    lenis.raf(time * 3000)
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
      opacity: 0,
      ease: 'none',
      stagger: 1,
      duration: 5,
      scrollTrigger: {
        trigger: section,
        start: 'top top', 
    
        // end: () => `+=${window.innerHeight * 5}px`,
        scrub: true,
        // markers: true,
        pin: true,
      }
    })
  })
  

  
  
  (function($) {
    $(document).ready(function() {
        // Regular expression to match words in all caps
        var capsRegex = /\b[A-Z]{2,}\b/g;

        // Iterate over each film item in the accordion
        $('.accordion-item').each(function() {
            var content = $(this).html();
            // Replace all caps words with wrapped span including custom class
            var updatedContent = content.replace(capsRegex, function(match) {
                return '<span class="all-caps">' + match + '</span>';
            });
            // Update the content
            $(this).html(updatedContent);
        });
    });
})(jQuery)



  
});
