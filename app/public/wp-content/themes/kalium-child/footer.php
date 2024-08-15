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
<footer class="site-footer">
    <section class="stay-tuned">
        <div class="footer-content-container">
            <h4>STAY TUNED</h4>
            <p>Sign up to receive the latest announcements, tips, networking invitations, and more.</p>
        </div>
        <div class="newsletter">
            <h3>EMAIL*</h3>
            <form action="subscribe.php" method="post">
                <input type="email" name="email" placeholder="Email" required>
                <button type="submit">Subscribe</button>
            </form>
        </div>
    </section>

 
</footer>

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
   

<!-- Other footer content -->


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
