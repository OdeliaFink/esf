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


<?php
$translations = load_translation_file();
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
        $release_year = get_field('year_released');
        $award_1 = get_field('award_1');
        $award_2 = get_field('award_2');
        $award_3 = get_field('award_3');
        $award_4 = get_field('award_4');
        $award_5 = get_field('award_5');
        $award_6 = get_field('award_6');
        $award_7 = get_field('award_7');
        $trailer_url = get_field('trailer_url');
        $rent_link = get_field('rent_link');
        $film_rental_header = get_field('film_rental_header');
        $instagram_url = get_field('instagram_url');
        $youtube_url = get_field('youtube_url');
        $vimeo_url = get_field('vimeo_url');
        $synopsis_text = get_field('synopsis_text');
       
   
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

    <div class="synopsis-container">
        <!-- <div>
            <p class="synopsis-heading">SYNOPSIS</p>
        </div> -->
        <?php if($synopsis_text) :  ?>
        <div class="">
        <p class="synopsis-text">
        <?php echo esc_html($synopsis_text); ?>
        </p>
        </div>
        <?php endif; ?>
     
    </div>


<div class="laurel-carousel-wrapper">
    <div class="laurel-carousel">
        <div class="laurel-slide">      <?php if ($award_1): ?><img src="<?php echo esc_url($award_1['url']); ?>" alt="<?php echo esc_attr($award_1['alt']); ?>"><?php endif; ?></div>
        <div class="laurel-slide">      <?php if ($award_2): ?><img src="<?php echo esc_url($award_2['url']); ?>" alt="<?php echo esc_attr($award_2['alt']); ?>"><?php endif; ?></div>
        <div class="laurel-slide">      <?php if ($award_3): ?><img src="<?php echo esc_url($award_3['url']); ?>" alt="<?php echo esc_attr($award_3['alt']); ?>"><?php endif; ?></div>
        <div class="laurel-slide">      <?php if ($award_4): ?><img src="<?php echo esc_url($award_4['url']); ?>" alt="<?php echo esc_attr($award_4['alt']); ?>"><?php endif; ?></div>
        <div class="laurel-slide">      <?php if ($award_5): ?><img src="<?php echo esc_url($award_5['url']); ?>" alt="<?php echo esc_attr($award_5['alt']); ?>"><?php endif; ?></div>
        <div class="laurel-slide">      <?php if ($award_6): ?><img src="<?php echo esc_url($award_6['url']); ?>" alt="<?php echo esc_attr($award_6['alt']); ?>"><?php endif; ?></div>
        <div class="laurel-slide">      <?php if ($award_7): ?><img src="<?php echo esc_url($award_7['url']); ?>" alt="<?php echo esc_attr($award_7['alt']); ?>"><?php endif; ?></div>

       
    </div>
</div>


<!-- <div class="centered-border-line">
    <div class="line"></div>
</div> -->

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
                <iframe src="<?php echo esc_url($trailer_url); ?>" width="500" height="225" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
            <?php endif; ?>
        <?php else: ?>
            <p>Trailer URL is not supported for embedding.</p>
        <?php endif; ?>
    </div>
<?php endif; ?>



<div>
    <!-- Rent Link Button -->
    <?php if ($rent_link): ?>
    <?php 
    // Define the URL for the Vimeo logo
    $vimeo_logo = "http://esf.local/wp-content/uploads/2024/08/Vimeo_logo.png"; 
    ?>
    <div class="film-rental-container">
        <h1 class="film-rental-h1">
            <a class=" film-rental-link" href=<?php echo esc_html($rent_link); ?> target="_blank" rel="noopener noreferrer">
                <?php echo esc_html($film_rental_header); ?>
                <!-- Inline SVG for the new tab icon -->
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-external-link">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
            </a>
        </h1>
       
         
   
    </div>
    <div style="width: 79.5%; margin-inline: auto;">
    <?php if (!empty($instagram_url) || !empty($vimeo_url)) { ?>
        <div class="social-media-icons">
            <ul style="">
                <?php if (!empty($instagram_url)) { ?>
                    <li>
                        <a href="<?php echo esc_url($instagram_url); ?>" target="_blank" rel="noopener noreferrer">
                            <img class="" src="http://esf.local/wp-content/uploads/2024/09/free-instagram-logo-icon-3497-thumb.png" alt="Instagram" />
                        </a>
                    </li>
                <?php } ?>

                <?php if (!empty($vimeo_url)) { ?>
                    <li>
                        <a href="<?php echo esc_url($vimeo_url); ?>" target="_blank" rel="noopener noreferrer">
                            <img src="http://esf.local/wp-content/uploads/2024/10/icons8-web-64.png" alt="Vimeo" />
                        </a>
                    </li>
                <?php } ?>
            </ul>
        </div>
    <?php } ?>
