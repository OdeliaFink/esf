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
  

  
  
  



  
});
