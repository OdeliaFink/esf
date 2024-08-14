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

<script>
document.addEventListener("DOMContentLoaded", function() {
    function isDark(color) {
        // Function to determine if a color is dark based on its luminance
        const rgb = color.match(/\d+/g);
        const luminance = 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
        return luminance < 128;
    }

    function getBackgroundColor(element) {
        // Function to get the background color of an element
        let color = window.getComputedStyle(element).backgroundColor;
        while (color === 'rgba(0, 0, 0, 0)' && element) {
            element = element.parentElement;
            color = window.getComputedStyle(element).backgroundColor;
        }
        return color;
    }

    function toggleMenuIcon() {
        const backgroundElement = document.querySelector('.background-row'); // Update the selector
        const hamburgerMenu = document.querySelector('.hamburger-menu');
        const blackIcon = hamburgerMenu.querySelector('.black-icon');
        const whiteIcon = hamburgerMenu.querySelector('.white-icon');

        const backgroundColor = getBackgroundColor(backgroundElement);
        if (isDark(backgroundColor)) {
            blackIcon.style.display = 'none';
            whiteIcon.style.display = 'block';
        } else {
            blackIcon.style.display = 'block';
            whiteIcon.style.display = 'none';
        }
    }

    // Call the function on load and on window resize
    toggleMenuIcon();
    window.addEventListener('resize', toggleMenuIcon);
});
</script>
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
