<?php
/**
 * Kalium WordPress Theme
 *
 * The new Kalium 4.
 *
 * @author Laborator
 * @link   https://kaliumtheme.com
 */
if ( ! defined( 'ABSPATH' ) ) {
    exit; // Direct access not allowed.
}

?>

<div class="about-kalium__heading no-top-margin">

	<div class="about-kalium__intro-4">
		<div>
			<h2>Kalium 4 – Biggest Update Ever</h2>
			<p>We’re happy to introduce Kalium 4! This update brings lots new features such as 11 new Elementor starter sites, lots of new WooCommerce features, a live theme customizer, speed and accessibility improvements and many more new features. </p>
			<br />
			<a href="https://kaliumtheme.com/whats-new-in-kalium-4/?utm_source=about_page&utm_medium=kalium_4&utm_campaign=intro_text" target="_blank" class="button button-primary">What's new in Kalium 4 →</a>
			<br /><br />
			<p class="announcement"><b>Important Announcement:</b> Kalium 4 is now available exclusively on our website due to a change in our licensing and sales platform. This transition will allow us to continue developing Kalium and deliver even better updates and support. For more details <a href="#faq">please read the FAQ ↓</a></p>
		</div>
		<div>
            <a href="https://kaliumtheme.com/whats-new-in-kalium-4/?utm_source=about_page&utm_medium=kalium_4&utm_campaign=intro_image" target="_blank" rel="noopener noreferrer">
                <img src="<?php echo kalium()->assets_url( 'admin/images/whats-new/kalium-4-intro.jpg'); ?>" alt="Kalium 4 - Biggest Update Ever" class="intro-image">
            </a>
		</div>
	</div>
	<br />
	<br />


	<?php
	// Upgrade form
	if ( kalium()->theme_license->is_theme_registered() ) :
		?>
		<form method="post" action="" class="about-kalium__upgrade__form">
			<h3>Transfer Your License &amp; Upgrade to Kalium 4</h3>
			<p>To upgrade to Kalium 4, you’ll need to transfer your license to our new platform. This will create an account with Freemius, our new license provider, and grant you an additional 3 months of theme updates and support on top of your current support. Please provide the email address you want to use for your Kalium account. If you already have a Freemius account, use that email. </p>
			<br />
			<div class="form-field">
				<label for="email">Email:</label>
				<input type="email" class="regular-text" id="email" name="email" autocomplete="email" required>
			</div>

			<div class="form-field">
				<label for="purchase-code">Purchase Code (<a href="https://docs.kaliumtheme.com/getting-started/migrating-from-kalium-3-to-4/migrating-manually#step-3-enter-your-theme-purchase-code" target="_blank" rel="noopener noreferrer">How to find purchase code?</a>):</label>
				<input type="text" class="regular-text" id="purchase-code" name="purchase_code" required>
				<span class="description">Please make sure the purchase is linked to this site.  <a href="https://api.laborator.co/?assigned-licenses" target="_blank" rel="noopener">Find your assigned licenses &rarr;</a></span>
			</div>
			<button type="submit" class="button button-primary">Upgrade to Kalium 4</button>
			<span class="form-consent">By completing this form, you agree to let Freemius process your data for future updates.</span>
			</form>
        <script type="text/html" id="confirm_upgrade_message">
            <div class="about-kalium__upgrade__confirm">
                <p>You are about to upgrade to Kalium 4.</p>
				<p>Before proceeding, please <a href="https://docs.kaliumtheme.com/getting-started/migrating-from-kalium-3-to-4?utm_source=kalium_theme&utm_medium=dashboard&utm_campaign=migrate_instructions" target="_blank" rel="noopener noreferrer">read the instructions here</a> and make sure you fully understand the changes involved in this update. Make sure you backed up your current site, as this version includes major changes. We also recommend using a staging environment for a safer upgrade.</p>

                <div class="about-kalium__upgrade__confirm__buttons">
                    <button type="button" class="button button-primary">Upgrade Now</button>
                    <button class="button">Cancel</button>
                </div>
            </div>
        </script>
        <?php else: ?>
        <div class="about-kalium__upgrade__form">
            <p>To transfer the theme license directly from this page, navigate to <a href="<?php echo esc_url( Kalium_About::get_tab_link( 'theme-registration' ) ); ?>">Kalium &rarr; License</a>, register the theme, and then return to this page.</p>
        </div>
		<?php
	endif
	?>
	<div class="about-kalium__upgrade">
	<br /><br />
	<h2 class="about-kalium__heading">FAQ</h2>
	<p>Find answers to common questions about Kalium 4, covering licensing, updates, and platform changes.</p>

	<div class="about-kalium__upgrade__description">
	<ul class="about-kalium__faq-articles" id="faq">
			<li class="about-kalium__faq-article-entry" id="benefits-platform-change">
				<h3 class="about-kalium__faq-article-entry-title">
					<a href="#benefits-platform-change">
						<span class="caret"></span>
						What are the benefits of this platform change?
					</a>
				</h3>
				<div class="about-kalium__faq-article-entry-content">
                    <p>This change allows us to prioritize ongoing theme development and ensure the sustainability of our product, while also offering better pricing options, including annual and lifetime licenses, multi-use licenses, special deals, and exclusive coupons that weren’t available through Envato.</p>
                    <br />
                    <p>Support coverage is now extended to 1 year (from 6 months) for annual licenses and 3 years for lifetime licenses.</p>
                    <br />
					<a href="https://kaliumtheme.com/platform-change/?utm_source=about_page&utm_medium=kalium_4&utm_campaign=faq" target="_blank" rel="noopener noreferrer" class="button button-primary">Read More &rarr;</a>

				</div>
			</li>
			<li class="about-kalium__faq-article-entry" id="difference-kalium-3-4">
			<h3 class="about-kalium__faq-article-entry-title">
			<a href="#difference-kalium-3-4">
			<span class="caret"></span>
			What is the difference between Kalium 3 and Kalium 4?
			</a>
			</h3>
			<div class="about-kalium__faq-article-entry-content">
			Kalium 3 was released in 2015 and, despite its great success, lacked some basic features that users have come to expect. With Kalium 4, we’ve made substantial improvements, making it feel like a completely new theme. Kalium 4 includes a range of new features and enhancements that address the limitations of its predecessor.
			<br><br>
			Kalium 4 offers better performance, improved SEO-friendliness, and enhanced compatibility with modern plugins and WordPress updates. It’s designed to provide a more powerful, flexible, and user-friendly experience.
			<br><br>
			For those who prefer to continue using Kalium 3, it will remain available on ThemeForest. However, our primary focus will be on Kalium 4, which means Kalium 3 will only receive security updates moving forward. We encourage users to transition to Kalium 4 to take advantage of the latest features and improvements.
			<br><br>
			<a href="https://kaliumtheme.com/whats-new-in-kalium-4/?utm_source=about_page&utm_medium=kalium_4&utm_campaign=faq" target="_blank" rel="noopener noreferrer" class="button button-primary">See all new features &rarr;</a>

			</div>
			</li>

			<li class="about-kalium__faq-article-entry" id="expired-support-kalium-4">
				<h3 class="about-kalium__faq-article-entry-title">
					<a href="#expired-support-kalium-4">
						<span class="caret"></span>
						Who can upgrade to Kalium 4?
					</a>
				</h3>
				<div class="about-kalium__faq-article-entry-content">
					<strong>Everyone!</strong> Kalium 4 is available to everyone, even those with expired support subscriptions. By transfering your license, you’ll receive an additional 3 months of support and updates, consider this as a grace period.
					<br />
					<br />
					<ul>
						<li><strong>If your support subscription is inactive</strong>, you’ll get 3 months of new support.</li>
						<li><strong>If you have an active subscription</strong>, it will be extended by 3 months. For example, if your support ends on January 1, 2025, it will now end on April 1, 2025.</li>
					</ul>

                    <p>
                        <strong>Important:</strong> Only users who purchased Kalium from ThemeForest <strong>before October 1, 2024</strong>, are eligible to receive an extra 3 months of free support and updates when transferring their license to Kalium 4.
                    </p>
                    
                </div>
			</li>
			<li class="about-kalium__faq-article-entry" id="grace-period-end">
				<h3 class="about-kalium__faq-article-entry-title">
					<a href="#grace-period-end">
						<span class="caret"></span>
						What happens after the grace period ends?
					</a>
				</h3>
				<div class="about-kalium__faq-article-entry-content">
					Once the additional 3 months are over, you can choose to purchase an annual or lifetime license directly from our website. If you decide not to renew, Kalium will continue to work as it is, but you will no longer receive updates or customer support.
				</div>
			</li>
			<li class="about-kalium__faq-article-entry" id="renew-license">
				<h3 class="about-kalium__faq-article-entry-title">
					<a href="#renew-license">
						<span class="caret"></span>
						Is it necessary to renew my license every year?
					</a>
				</h3>
				<div class="about-kalium__faq-article-entry-content">
					Renewing every year is not mandatory but it is recommended so you can get the latest updates, starter sites and customer support from our team. The websites you have built will continue to work without any issues even if you don’t renew after the annual plan has expired.
				</div>
			</li>
			<li class="about-kalium__faq-article-entry" id="forced-upgrade">
				<h3 class="about-kalium__faq-article-entry-title">
					<a href="#forced-upgrade">
						<span class="caret"></span>
						It feels like I’m being forced to upgrade. Do I have to upgrade?
					</a>
				</h3>
				<div class="about-kalium__faq-article-entry-content">
					Absolutely not! You can choose to stay on your current version of Kalium. However, please note that Kalium 3 will only receive security updates and maintenance, as all our focus will be on the new version.
				</div>
			</li>
			
			<li class="about-kalium__faq-article-entry" id="price-increase-themeforest">
				<h3 class="about-kalium__faq-article-entry-title">
					<a href="#price-increase-themeforest">
						<span class="caret"></span>
						Why has the price increased on ThemeForest?
					</a>
				</h3>
				<div class="about-kalium__faq-article-entry-content">
					We’ve opted out of exclusivity with Envato, leading to a decrease in our author share and a price increase on ThemeForest. However, by purchasing directly from our website, you can take advantage of better pricing options, including exclusive deals, flexible plans, and additional benefits that aren’t available on ThemeForest. Visit our site to see how you can get more value and savings!
				</div>
			</li>

			

		</ul>
	</div>

</div>