<?php
get_header();

// Custom query to display team members
if (have_posts()) :
    while (have_posts()) : the_post();
        // Display content or template part for team members
        get_template_part('template-parts/content', 'team_member');
    endwhile;

    // Pagination
    the_posts_pagination();

else :
    echo '<p>No team members found.</p>';
endif;

get_footer();
