<?php
// Enqueue parent and child theme styles
function kalium_child_enqueue_styles() {
    // Enqueue parent theme stylesheet
    wp_enqueue_style('kalium-parent-style', get_template_directory_uri() . '/style.css');
    
    // Enqueue child theme stylesheet
    wp_enqueue_style('kalium-child-style', get_stylesheet_directory_uri() . '/assets/css/style.css', array('kalium-parent-style'), wp_get_theme()->get('Version'));
}
add_action('wp_enqueue_scripts', 'kalium_child_enqueue_styles');
?>
