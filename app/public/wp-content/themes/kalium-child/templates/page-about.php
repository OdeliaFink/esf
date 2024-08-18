<?php
/* Template Name: About Page */

get_header(); ?>

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
                <a href="<?php echo esc_url($link); ?>">
                    <img src="<?php echo esc_url($photo); ?>" alt="<?php echo esc_attr($full_name); ?>">
                    <h3><?php echo esc_html($full_name); ?></h3>
                    <p><?php echo esc_html($job_position); ?></p>
                </a>
            </div>
            
        <?php endwhile;
        wp_reset_postdata();
    else :
        echo '<p>No team members found.</p>';
    endif;
    ?>
</div>

<?php get_footer(); ?>
