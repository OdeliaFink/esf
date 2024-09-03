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
<div style="background-color: #FEC960;">


  <section class="stay-tuned" >
      <div class="footer-content-container">
          <h4>STAY TUNED</h4>
          <p>Sign up to receive the latest announcements, tips, networking invitations, and more.</p>
      </div>
      <div class="newsletter">
          <h3>EMAIL*</h3>
          <?php echo do_shortcode('[fluentform id="3"]'); // Replace 123 with your actual form ID ?>
      </div>
  </section>
</div>

<!-- Footer -->
<footer id="site-footer" class="custom-footer" role="contentinfo">
    <div class="footer-container">
      
        <div class="footer-links">
            <div class="footer-social">
            <?php
                // Fetch and display the social media icons from Kalium theme
                if ( function_exists( 'kalium_social_networks' ) ) {
                    kalium_social_networks();
                }
                ?>
            </div>
            <div class="footer-nav">
                <ul style="display: flex; flex-direction: column;">
                    <li><a class="nav-footer-link" href="/films">FILMS</a></li>
                    <li><a class="nav-footer-link" href="/about">ABOUT</a></li>
                    <li><a class="nav-footer-link" href="/services">SERVICES</a></li>
                    <li><a class="nav-footer-link" href="/distribution">DISTRIBUTION</a></li>
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
