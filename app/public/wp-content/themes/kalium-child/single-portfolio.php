<?php
/**
 * Kalium WordPress Theme
 *
 * Laborator.co
 * www.laborator.co
 */
if ( ! defined( 'ABSPATH' ) ) {
    exit; // Direct access not allowed.
}

$item_type = kalium_get_field( 'item_type' );

// Custom Item Link Redirect
if ( kalium_get_field( 'item_linking' ) == 'external' ) {
    $launch_link_href = kalium_get_field( 'launch_link_href' );

    if ( $launch_link_href ) {
        if ( $launch_link_href != '#' ) {
            wp_redirect( $launch_link_href, 301 );
            exit;
        } else {
            // Disabled item links, will redirect to closest next/previous post
            $include_categories = kalium_get_theme_option( 'portfolio_prev_next_category' ) ? true : false;

            $prev = get_next_post( $include_categories, '', 'portfolio_category' );
            $next = get_previous_post( $include_categories, '', 'portfolio_category' );

            if ( ! empty( $next ) ) {
                wp_redirect( get_permalink( $next ) );
            } else if ( ! empty( $prev ) ) {
                wp_redirect( get_permalink( $prev ) );
            }
            exit;
        }
    }
}

// Disable Lightbox
if ( kalium_get_theme_option( 'portfolio_disable_lightbox' ) ) {
    kalium()->helpers->add_body_class( 'lightbox-disabled' );
}

// Theme header
get_header();
?>

<div class="film-item"> <!-- Start of container -->

<?php
// Portfolio content
if ( have_posts() ) : 
    while ( have_posts() ) : 
        the_post();

        // Post password
        if ( post_password_required() ) {
            ?>
            <div class="container password-protected-portfolio-item">
                <div class="row">
                    <div class="col-sm-12"><?php echo get_the_password_form(); ?></div>
                </div>
            </div>
            <?php
            continue;
        }

        // Display the Hero Section
        $hero_image = get_field('hero_image');
        $film_title = get_field('film_title');
        $director_name = get_field('director_name');
        $release_year = get_field('release_year');
        $award_1 = get_field('award_n1');
        $award_2 = get_field('award_n2');
        $award_3 = get_field('award_n3');
        $trailer_url = get_field('trailer_url');
        $rent_link = get_field('rent_link');
        $film_rental_header = get_field('film_rental_header');
        ?>

        <div class="hero-section">
            <?php if ($hero_image): ?>
                <div class="hero-image" style="background-image: url('<?php echo esc_url($hero_image['url']); ?>');">
                    <div class="hero-overlay">
                        <div class="hero-text">
                            <h1><?php echo esc_html($film_title); ?></h1>
                            
                        </div>
                    </div>
                </div>
            <?php endif; ?>
            <div class="director-year">
            <p><?php echo esc_html($director_name); ?></p>
            <p><?php echo esc_html($release_year); ?></p>
            </div>
						
        </div>
<div class="laurel-carousel-wrapper">
    <div class="laurel-carousel">
        <div class="laurel-slide">      <?php if ($award_1): ?><img src="<?php echo esc_url($award_1['url']); ?>" alt="<?php echo esc_attr($award_1['alt']); ?>"><?php endif; ?></div>
        <div class="laurel-slide">      <?php if ($award_1): ?><img src="<?php echo esc_url($award_2['url']); ?>" alt="<?php echo esc_attr($award_1['alt']); ?>"><?php endif; ?></div>
        <div class="laurel-slide">      <?php if ($award_1): ?><img src="<?php echo esc_url($award_3['url']); ?>" alt="<?php echo esc_attr($award_1['alt']); ?>"><?php endif; ?></div>
        <div class="laurel-slide">      <?php if ($award_1): ?><img src="<?php echo esc_url($award_1['url']); ?>" alt="<?php echo esc_attr($award_1['alt']); ?>"><?php endif; ?></div>
        <div class="laurel-slide">      <?php if ($award_1): ?><img src="<?php echo esc_url($award_2['url']); ?>" alt="<?php echo esc_attr($award_1['alt']); ?>"><?php endif; ?></div>
        <div class="laurel-slide">      <?php if ($award_1): ?><img src="<?php echo esc_url($award_3['url']); ?>" alt="<?php echo esc_attr($award_1['alt']); ?>"><?php endif; ?></div>
        <div class="laurel-slide">      <?php if ($award_1): ?><img src="<?php echo esc_url($award_1['url']); ?>" alt="<?php echo esc_attr($award_1['alt']); ?>"><?php endif; ?></div>
        <div class="laurel-slide">      <?php if ($award_1): ?><img src="<?php echo esc_url($award_2['url']); ?>" alt="<?php echo esc_attr($award_1['alt']); ?>"><?php endif; ?></div>
        <div class="laurel-slide">      <?php if ($award_1): ?><img src="<?php echo esc_url($award_3['url']); ?>" alt="<?php echo esc_attr($award_1['alt']); ?>"><?php endif; ?></div>
       
    </div>
