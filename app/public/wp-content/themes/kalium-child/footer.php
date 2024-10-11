<?php
/**
 * Kalium WordPress Theme
 *
 * Theme footer.
 *
 * @author Laborator
 * @link   https://kaliumtheme.com
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Direct access not allowed.
}

/**
 * Wrapper end hooks.
 */
do_action( 'kalium_wrapper_end' );
?>

<!-- Subscription Section -->
<!-- <div class="subscription-container">


  <section class="stay-tuned" >
      <div class="footer-content-container">
          <h4>STAY TUNED</h4>
          <p>Sign up to receive the latest announcements, tips, networking invitations, and more.</p>
      </div>
      <div class="newsletter">
          <h3>EMAIL*</h3>
        
      </div>
  </section>
</div> -->

<!-- Footer -->
<footer class="custom-footer" role="contentinfo">
    <div class="footer-container">
      
     <div class="footer-links">
        <div class="footer-social">
                <a class="nav-footer-link" href="https://vimeo.com/YOUR_PROFILE" target="_blank" title="Vimeo">
                    <img src="http://esf.local/wp-content/uploads/2024/09/vimeo_logo2.png" alt="Vimeo">
                </a>
                <a class="nav-footer-link" class="twitter" href="https://twitter.com/YOUR_USERNAME" target="_blank" title="Twitter">
                    <img src="http://esf.local/wp-content/uploads/2024/09/X_logo_2023.svg.png" alt="Twitter">
                </a>
                <a class="nav-footer-link" href="https://www.instagram.com/YOUR_USERNAME" target="_blank" title="Instagram">
                    <img src="http://esf.local/wp-content/uploads/2024/09/free-instagram-logo-icon-3497-thumb.png" alt="Instagram">
                </a>
            </div>
            <div class="footer-nav">
                <ul style="display: flex; flex-direction: column;">
                    <li><a class="nav-footer-link" href="/films">FILMS</a></li>
                    <li><a class="nav-footer-link" href="/distribution">DISTRIBUTION</a></li>
                    <li><a class="nav-footer-link" href="/about">ABOUT</a></li>
                </ul>
            </div>
        </div>
    </div>
    <div class="footer-copyright">
        <p>&copy; EyeSteelFilm, 2024</p>
    </div>
</footer>

<?php wp_footer(); ?>
</body>
</html>


</div><!-- .wrapper -->

<?php
/**
 * After wrapper hooks.
 *
 * @hooked kalium_display_footer - 10
 */
do_action( 'kalium_after_wrapper' );

/**
 * WP Footer actions.
 */

         
wp_footer();

?>

<!-- Lenis Scroll Script -->
<script src="https://unpkg.com/@studio-freight/lenis@1.0.33/dist/lenis.min.js"></script>
<script>
  /**
   * set lenis scroll
   */
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
    direction: "vertical",
    gestureDirection: "vertical",
    smooth: true,
    smoothTouch: false,
    touchMultiplier: 2,
  });
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
</script>
</body>
</html>
