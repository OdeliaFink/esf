<?php get_header(); ?>

<?php
// Detect the current language (use query string or cookie)
$language = isset($_GET['lang']) ? $_GET['lang'] : (isset($_COOKIE['lang']) ? $_COOKIE['lang'] : 'en');
?>

<div class="team-member-detail">
    <?php
    if (have_posts()) : 
        while (have_posts()) : the_post();
            // Get full name (same for both languages)
            $full_name = get_field('full_name'); 
            
            // Get job position and description based on the selected language
            $job_position = get_field('job_position_' . $language); 
            $description = get_field('description_' . $language); 

            // Check if job position and description exist to avoid errors
            if (empty($job_position)) {
                $job_position = 'Job position not available'; // Fallback in case data is missing
            }
            if (empty($description)) {
                $description = 'Description not available'; // Fallback in case data is missing
            }

            // Use the photo URL (same for both languages)
            $photo_url = get_field('photo');

            // Handle if the photo is empty
            if (!$photo_url) {
                $photo_url = 'path/to/default-image.jpg'; // Replace with a path to a default image
            }
            ?>
            
            <div class="team-member-content">
                <div class="team-member-info">
                    <h2><?php echo esc_html($job_position); ?></h2>
                    <h1><?php echo esc_html($full_name); ?></h1> <!-- Full Name is the same for both languages -->
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
