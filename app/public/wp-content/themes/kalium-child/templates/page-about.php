<?php
/* Template Name: About Page */

get_header(); 

// Detect the current language (use query string or cookie)
$language = isset($_GET['lang']) ? $_GET['lang'] : (isset($_COOKIE['lang']) ? $_COOKIE['lang'] : 'en');

// Load the JSON translation file (for static content)
$translations = load_translation_file();
?>

<!-- Display Upper Content Description -->
<div class="upper-content-desc">
    <?php
    // Display upper content description based on the selected language
    $upper_content_desc = get_field('upper_content_desc_' . $language); 
    if ($upper_content_desc) {
        echo wp_kses_post($upper_content_desc); 
    }
    ?>
</div>

<!-- Display Lower Content Description -->
<div class="lower-content-desc">
    <?php
    // Display lower content description based on the selected language
    $lower_content_desc = get_field('lower_content_desc_' . $language); 
    if ($lower_content_desc) {
        echo wp_kses_post($lower_content_desc); 
    }
    ?>
</div>

<!-- Display Our Team Heading -->
<div class="our-team-heading">
    <?php
    // Display the team heading based on the language
    echo '<h2>' . esc_html($translations['team']) . '</h2>';
    ?>
</div>

<!-- Team Member Grid -->
<div class="team-grid">
    <?php
    $args = array(
        'post_type' => 'team_member', 
        'posts_per_page' => -1
    );
    $team = new WP_Query($args);

    if ($team->have_posts()) :
        while ($team->have_posts()) : $team->the_post(); 
            // Get team member fields based on the selected language
            $full_name = get_field('full_name_' . $language); 
            $job_position = get_field('job_position_' . $language); 
            $photo = get_field('photo'); // Assuming the photo doesn't need translation
            $link = get_permalink(); 
            ?>
            
            <div class="team-member">
                <a href="<?php echo esc_url($link); ?>" class="image-single-member">
                    <img src="<?php echo esc_url($photo); ?>" alt="<?php echo esc_attr($full_name); ?>">
                    <span class="arrow-icon">&#xf061;</span>
                </a>
                <h3><?php echo esc_html($full_name); ?></h3>
                <p><?php echo esc_html($job_position); ?></p>
            </div>
            
        <?php endwhile;
        wp_reset_postdata();
    else :
        echo '<p>No team members found.</p>';
    endif;
    ?>
</div>

<?php get_footer(); ?>
