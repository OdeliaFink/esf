<?php
/**
 * Kalium WordPress Theme
 *
 * Laborator.co
 * www.laborator.co
 */
if (!defined('ABSPATH')) {
    exit; // Direct access not allowed.
}

$item_type = kalium_get_field('item_type');

$language = isset($_GET['lang']) ? $_GET['lang'] : (isset($_COOKIE['lang']) ? $_COOKIE['lang'] : 'en');

if (kalium_get_field('item_linking') == 'external') {
    $launch_link_href = kalium_get_field('launch_link_href');

    if ($launch_link_href) {
        if ($launch_link_href != '#') {
            wp_redirect($launch_link_href, 301);
            exit;
        } else {
            
            $include_categories = kalium_get_theme_option('portfolio_prev_next_category') ? true : false;

            $prev = get_next_post($include_categories, '', 'portfolio_category');
            $next = get_previous_post($include_categories, '', 'portfolio_category');

            if (!empty($next)) {
                wp_redirect(get_permalink($next));
            } else if (!empty($prev)) {
                wp_redirect(get_permalink($prev));
            }
            exit;
        }
    }
}

if (kalium_get_theme_option('portfolio_disable_lightbox')) {
    kalium()->helpers->add_body_class('lightbox-disabled');
}

get_header();
?>


<?php
$translations = load_translation_file();
?>

