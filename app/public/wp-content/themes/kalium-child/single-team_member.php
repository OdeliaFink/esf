<?php get_header(); ?>

<div class="team-member-detail">
    <?php
    if (have_posts()) : 
        while (have_posts()) : the_post();
            $full_name = get_field('full_name');
            $job_position = get_field('job_position');
            
            // Use the photo URL directly
            $photo_url = get_field('photo'); 

            // Handle if photo is empty
            if (!$photo_url) {
                $photo_url = 'path/to/default-image.jpg'; // Replace with a path to a default image
            }

            $description = get_field('description'); // Assuming you have a description field
            ?>
            
            <div class="team-member-content">
                <div class="team-member-info">
                    <h2><?php echo esc_html($job_position); ?></h2>
                    <h1><?php echo esc_html($full_name); ?></h1>
                    <div class="team-member-description">
                        <?php echo wp_kses_post($description); ?>
                    </div>
                </div>
                <div class="team-member-photo">
                    <img src="<?php echo esc_url($photo_url); ?>" alt="<?php echo esc_attr($full_name); ?>">
                </div>
            </div>
            
        <?php endwhile;
    else :
        echo '<p>Team member not found.</p>';
    endif;
    ?>
</div>

<?php get_footer(); ?>
