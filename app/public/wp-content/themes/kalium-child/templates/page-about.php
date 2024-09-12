<?php
/* Template Name: About Page */

get_header(); ?>

<?php
$translations = load_translation_file();
?>

<!-- Display Upper Content Description -->
<div class="upper-content-desc">
    <?php
    $upper_content_desc = get_field('upper_content_desc'); 
    if ($upper_content_desc) {
        echo wp_kses_post($upper_content_desc); 
    }
    ?>
</div>

<!-- Display Lower Content Description -->
<div class="lower-content-desc">
    <?php
    $lower_content_desc = get_field('lower_content_desc'); 
    if ($lower_content_desc) {
        echo wp_kses_post($lower_content_desc); 
    }
    ?>
</div>

<!-- Display Our Team Heading -->
<div class="our-team-heading">
    <?php
    $our_team_heading = get_field('our_team_heading'); 
    if ($our_team_heading) {
        echo '<h2>' . esc_html($translations['team']) . '</h2>'; 
    }
    ?>
</div>



<!-- Checking About Page Template -->

<div class="team-grid">
    <?php
    // Corrected the post type from 'team_members' to 'team_member'
    $args = array(
        'post_type' => 'team_member', // Ensure the post type matches your registered custom post type
        'posts_per_page' => -1
    );
    $team = new WP_Query($args);

    if ($team->have_posts()) :
        while ($team->have_posts()) : $team->the_post(); // Corrected variable name
            $full_name = get_field('full_name'); // Retrieves the full name from ACF
            $job_position = get_field('job_position'); // Retrieves the job position from ACF
            $photo = get_field('photo'); // Retrieves the photo from ACF
            $link = get_permalink(); 
            ?>
            
            <div class="team-member">
    <a href="<?php echo esc_url($link); ?>" class="image-single-member">
        <img src="<?php echo esc_url($photo); ?>" alt="<?php echo esc_attr($full_name); ?>">
        <span class="arrow-icon">&#xf061;</span> <!-- Arrow icon inside the link -->
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