<div class="film-item">

    <?php
    // Portfolio content
    if (have_posts()):
        while (have_posts()):
            the_post();

            // Post password
            if (post_password_required()) {
                ?>
                <div class="container password-protected-portfolio-item">
                    <div class="row">
                        <div class="col-sm-12">
                            <?php echo get_the_password_form(); ?>
                        </div>
                    </div>
                </div>
                <?php
                continue;
            }

            $hero_image = get_field('hero_image');
            $film_title = get_field('film_title');
            $director_name = get_field('director_name');
            $release_year = get_field('year_released');
            $trailer_url = get_field('trailer_url');
            $rent_link = get_field('rent_link');
            $film_rental_header = get_field('film_rental_header');
            $instagram_url = get_field('instagram_url');
            $website_url = get_field('website_url');
            $synopsis_text = get_field('synopsis_text');


            ?>
            <div class="hero-section">
                <?php if ($hero_image): ?>
                    <div class="hero-image" style="background-image: url('<?php echo esc_url($hero_image['url']); ?>');">
                        <div class="hero-overlay">
                            <div class="hero-text">
                                <h1>
                                    <?php echo esc_html($film_title); ?>
                                </h1>

                            </div>
                        </div>
                    </div>
                <?php endif; ?>
                <div class="director-year">
                    <p>
                        <?php echo esc_html($director_name); ?>
                    </p>
                    <p>
                        <?php echo esc_html($release_year); ?>
                    </p>
                </div>
            </div>

            <div class="synopsis-container">
                <?php
                $synopsis_text = get_field('synopsis_text_' . $language); // Language-specific synopsis
        
                if ($synopsis_text): ?>
                    <p class="synopsis-text">
                        <?php echo esc_html($synopsis_text); ?>
                    </p> <!-- Synopsis Text -->
                <?php endif; ?>
            </div>


            <div class="laurel-carousel-wrapper">
                <div class="laurel-carousel">
                    <?php if (have_rows('awards')): ?>
                        <?php while (have_rows('awards')):
                            the_row(); ?>
                            <?php
                            // Get the sub field (award image) inside the repeater
                            $award_image = get_sub_field('awards_image');
                            if ($award_image): ?>
                                <div class="laurel-slide">
                                    <img src="<?php echo esc_url($award_image['url']); ?>"
                                        alt="<?php echo esc_attr($award_image['alt']); ?>">
                                </div>
                            <?php endif; ?>
                        <?php endwhile; ?>
                    <?php endif; ?>
                </div>
            </div>


            <!-- Embed the Trailer -->
            <?php if ($trailer_url):
                // Function to get YouTube video ID from URL
                function get_youtube_id($url)
                {
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
                            <iframe width="560" height="315" src="<?php echo esc_url($youtube_embed_url); ?>" frameborder="0"
                                allowfullscreen></iframe>
                        <?php else: ?>
                            <!-- Handle Vimeo URL here -->
                            <iframe src="<?php echo esc_url($trailer_url); ?>" width="500" height="225" frameborder="0"
                                allow="autoplay; encrypted-media" allowfullscreen></iframe>
                        <?php endif; ?>
                    <?php else: ?>
                        <p>Trailer URL is not supported for embedding.</p>
                    <?php endif; ?>
                </div>
            <?php endif; ?>



            <div>
                <!-- Rent Link Button -->
                <?php if ($rent_link): ?>
                    <div class="film-rental-container">
                        <h1 class="film-rental-h1">
                            <?php $film_rental_header = get_field('film_rental_header_' . $language); ?>
                            <a class=" film-rental-link" href=<?php echo esc_html($rent_link); ?> target="_blank"
                                rel="noopener noreferrer">
                                <?php
                                // Display the rental header if it exists
                                if ($film_rental_header) {
                                    echo esc_html($film_rental_header);
                                }
                               
                            
                                if ($film_rental_header) {
                                    ?>
                             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                    class="feather feather-external-link">
                                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                    <polyline points="15 3 21 3 21 9"></polyline>
                                    <line x1="10" y1="14" x2="21" y2="3"></line>
                                </svg> <?php    
                            }
                               
                               
                                ?>
                            </a>
                        </h1>
                    </div>


                    <div style="width: 79.5%; margin-inline: auto;">
                        <?php if (!empty($instagram_url) || !empty($website_url)) { ?>
                            <div class="social-media-icons">
                                <ul style="">
                                    <?php if (!empty($instagram_url)) { ?>
                                        <li>
                                            <a href="<?php echo esc_url($instagram_url); ?>" target="_blank" rel="noopener noreferrer">
                                                <img class=""
                                                    src="http://esf.local/wp-content/uploads/2024/09/free-instagram-logo-icon-3497-thumb.png"
                                                    alt="Instagram" />
                                            </a>
                                        </li>
                                    <?php } ?>

                                    <?php if (!empty($website_url)) { ?>
                                        <li>
                                            <a href="<?php echo esc_url($website_url); ?>" target="_blank" rel="noopener noreferrer">
                                                <img src="http://esf.local/wp-content/uploads/2024/10/icons8-web-64.png" alt="Web" />
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
                while ($image = get_field('image_' . $image_number)) {
                    if ($image): ?>
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

            <?php if (have_rows('credits')): ?>
    <div class="credits-section">
        <div class="credits-container">
            <h2 style="margin-top: 1.3rem; font-size: 23px;"> <?php echo $translations['credits']; ?></h2>
            <div class="credits">
                <?php while (have_rows('credits')): the_row();
                    // Dynamically get the role name based on the language
                    $role_name = get_sub_field('role_name_' . $language); 
                    
                    // Member name stays the same
                    $member_name = get_sub_field('member_name');
                    ?>
                    <div class="credits-row">
                        <div class="role">
                            <?php echo esc_html($role_name); ?>
                        </div>
                        <div class="name">
                            <?php echo esc_html($member_name); ?>
                        </div>
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
            'heading' => __($translations['awards']), // Language-specific heading for awards
        ),
        'screenings' => array(
            'heading' => __($translations['screenings']), // Language-specific heading for screenings
        ),
        'press' => array(
            'heading' => __($translations['press']), // Language-specific heading for press
        )
    );

    // Loop through accordion fields
    foreach ($accordion_fields as $key => $field):
        $content_class = 'accordion-content ' . $key . '-content';

        // Awards Section
        if ($key === 'awards' && have_rows('awards_name')): ?>
            <div class="accordion-item">
                <div class="accordion-header">
                    <span><?php echo esc_html($field['heading']); ?></span>
                    <i class="accordion-icon fa fa-long-arrow-right" aria-hidden="true"></i>
                </div>
                <div class="<?php echo esc_attr($content_class); ?>">
                    <div class="awards-grid">
                        <?php
                        $row_counter = 0;
                        echo '<div class="awards-column">';
                        while (have_rows('awards_name')):
                            the_row();
                            // Dynamically load award name based on the selected language
                            $award_name = get_sub_field('award_name_' . $language); 

                            if (!empty($award_name)):
                                echo '<div class="awards-row"><p><i class="fa-regular fa-star"></i> ' . esc_html($award_name) . '</p></div>';
                                $row_counter++;

                                // Start new column after 5 rows
                                if ($row_counter % 5 == 0) {
                                    echo '</div><div class="awards-column">';
                                }
                            endif;
                        endwhile;
                        echo '</div>'; // Close last column
                        ?>
                    </div> <!-- End of awards-grid -->
                </div> <!-- End of accordion-content -->
            </div> <!-- End of accordion-item -->

        <!-- Screenings Section -->
        <?php elseif ($key === 'screenings' && have_rows('screenings')): ?>
            <div class="accordion-item">
                <div class="accordion-header">
                    <span><?php echo esc_html($field['heading']); ?></span>
                    <i class="accordion-icon fa fa-long-arrow-right" aria-hidden="true"></i>
                </div>
                <div class="<?php echo esc_attr($content_class); ?>">
                    <div class="screenings-grid">
                        <?php
                        $row_counter = 0;
                        echo '<div class="screenings-column">';

                        while (have_rows('screenings')):
                            the_row();
                            // Dynamically load screening name based on the selected language
                            $screening_name = get_sub_field('screening_name_' . $language); 

                            if (!empty($screening_name)):
                                echo '<div class="screenings-row"><p> ' . esc_html($screening_name) . '</p></div>';
                                $row_counter++;

                                // Start new column after 5 rows
                                if ($row_counter % 10 == 0) {
                                    echo '</div><div class="screenings-column">';
                                }
                            endif;
                        endwhile;

                        echo '</div>'; // Close last column
                        ?>
                    </div> <!-- End of screenings-grid -->
                </div> <!-- End of accordion-content -->
            </div> <!-- End of accordion-item -->

        <!-- Press Section -->
        <?php elseif ($key === 'press' && have_rows('press_quote')): ?>
            <div class="accordion-item">
                <div class="accordion-header">
                    <span><?php echo esc_html($field['heading']); ?></span>
                    <i class="accordion-icon fa fa-long-arrow-right" aria-hidden="true"></i>
                </div>
                <div class="<?php echo esc_attr($content_class); ?>">
                    <div class="press-quotes-grid">
                        <?php
                        // Loop through the ACF repeater field 'press_quote'
                        while (have_rows('press_quote')):
                            the_row();
                            // Dynamically load quote content based on the selected language
                            $quote_content = get_sub_field('quote_content_' . $language);  
                            $quote_source = get_sub_field('quote_source');    // Same for all languages

                            if (!empty($quote_content)): ?>
                                <div class="press-quote-item">
                                    <p class="quote-content">
                                        <span class="quote-marks">❛</span>
                                        <?php echo esc_html($quote_content); ?>
                                        <span class="quote-marks">❜</span>
                                    </p>
                                    <?php if (!empty($quote_source)): ?>
                                        <p class="quote-source">— <?php echo esc_html($quote_source); ?></p>
                                    <?php endif; ?>
                                </div>
                            <?php endif;
                        endwhile;
                        ?>
                    </div> <!-- End of press-quotes-grid -->
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


            <?php if (have_rows('email')): ?>
    <div class="contact-columns-wrapper">
        <?php while (have_rows('email')): the_row();
            // Dynamically get the email heading based on the selected language
            $email_heading = get_sub_field('email_heading_' . $language); 
            $email_address = get_sub_field('email_address'); // Same email address for all languages

            if ($email_heading && $email_address): ?>
                <div class="contact-column">
                    <h3 class="email-heading">
                        <?php echo esc_html($email_heading); ?> <!-- Language-specific email heading -->
                    </h3>
                    <ul class="email-list">
                        <li class="email-item">
                            <span class="arrow">➔</span>
                            <a href="mailto:<?php echo esc_attr($email_address); ?>">
                                <?php echo esc_html($email_address); ?> <!-- Email address remains the same -->
                            </a>
                        </li>
                    </ul>
                </div>
            <?php endif; ?>
        <?php endwhile; ?>
    </div>
<?php endif; ?>



            <?php
            // Portfolio item type layout
            switch ($item_type) {
                case 'type-1':
                    get_template_part('tpls/portfolio-single-1');
                    break;
                case 'type-2':
                    get_template_part('tpls/portfolio-single-2');
                    break;
                case 'type-3':
                    get_template_part('tpls/portfolio-single-3');
                    break;
                case 'type-4':
                    get_template_part('tpls/portfolio-single-4');
                    break;
                case 'type-5':
                    get_template_part('tpls/portfolio-single-5');
                    break;
                case 'type-6':
                    get_template_part('tpls/portfolio-single-6');
                    break;
                case 'type-7':
                    get_template_part('tpls/portfolio-single-7');
                    break;
            }
        endwhile;
    endif;
    ?>

</div> <!-- End of container -->

<?php get_footer(); ?>