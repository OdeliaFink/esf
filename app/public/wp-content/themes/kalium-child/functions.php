<?php
// Enqueue parent and child theme styles
function kalium_child_enqueue_styles() {
    wp_enqueue_style('kalium-parent-style', get_template_directory_uri() . '/style.css');
    wp_enqueue_style('kalium-parent-style', get_template_directory_uri() . '/media.css');
    wp_enqueue_style('kalium-child-style', get_stylesheet_directory_uri() . '/assets/css/style.css', array('kalium-parent-style'), wp_get_theme()->get('Version'));
    wp_enqueue_script('jquery');
    wp_enqueue_script('accordion-js', get_stylesheet_directory_uri() . '/assets/js/accordion.js', array('jquery'), null, true);
    wp_enqueue_style( 'slick-css', 'https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css' );
    wp_enqueue_style( 'slick-theme-css', 'https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick-theme.css' );
    wp_enqueue_script( 'slick-js', 'https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js', array('jquery'), '', true );
    wp_enqueue_script( 'slick-init', get_stylesheet_directory_uri() . '/assets/js/slick-init.js', array('slick-js'), '', true );
}
add_action('wp_enqueue_scripts', 'kalium_child_enqueue_styles');

function enqueue_font_awesome() {
    wp_enqueue_style('font-awesome', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');
}
add_action('wp_enqueue_scripts', 'enqueue_font_awesome');

function enqueue_react_framer_motion() {
if(is_front_page()){

    wp_enqueue_script('react', 'https://unpkg.com/react@17/umd/react.production.min.js', array(), null, true);
    wp_enqueue_script('react-dom', 'https://unpkg.com/react-dom@17/umd/react-dom.production.min.js', array('react'), null, true);
    wp_enqueue_script('framer-motion', 'https://cdn.jsdelivr.net/npm/framed-scroll-motion@0.0.1/dist/framed-scroll-motion.umd.min.js', array('react', 'react-dom'), null, true);
    // wp_enqueue_script('custom-animation', get_template_directory_uri() . '/custom-animation.js', array('framer-motion'), null, true);
}

}
add_action('wp_enqueue_scripts', 'enqueue_react_framer_motion');


// Modify the permalink for portfolio items
add_filter('post_type_link', 'custom_portfolio_permalink', 10, 2);
function custom_portfolio_permalink($post_link, $post) {
    if ($post->post_type == 'portfolio') {
        // Get the terms (categories) associated with this portfolio item
        $terms = wp_get_post_terms($post->ID, 'portfolio_category');

        // Check if the post has terms
        if (!is_wp_error($terms) && !empty($terms)) {
            // Loop through the terms and check for specific categories
            foreach ($terms as $term) {
                if ($term->slug == 'films') {
                    return home_url('/films/' . $post->post_name);
                } elseif ($term->slug == 'distribution') {
                    return home_url('/distribution/' . $post->post_name);
                }
            }
        }
    }
    return $post_link;
}

// Add custom rewrite rules for films and distribution
// add_action('init', 'custom_portfolio_rewrite_rules');
// function custom_portfolio_rewrite_rules() {
//     add_rewrite_rule('^films/([^/]+)/?$', 'index.php?post_type=portfolio&name=$matches[1]', 'top');
//     add_rewrite_rule('^distribution/([^/]+)/?$', 'index.php?post_type=portfolio&name=$matches[1]', 'top');
// }

// // Flush rewrite rules on theme activation
// add_action('after_switch_theme', 'flush_rewrite_rules');

function redirect_if_no_lang_param() {
    // Check if the language is in the URL query string
    if (isset($_GET['lang'])) {
        // Set a cookie for the selected language (30 days)
        setcookie('lang', $_GET['lang'], time() + (86400 * 30), "/");
        $_COOKIE['lang'] = $_GET['lang']; // To handle the current request
    } elseif (!isset($_COOKIE['lang'])) {
        // If no language query and no cookie, default to English
        $default_lang = 'en';

        // Get the current URL
        $current_url = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
        
        // Append ?lang=en if there are no existing query parameters, or &lang=en if there are
        $redirect_url = strpos($current_url, '?') === false ? $current_url . '?lang=' . $default_lang : $current_url . '&lang=' . $default_lang;
        
        // Perform the redirect
        wp_redirect($redirect_url);
        exit();
    } else {
        // If cookie is set, keep the same language on all pages
        $current_lang = $_COOKIE['lang'];
        if (!isset($_GET['lang'])) {
            // Get the current URL without the query parameters
            $current_url = strtok((isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]", '?');

            // Redirect to the same page but append the cookie language as the query parameter
            $redirect_url = $current_url . '?lang=' . $current_lang;
            wp_redirect($redirect_url);
            exit();
        }
    }
}
add_action('template_redirect', 'redirect_if_no_lang_param');


function load_translation_file() {
    // Determine language: prioritize query string, then cookie, default to 'en'
    $language = isset($_GET['lang']) ? $_GET['lang'] : (isset($_COOKIE['lang']) ? $_COOKIE['lang'] : 'en');

    // Set the translation file path based on the selected language
    $file_path = get_stylesheet_directory() . '/languages/translations_' . $language . '.json';

    // Load the appropriate JSON translation file
    if (file_exists($file_path)) {
        $translations = json_decode(file_get_contents($file_path), true);
        return $translations;
    }

    // Fallback to English if the file doesn't exist
    $file_path = get_stylesheet_directory() . '/languages/translations_en.json';
    $translations = json_decode(file_get_contents($file_path), true);
    return $translations;
}




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
add_action('init', 'kalium_child_change_portfolio_slug', 40);

function my_acf_location_rules_types($choices) {
    $choices['Custom']['page_template_and_post_type'] = 'Page Template and Post Type';
    return $choices;
}
add_filter('acf/location/rule_types', 'my_acf_location_rules_types');

function my_acf_location_rules_values($choices) {
    $choices['about_page_template'] = 'About Page Template';
    return $choices;
}
add_filter('acf/location/rule_values/page_template_and_post_type', 'my_acf_location_rules_values');

function my_acf_location_rules_match($match, $rule, $options) {
    if ($rule['param'] == 'page_template_and_post_type') {
        $post_type_match = ($options['post_type'] == 'page');
        $page_template_match = (isset($options['page_template']) && $options['page_template'] == 'about.php');
        $match = ($post_type_match && $page_template_match);
    }
    return $match;
}
add_filter('acf/location/rule_match/page_template_and_post_type', 'my_acf_location_rules_match', 10, 3);



function create_team_member_post_type() {
 

        register_post_type('team_member',
            array(
                'labels' => array(
                    'name' => __('Team Members'),
                    'singular_name' => __('Team Member'),
                ),
                'public' => true,
                'has_archive' => false, // Set to false to avoid archive conflicts
                'supports' => array('title', 'editor', 'thumbnail'),
                'rewrite' => array('slug' => 'about', 'with_front' => false), // Just 'about' in the slug
                'show_in_rest' => true, // Enable Gutenberg editor
            )
        );
  
}
add_action('init', 'create_team_member_post_type');

function enqueue_custom_scripts() {

    if(is_front_page()){
        wp_enqueue_script('lenis', 'https://unpkg.com/@studio-freight/lenis@1.0.33/dist/lenis.min.js', array(), null, true);
        wp_enqueue_script('splittype', 'https://cdn.jsdelivr.net/npm/split-type@0.3.4/umd/index.min.js', array(), null, true);
        // wp_enqueue_script('custom-animation-init', get_stylesheet_directory_uri() . '/js/animation-init.js', array('lenis', 'splittype'), null, true);
    }
}
add_action('wp_enqueue_scripts', 'enqueue_custom_scripts');

function enqueue_my_custom_script() {
    // Enqueue the latest version of GSAP
    wp_enqueue_script( 'gsap-js', 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js', array(), null, true );
    // Enqueue the ScrollTrigger plugin, which requires GSAP version 3.11 or higher
    wp_enqueue_script( 'gsap-st', 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js', array('gsap-js'), null, true );
}

add_action( 'wp_enqueue_scripts', 'enqueue_my_custom_script' );


?>