</div>
				<div class="accordion-container">
            <?php
            $accordion_fields = array(
                'awards' => array(
                    'heading' => get_field('awards_heading'),
                    'content' => get_field('awards_content')
                ),
                'credits' => array(
                    'heading' => get_field('credits_heading'),
                    'content' => get_field('credits_content')
                ),
                'screenings' => array(
                    'heading' => get_field('screenings_heading'),
                    'content' => get_field('screenings_content')
                ),
                'press' => array(
                    'heading' => get_field('press_heading'),
                    'content' => get_field('press_content')
                )
            );

            foreach ($accordion_fields as $field) :
                if ($field['heading'] && $field['content']) :
            ?>

            
                <div class="accordion-item">
                    <div class="accordion-header">
                        <span><?php echo esc_html($field['heading']); ?></span>
                        <span class="accordion-icon">→</span>
                    </div>
                    <div class="accordion-content">
                        <?php echo $field['content']; ?>
                    </div>
                </div>
            <?php
                endif;
            endforeach;
            ?>
        </div>

<div class="movie-stills-slider">
    <?php 
    $image_number = 1;
    while( $image = get_field('image_' . $image_number) ) {
        if( $image ): ?>
            <div class="slick-slide">
                <div class="image-container" style="background-image: url('<?php echo esc_url($image['url']); ?>');"></div>
            </div>
        <?php endif;
        $image_number++;
    }
    ?>
</div>
<div class="centered-border-line">
    <div class="line"></div>
</div>



<!-- Embed the Trailer -->
<?php if ($trailer_url): 
    // Function to get YouTube video ID from URL
    function get_youtube_id($url) {
        // Check for standard YouTube URL format
        preg_match('/(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/', $url, $matches);
        if (isset($matches[1])) {
            return $matches[1];
        }
        // Check for shortened YouTube URL format
        preg_match('/(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^?]+)/', $url, $matches);
        return isset($matches[1]) ? $matches[1] : '';
    }
    
    // Extract YouTube video ID
    $youtube_id = get_youtube_id($trailer_url);
    $is_youtube = !empty($youtube_id);
    
    // Construct YouTube embed URL
    $youtube_embed_url = $is_youtube ? 'https://www.youtube.com/embed/' . esc_attr($youtube_id) : '';
?>

    <div class="film-trailer">
        <?php if ($is_youtube || strpos($trailer_url, 'vimeo.com') !== false): ?>
            <?php if ($is_youtube): ?>
                <iframe width="560" height="315" src="<?php echo esc_url($youtube_embed_url); ?>" frameborder="0" allowfullscreen></iframe>
            <?php else: ?>
                <!-- Handle Vimeo URL here -->
                <iframe src="<?php echo esc_url($trailer_url); ?>" width="560" height="315" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
            <?php endif; ?>
        <?php else: ?>
            <p>Trailer URL is not supported for embedding.</p>
        <?php endif; ?>
    </div>
<?php endif; ?>

<!-- Rent Link Button -->

<?php if ($rent_link): ?>
    <?php 
    // Define the URL for the Vimeo logo
    $vimeo_logo = "http://esf.local/wp-content/uploads/2024/08/download-1.png";
    ?>
    <div class="film-rental-container">
        <h1 class="film-rental-h1"><?php echo esc_html($film_rental_header); ?></h1>
        <a href=<?php echo esc_html($rent_link); ?> target="_blank" rel="noopener noreferrer">
            <img src="<?php echo esc_url($vimeo_logo); ?>" alt="Vimeo" style="max-width: 50%; height: auto;" />
        </a>
    </div>
<?php endif; ?>
<div class="centered-border-line">
    <div class="line"></div>
</div>
        <?php

      

        // Display Awards from Relationship Field
        $awards = get_field('awards');
        if ($awards) {
            echo '<div class="portfolio-awards-carousel">';
            echo '<div class="award-carousel">';
            foreach ($awards as $award) {
                echo '<div class="award-slide">';
                echo get_the_post_thumbnail($award->ID, 'medium');
                echo '<p>' . get_the_title($award->ID) . '</p>';
                echo '</div>';
            }
            echo '</div>';
            echo '</div>';
        } 

        // Portfolio item type layout
        switch ( $item_type ) {
            case 'type-1':
                get_template_part( 'tpls/portfolio-single-1' );
                break;
            case 'type-2':
                get_template_part( 'tpls/portfolio-single-2' );
                break;
            case 'type-3':
                get_template_part( 'tpls/portfolio-single-3' );
                break;
            case 'type-4':
                get_template_part( 'tpls/portfolio-single-4' );
                break;
            case 'type-5':
                get_template_part( 'tpls/portfolio-single-5' );
                break;
            case 'type-6':
                get_template_part( 'tpls/portfolio-single-6' );
                break;
            case 'type-7':
                get_template_part( 'tpls/portfolio-single-7' );
                break;
        }
    endwhile; 
endif;
?>

</div> <!-- End of container -->

<?php get_footer(); ?>
