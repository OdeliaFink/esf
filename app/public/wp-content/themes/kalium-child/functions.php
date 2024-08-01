<?php
// Enqueue parent and child theme styles
function kalium_child_enqueue_styles() {
    // Enqueue parent theme stylesheet
    wp_enqueue_style('kalium-parent-style', get_template_directory_uri() . '/style.css');
    wp_enqueue_style('slick-slider-css', 'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.css');
    wp_enqueue_script('slick-slider-js', 'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.js', array('jquery'), null, true);
    wp_enqueue_script('slick-init', get_stylesheet_directory_uri() . '/js/slick-init.js', array('slick-slider-js'), null, true);
    
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

function create_awards_post_type() {
    register_post_type('award',
        array(
            'labels' => array(
                'name' => __('Awards'),
                'singular_name' => __('Award')
            ),
            'public' => true,
            'has_archive' => true,
            'supports' => array('title', 'thumbnail'),
        )
    );
}
add_action('init', 'create_awards_post_type');

// Initialize the Revolution Slider
function my_custom_init_slider() {
    ?>
    <script type="text/javascript">
        jQuery(document).ready(function() {
            jQuery("#award-carousel").show().revolution({
                // Your slider settings go here
                sliderType: "standard",
                sliderLayout: "auto",
                delay: 5000,
                navigation: {
                    arrows: {enable: true}
                }
                // Add additional settings as needed
            });
        });
    </script>
    <?php
}
add_action('wp_footer', 'my_custom_init_slider');

?>
