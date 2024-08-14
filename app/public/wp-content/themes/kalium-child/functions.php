<?php
// Enqueue parent and child theme styles
function kalium_child_enqueue_styles() {
    // Enqueue parent theme stylesheet
    wp_enqueue_style('kalium-parent-style', get_template_directory_uri() . '/style.css');
    wp_enqueue_style('kalium-child-style', get_stylesheet_directory_uri() . '/assets/css/style.css', array('kalium-parent-style'), wp_get_theme()->get('Version'));
    
    // Enqueue jQuery (WordPress includes this by default)
    wp_enqueue_script('jquery');
    
    // Enqueue additional scripts and styles
    wp_enqueue_script('accordion-js', get_stylesheet_directory_uri() . '/assets/js/accordion.js', array('jquery'), null, true);
 
        // Enqueue Slick Slider CSS
        wp_enqueue_style( 'slick-css', 'https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css' );
        wp_enqueue_style( 'slick-theme-css', 'https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick-theme.css' );
    
        // Enqueue Slick Slider JS
        wp_enqueue_script( 'slick-js', 'https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js', array('jquery'), '', true );
    
        // Enqueue the Slick Slider initialization script
        wp_enqueue_script( 'slick-init', get_stylesheet_directory_uri() . '/assets/js/slick-init.js', array('slick-js'), '', true );
}
add_action('wp_enqueue_scripts', 'kalium_child_enqueue_styles');

function enqueue_react_framer_motion() {
    // Enqueue React and ReactDOM
    wp_enqueue_script('react', 'https://unpkg.com/react@17/umd/react.production.min.js', array(), null, true);
    wp_enqueue_script('react-dom', 'https://unpkg.com/react-dom@17/umd/react-dom.production.min.js', array('react'), null, true);
    
    // Enqueue Framer Motion
    wp_enqueue_script('framer-motion', 'https://cdn.jsdelivr.net/npm/framed-scroll-motion@0.0.1/dist/framed-scroll-motion.umd.min.js', array('react', 'react-dom'), null, true);

    // Enqueue your custom animation script
    wp_enqueue_script('custom-animation', get_template_directory_uri() . '/custom-animation.js', array('framer-motion'), null, true);
}
add_action('wp_enqueue_scripts', 'enqueue_react_framer_motion');

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

function enqueue_custom_scripts() {
    // Enqueue LENIS
    wp_enqueue_script('lenis', 'https://unpkg.com/@studio-freight/lenis@1.0.33/dist/lenis.min.js', array(), null, true);

    // Enqueue SPLITTYPE
    wp_enqueue_script('splittype', 'https://cdn.jsdelivr.net/npm/split-type@0.3.4/umd/index.min.js', array(), null, true);

    // Custom Script to Initialize
    wp_enqueue_script('custom-animation-init', get_stylesheet_directory_uri() . '/js/animation-init.js', array('lenis', 'splittype'), null, true);
}
add_action('wp_enqueue_scripts', 'enqueue_custom_scripts');

// THIS IS THE SCRIPT FOR GSAP??
// function enqueue_my_custom_script() {
//     wp_enqueue_script( 'gsap-js', 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js', false );
// 	wp_enqueue_script( 'gsap-st', 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js', false, true );
// }

function enqueue_my_custom_script() {
    // Enqueue the latest version of GSAP
    wp_enqueue_script( 'gsap-js', 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js', array(), null, true );
    // Enqueue the ScrollTrigger plugin, which requires GSAP version 3.11 or higher
    wp_enqueue_script( 'gsap-st', 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js', array('gsap-js'), null, true );
}

add_action( 'wp_enqueue_scripts', 'enqueue_my_custom_script' );


// add_action( 'wp_enqueue_scripts', 'enqueue_my_custom_script' );

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
