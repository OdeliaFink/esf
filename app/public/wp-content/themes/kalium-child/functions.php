<?php
// Enqueue parent and child theme styles
function kalium_child_enqueue_styles() {
    // Enqueue parent theme stylesheet
    wp_enqueue_style('kalium-parent-style', get_template_directory_uri() . '/style.css');
    
    // Enqueue child theme stylesheet
    wp_enqueue_style('kalium-child-style', get_stylesheet_directory_uri() . '/assets/css/style.css', array('kalium-parent-style'), wp_get_theme()->get('Version'));
}
add_action('wp_enqueue_scripts', 'kalium_child_enqueue_styles');


function kalium_child_change_portfolio_slug() {
    global $wp_post_types;

    // Check if the post type exists before trying to modify it
    if ( isset( $wp_post_types['portfolio'] ) ) {
        $post_type = $wp_post_types['portfolio'];
        
        // Set the rewrite slug to 'films'
        $post_type->rewrite['slug'] = 'films';
        $post_type->has_archive = 'films';
    }
}
add_action('init', 'kalium_child_change_portfolio_slug', 20);

?>
