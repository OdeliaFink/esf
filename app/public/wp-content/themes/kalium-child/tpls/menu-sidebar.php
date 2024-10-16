<?php
/**
 * Kalium WordPress Theme
 *
 * Laborator.co
 * www.laborator.co
 *
 * @deprecated 3.0 This template file will be removed or replaced with new one in templates/ folder.
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit; // Direct access not allowed.
}

// Menu type to use
$main_menu_type = kalium_get_theme_option( 'main_menu_type' );

$menu_sidebar_menu_id           = kalium_get_theme_option( 'menu_sidebar_menu_id' );
$menu_sidebar_skin              = kalium_get_theme_option( 'menu_sidebar_skin' );
$menu_sidebar_alignment         = kalium_get_theme_option( 'menu_sidebar_alignment' );
$menu_sidebar_show_widgets      = kalium_get_theme_option( 'menu_sidebar_show_widgets' );

$menu_sidebar_dropdown_caret    = kalium_get_theme_option( 'submenu_dropdown_indicator' );

$menu_id = 'main-menu';

if ( $menu_sidebar_menu_id != 'default' ) {
	$menu_id = str_replace( 'menu-', '', $menu_sidebar_menu_id );
}

$nav = kalium_nav_menu( $menu_id );

?>
<div class="sidebar-menu-wrapper menu-type-<?php echo esc_attr( $main_menu_type ); ?> sidebar-alignment-<?php echo esc_attr( $menu_sidebar_alignment ); echo $menu_sidebar_dropdown_caret ? ' dropdown-caret' : ''; ?> <?php echo esc_attr( $menu_sidebar_skin ); ?>">
	<div class="sidebar-menu-container">
		
		<a class="sidebar-menu-close" aria-label="Close" role="button" href="#"></a>
		
		<?php if ( $nav ) : ?>
		<div class="sidebar-main-menu">
			<?php echo $nav; ?>
		</div>
		<div style="margin-top: 2rem; display: flex; align-items: center;">
		<a style="font-weight: 400; font-size: 2rem;" href="?lang=en">EN</a>
		<span style="display: inline-block; width: 1px; height: 2rem; background-color: black; margin: 0 10px;"></span>
		 <a style="font-weight: 400; font-size: 2rem;" href="?lang=fr">FR</a>
		</div>
		<?php endif; ?>
		
		<?php if ( $menu_sidebar_show_widgets ) : ?>
		<div class="sidebar-menu-widgets blog-sidebar">
			<?php dynamic_sidebar( 'sidebar_menu_sidebar' ); ?>
		</div>
		<?php endif; ?>
		
	</div>
</div>

<div class="sidebar-menu-disabler"></div>