</div>

<?php endif; ?>
</div>

<div class="movie-stills-slider">
    <?php 
    $image_number = 1;
    while( $image = get_field('image_' . $image_number) ) {
        if( $image ): ?>
            <div class="slick-slide" style="width: auto !important; ">
                <div class="image-container">
                    <img src="<?php echo esc_url($image['url']); ?>" alt="Movie Still <?php echo $image_number; ?>" />
                </div>

                <!-- <div class="image-container" style="background-image: url('<?php echo esc_url($image['url']); ?>');"></div> -->
            </div>
        <?php endif;
        $image_number++;
    }
    ?>
</div>

<?php if( have_rows('credits') ): ?>
  <div class="credits-section">
    <div class="credits-container">
      <h2 style="margin-top: 1.3rem;">Credits</h2>
      <div class="credits">
        <?php while( have_rows('credits') ): the_row(); 
          // Get the role name and member names
          $role_name = get_sub_field('role_name');
          $member_name = get_sub_field('member_name');
        ?>
        <div class="credits-row">
          <div class="role"><?php echo esc_html($role_name); ?></div>
          <div class="name"><?php echo esc_html($member_name); ?></div>
        </div>
        <?php endwhile; ?>
      </div>
    </div>
  </div>
<?php endif; ?>




<div class="accordion-container">
    <?php
    // Accordion fields setup
    $accordion_fields = array(
        'awards' => array(
            'heading' => __($translations['awards']),
        ),
        'screenings' => array(
            'heading' => __($translations['screenings']),
        ),
        'press' => array(
            'heading' => __($translations['press']),
        )
    );

    // Loop through accordion fields
    foreach ($accordion_fields as $key => $field) :
        $content_class = ($key === 'awards' || $key === 'screenings' || $key === 'press') ? 'accordion-content ' . $key . '-content' : 'accordion-content';

        // Awards Section
        if ($key === 'awards' && have_rows('awards_name')) : ?>
            <div class="accordion-item">
                <div class="accordion-header">
                    <span><?php echo esc_html($field['heading']); ?></span>
                    <i class="accordion-icon fa fa-long-arrow-right" aria-hidden="true"></i>
                </div>
                <div class="<?php echo esc_attr($content_class); ?>">
                    <div class="awards-grid">
                        <?php
                        // Initialize counter and column
                        $row_counter = 0;
                        echo '<div class="awards-column">';

                        // Loop through the ACF repeater field 'awards_name'
                        while (have_rows('awards_name')) : the_row();
                            $award_name = get_sub_field('award_name');
                            
                            if (!empty($award_name)) :
                                // Display the award
                                echo '<div class="awards-row"><p><i class="fa-regular fa-star"></i> ' . esc_html($award_name) . '</p></div>';

                                // Increment row counter
                                $row_counter++;

                                // Start new column after 5 rows
                                if ($row_counter % 5 == 0) {
                                    echo '</div><div class="awards-column">';
                                }
                            endif;
                        endwhile;

                        // Close last column
                        echo '</div>';
                        ?>
                    </div> <!-- End of awards-grid -->
                </div> <!-- End of accordion-content -->
            </div> <!-- End of accordion-item -->

        <!-- Screenings Section -->
        <?php elseif ($key === 'screenings' && have_rows('screenings')) : ?>
            <div class="accordion-item">
                <div class="accordion-header">
                    <span><?php echo esc_html($field['heading']); ?></span>
                    <i class="accordion-icon fa fa-long-arrow-right" aria-hidden="true"></i>
                </div>
                <div class="<?php echo esc_attr($content_class); ?>">
                    <div class="screenings-grid">
                        <?php
                        // Initialize counter and column
                        $row_counter = 0;
                        echo '<div class="screenings-column">';

                        // Loop through the ACF repeater field 'screenings'
                        while (have_rows('screenings')) : the_row();
                            $screening_name = get_sub_field('screening_name');
                            
                            if (!empty($screening_name)) :
                                // Display the screening
                                echo '<div class="screenings-row"><p> ' . esc_html($screening_name) . '</p></div>';

                                // Increment row counter
                                $row_counter++;

                                // Start new column after 5 rows
                                if ($row_counter % 5 == 0) {
                                    echo '</div><div class="screenings-column">';
                                }
                            endif;
                        endwhile;

                        // Close last column
                        echo '</div>';
                        ?>
                    </div> <!-- End of screenings-grid -->
                </div> <!-- End of accordion-content -->
            </div> <!-- End of accordion-item -->

        <!-- Press Section -->
        <?php elseif ($key === 'press' && have_rows('press_quote')) : ?>
            <div class="accordion-item">
                <div class="accordion-header">
                    <span><?php echo esc_html($field['heading']); ?></span>
                    <i class="accordion-icon fa fa-long-arrow-right" aria-hidden="true"></i>
                </div>
                <div class="<?php echo esc_attr($content_class); ?>">
                <div class="press-quotes-grid">
    <?php
    // Loop through the ACF repeater field 'press_quote'
    while (have_rows('press_quote')) : the_row();
        $quote_content = get_sub_field('quote_content');  // Get the quote content
        $quote_source = get_sub_field('quote_source');    // Get the quote source
        
        if (!empty($quote_content)) : ?>
            <div class="press-quote-item">
                <!-- Wrap the quote content in a <p> tag -->
                <p class="quote-content">
                    <span class="quote-marks">❛</span>
                    <?php echo esc_html($quote_content); ?>
                    <span class="quote-marks">❜</span>
                </p>
                <!-- Quote source -->
                <?php if (!empty($quote_source)) : ?>
                    <p class="quote-source">— <?php echo esc_html($quote_source); ?></p>
                <?php endif; ?>
            </div>
        <?php endif;
    endwhile;
    ?>
