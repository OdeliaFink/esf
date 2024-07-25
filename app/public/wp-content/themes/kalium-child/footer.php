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
        <h4>Stay Tuned</h4>
        <form action="subscribe.php" method="post">
            <input type="email" name="email" placeholder="Email">
            <button type="submit">Subscribe</button>
        </form>
    </section>
    <section class="footer-links">
        <div class="social-media">
            <ul>
                <li><a href="https://youtube.com">YouTube</a></li>
                <li><a href="https://instagram.com">Instagram</a></li>
                <li><a href="https://twitter.com">Twitter (X)</a></li>
                <li><a href="https://vimeo.com">Vimeo</a></li>
            </ul>
        </div>
        <div class="footer-nav">
            <ul>
                <li><a href="/films">Films</a></li>
                <li><a href="/about">About</a></li>
                <li><a href="/services">Services</a></li>
                <li><a href="/distribution">Distribution</a></li>
            </ul>
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

</body>
</html>