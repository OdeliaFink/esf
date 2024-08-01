<?php
// Enqueue parent and child theme styles
function kalium_child_enqueue_styles() {
    // Enqueue parent theme stylesheet
    wp_enqueue_style('kalium-parent-style', get_template_directory_uri() . '/style.css');
    wp_enqueue_style('kalium-child-style', get_stylesheet_directory_uri() . '/assets/css/style.css', array('kalium-parent-style'), wp_get_theme()->get('Version'));
    wp_enqueue_script('accordion-js', get_stylesheet_directory_uri() . '/assets/js/accordion.js', array('jquery'), null, true);

    // Enqueue jQuery (WordPress includes this by default)
    wp_enqueue_script('jquery');

    // Enqueue Slick Slider CSS
    wp_enqueue_style('slick-slider-css', 'https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css');

    // Enqueue Slick Slider JavaScript
    wp_enqueue_script('slick-slider-js', 'https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js', array('jquery'), null, true);

    // Enqueue Slick Slider initialization script
    wp_add_inline_script('slick-slider-js', "
        jQuery(document).ready(function($){
            $('.award-carousel').slick({
                autoplay: true,
                autoplaySpeed: 3000,
                dots: true,
                arrows: false,
                infinite: true,
                slidesToShow: 3,
                slidesToScroll: 1,
                responsive: [
                    {
                        breakpoint: 768,
                        settings: {
                            slidesToShow: 2,
                        }
                    },
                    {
                        breakpoint: 480,
                        settings: {
                            slidesToShow: 1,
                        }
                    }
                ]
            });
        });
    ");
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

// function create_awards_post_type() {
//     register_post_type('award',
//         array(
//             'labels' => array(
//                 'name' => __('Awards'),
//                 'singular_name' => __('Award')
//             ),
//             'public' => true,
//             'has_archive' => true,
//             'supports' => array('title', 'thumbnail'),
//         )
//     );
// }
// add_action('init', 'create_awards_post_type');

// Register Custom Post Type for Hero Section
// function create_hero_section_post_type() {
//     register_post_type('hero_section',
//         array(
//             'labels' => array(
//                 'name' => __('Hero Sections'),
//                 'singular_name' => __('Hero Section'),
//                 'add_new_item' => __('Add New Hero Section'),
//                 'edit_item' => __('Edit Hero Section'),
//                 'new_item' => __('New Hero Section'),
//                 'view_item' => __('View Hero Section'),
//                 'search_items' => __('Search Hero Sections'),
//                 'not_found' => __('No hero sections found'),
//                 'not_found_in_trash' => __('No hero sections found in Trash'),
//             ),
//             'public' => true,
//             'has_archive' => true,
//             'rewrite' => array('slug' => 'hero-sections'), // Custom slug
//             'supports' => array('title', 'editor', 'thumbnail', 'custom-fields'),
//             'menu_icon' => 'dashicons-format-image', // Set an appropriate icon
//             'show_in_rest' => true, // Enable Gutenberg editor support
//         )
//     );
// }
// add_action('init', 'create_hero_section_post_type');

// Initialize the Revolution Slider
function my_custom_init_slider() {
    ?>
    <script type="text/javascript">
        jQuery(document).ready(function() {
            if (jQuery.fn.revolution) {
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
            } else {
                console.error("Revolution Slider plugin not found.");
            }
        });
    </script>
    <?php
}
add_action('wp_footer', 'my_custom_init_slider');
?>