</div>

                </div> <!-- End of accordion-content -->
            </div> <!-- End of accordion-item -->

        <?php endif;
    endforeach;
    ?>
</div>







<?php if (!empty($presskit = get_field('presskit'))) { ?>
    <div class="presskit-wrapper">
        <div class="download-presskit">
            <button class="presskit-button" style="">
                <a class="presskit-content" href="<?php echo esc_url($presskit); ?>" download>
                    <?php echo $translations['download_presskit']; ?>
                </a>
            </button>
        </div>
    </div>
<?php } ?>


<?php 
// Check if the 'email' repeater field has rows of data
if ( have_rows('email') ) : ?>
    <div class="contact-columns-wrapper">
        <?php 
        while ( have_rows('email') ) : the_row(); 
            $email_heading = get_sub_field('email_heading');
            $email_address = get_sub_field('email_address');
            
            if ( $email_heading && $email_address ) : ?>
                <div class="contact-column">
                    <h3 class="email-heading"><?php echo esc_html($email_heading); ?></h3>
                    <ul class="email-list">
                        <li class="email-item">
                            <span class="arrow">➔</span>
                            <a href="mailto:<?php echo esc_attr($email_address); ?>"><?php echo esc_html($email_address); ?></a>
                        </li>
                    </ul>
                </div>
            <?php endif; ?>
        <?php endwhile; ?>
    </div>
<?php endif; ?>







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
