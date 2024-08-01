<?php
get_header();
?>

<div class="portfolio-grid">
    <?php
    $args = array(
        'post_type' => 'team_member',
        'posts_per_page' => -1
    );
    $team_query = new WP_Query($args);

    if ($team_query->have_posts()) :
        while ($team_query->have_posts()) : $team_query->the_post();
            // Your team member grid item markup
            ?>
            <div class="team-member-item">
                <a href="<?php the_permalink(); ?>">
                    <?php the_post_thumbnail(); ?>
                    <h2><?php the_title(); ?></h2>
                </a>
            </div>
            <?php
        endwhile;
        wp_reset_postdata();
    else :
        echo '<p>No team members found</p>';
    endif;
    ?>
</div>

<?php
get_footer();
?>
