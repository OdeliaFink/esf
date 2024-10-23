<?php
/**
 * Kalium WordPress Theme
 *
 * Laborator.co
 * www.laborator.co
 *
 * @deprecated 3.0 This template file will be removed or replaced with new one in templates/ folder.
 */
if (!defined('ABSPATH')) {
    exit; // Direct access not allowed.
}


global $portfolio_args, $wp_query;

// Make the portfolio query
$portfolio_query_args = array();

if (!empty($wp_query->query['pagename'])) {
    $portfolio_query_args['post_id'] = $wp_query->query['pagename'];
} else if (is_front_page()) {
    $portfolio_query_args['post_id'] = get_option('page_on_front');
} else if (is_page()) {
    $portfolio_query_args['post_id'] = get_queried_object_id();
}

// Get the 'Released' and 'Unreleased' terms
$released_term = get_term_by('slug', 'released', 'portfolio_category');
$unreleased_term = get_term_by('slug', 'unreleased', 'portfolio_category');


// Check if the terms exist and get their URLs
if ($released_term && !is_wp_error($released_term)) {
    $released_link = get_term_link($released_term);
}

if ($unreleased_term && !is_wp_error($unreleased_term)) {
    $unreleased_link = get_term_link($unreleased_term);
}

// Output the filter bar with the links


// Get Query and Args
$portfolio_args = kalium_get_portfolio_query($portfolio_query_args);
$portfolio_query = $portfolio_args['portfolio_query'];
$pagination = $portfolio_args['pagination'];

// Portfolio Container Class
$portfolio_container_classes = array();
$portfolio_container_classes[] = 'portfolio-holder';
$portfolio_container_classes[] = 'portfolio-' . $portfolio_args['layout_type'];

// Masonry Layout
if ($portfolio_args['layout_type'] == 'type-1' && $portfolio_args['layouts']['type_1']['dynamic_image_height'] || $portfolio_args['layout_type'] == 'type-2') {
    $portfolio_container_classes[] = 'is-masonry-layout';
}

// Merged Layout
if ($portfolio_args['layout_type'] == 'type-2' && $portfolio_args['layouts']['type_2']['grid_spacing'] == 'merged') {
    $portfolio_container_classes[] = 'merged-item-spacing';
}

// Sort items by clicking on the category (under title)
if (apply_filters('portfolio_container_isotope_category_sort_by_js', true)) {
    $portfolio_container_classes[] = 'sort-by-js';
}

// Item Spacing
if ($portfolio_args['layout_type'] == 'type-2' && $portfolio_args['layouts']['type_2']['grid_spacing'] == 'normal' && is_numeric($portfolio_args['layouts']['type_2']['default_spacing'])) {
    $spacing_in_px = $portfolio_args['layouts']['type_2']['default_spacing'] / 2 . 'px';
    $portfolio_container_classes[] = 'portfolio-loop-custom-item-spacing';

    kalium_append_custom_css('.page-container > .row', "margin: 0 -" . $spacing_in_px);
    kalium_append_custom_css('.portfolio-holder.portfolio-loop-custom-item-spacing .type-portfolio[data-portfolio-item-id]', "padding: {$spacing_in_px};");
    kalium_append_custom_css('.portfolio-holder .portfolio-item.masonry-portfolio-item.has-post-thumbnail .masonry-box .masonry-thumb', "margin: {$spacing_in_px};");
}

// Show Taxonomy Title and Description for Portfolio Category
if (is_tax('portfolio_category') || is_tax('portfolio_tag')) {
    $term = get_queried_object();
    $portfolio_args['title'] = $term->name;
    $portfolio_args['description'] = $term->description;
}

// Container
$classes = array();
$classes[] = 'portfolio-container-and-title';
$classes[] = 'portfolio-loop-layout-' . $portfolio_args['layout_type'];

// Portfolio archive page
if (!$portfolio_args['vc_mode']) {
    if ($portfolio_args['fullwidth']) {
        $classes[] = 'container-fullwidth';
    } else {
        $classes[] = 'container';
    }
}
?>
<div id="<?php echo $portfolio_args['id']; ?>-container" <?php kalium_class_attr($classes); ?>>

    <div class="page-container">
        <div class="row">
        <?php
        if (!is_page('films')): ?>
        <div>
            <p style="font-size: 1.8rem; font-weight: 300; max-width: 70%; margin-inline: auto; color: black; margin-bottom: 3rem;">
                EYESTEELFILM DISTRIBUTION distributes not only films in its wheelhouse but also partners with productions that align with the company's varied interests and values. With a high value on cinematic excellence, the company intentionally distributes films using an impact distribution model. The company’s success in distribution comes from years of experience in both the film industry and in community and relationship building. Eyesteelfilm Distribution has an impressive track record of admittance into numerous notable film festivals and has accumulated many prestigious awards. The company has secured many acquisitions with prominent broadcasters and streamers. The company executes nationwide theatrical runs and manages impact and educational campaigns.
            </p>
        </div>
<?php else: ?>
        <div class="film-filters">
      <button id="filter-film-btn" data-filter="released">Released</button>
      <button id="filter-film-btn" data-filter="coming-soon">Coming Soon</button>
      <button id="filter-film-btn" data-filter="all">All</button>
    </div>

    <div id="released-items"></div>
    <div id="coming-soon-items"></div>



<?php endif; ?>


<div class="custom-search-bar">
    <input type="text" id="search-input" placeholder="...">
</div>

<?php do_action('kalium_portfolio_items_before', $portfolio_query); ?>

<div id="<?php echo $portfolio_args['id']; ?>" class="<?php echo implode(' ', apply_filters('kalium_portfolio_container_classes', $portfolio_container_classes)); ?>">
    <?php kalium_portfolio_loop_items_show($portfolio_args); ?>
</div>

<script>
document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('search-input');
    const portfolioItemsContainer = document.getElementById('<?php echo $portfolio_args['id']; ?>');
    let portfolioItems = Array.from(portfolioItemsContainer.querySelectorAll('.portfolio-item'));
    let currentFilteredItems = portfolioItems; // Global filtered items that both buttons and search will interact with

    const portfolioPage = document.querySelectorAll(".portfolio-container-and-title");
    const originalContent = portfolioItemsContainer.innerHTML;

    console.log("originalContent", originalContent);

    // Fallback message element for no items found
    const noItemsMessage = document.createElement('div');
    noItemsMessage.textContent = 'No items found.';
    noItemsMessage.style.display = 'none'; // Initially hidden
    noItemsMessage.style.color = 'black'; // Add some styling if needed
    noItemsMessage.style.textAlign = 'left'; // Center the message
    portfolioItemsContainer.parentElement.appendChild(noItemsMessage); // Append outside of the portfolio items container

    if (portfolioPage.length > 0) {
        var filterButtons = document.querySelectorAll('.film-filters button');
        console.log(filterButtons, 'filter buttons');

        // Add event listeners to the filter buttons
        filterButtons.forEach(function (button) {
            button.addEventListener('click', function () {
                var filter = this.getAttribute('data-filter');
                console.log('Filter button clicked: ' + filter);

                // Fetch the portfolio data via the REST API
                fetch('http://esf.local/wp-json/wp/v2/portfolio?per_page=100')
                    .then(response => response.json())
                    .then(data => {
                        // Filter items based on the release_status using the API data
                        const releasedItemsIds = data.filter(item => item.acf.release_status === 'released').map(item => item.id);
                        const comingSoonItemsIds = data.filter(item => item.acf.release_status === 'coming-soon').map(item => item.id);

                        console.log(releasedItemsIds, "releasedItems");
                        console.log(comingSoonItemsIds, "coming soon items");

                        // Clear the portfolio container
                        portfolioItemsContainer.innerHTML = '';

                        // Apply the filter for released or coming soon
                        if (filter === 'released') {
                            currentFilteredItems = portfolioItems.filter(item => {
                                const itemId = parseInt(item.getAttribute('data-portfolio-item-id'), 10);
                                return releasedItemsIds.includes(itemId); // Keep only released items
                            });
                        } else if (filter === 'coming-soon') {
                            currentFilteredItems = portfolioItems.filter(item => {
                                const itemId = parseInt(item.getAttribute('data-portfolio-item-id'), 10);
                                return comingSoonItemsIds.includes(itemId); // Keep only coming soon items
                            });
                        } else {
                            currentFilteredItems = portfolioItems; // Show all items if no filter is applied
                        }

                        // Check if there are any items to display
                        if (currentFilteredItems.length === 0) {
                            noItemsMessage.style.display = 'block'; // Show fallback message
                        } else {
                            noItemsMessage.style.display = 'none'; // Hide fallback message
                            // Append the filtered items to the portfolio container
                            currentFilteredItems.forEach(item => {
                                portfolioItemsContainer.appendChild(item);
                            });
                        }

                        // Reflow layout using Isotope or Masonry if applicable
                        if (typeof jQuery !== 'undefined' && typeof jQuery.fn.isotope !== 'undefined') {
                            jQuery(portfolioItemsContainer).isotope('reloadItems').isotope('layout'); // Ensure layout is recalculated
                        }
                    })
                    .catch(error => console.error('Error fetching portfolio data:', error));
            });
        });
    }

    // SEARCH FUNCTIONALITY
    if (searchInput && portfolioItems.length > 0) {
        searchInput.addEventListener('keyup', function () {
            const filterText = searchInput.value.toLowerCase();

            // Clear the portfolio container
            portfolioItemsContainer.innerHTML = '';

            if (filterText === '') {
                // If the search is cleared, restore the current filtered items
                currentFilteredItems.forEach(item => portfolioItemsContainer.appendChild(item));

                // Reflow the layout using Isotope or Masonry when the search is cleared
                if (typeof jQuery !== 'undefined' && typeof jQuery.fn.isotope !== 'undefined') {
                    jQuery(portfolioItemsContainer).isotope('reloadItems').isotope('layout'); // Ensure layout is recalculated
                }
            } else {
                // Filter items based on search text within the currently filtered items
                let filteredItems = currentFilteredItems.filter(item => {
                    const itemText = item.textContent.toLowerCase();
                    return itemText.includes(filterText);
                });

                // Check if there are any items to display
                if (filteredItems.length === 0) {
                    noItemsMessage.style.display = 'block'; // Show fallback message
                } else {
                    noItemsMessage.style.display = 'none'; // Hide fallback message
                    // Append the filtered items to the portfolio container
                    filteredItems.forEach(filteredItem => {
                        portfolioItemsContainer.appendChild(filteredItem);
                    });
                }

                // Reflow the layout using Isotope or Masonry for the filtered items
                if (typeof jQuery !== 'undefined' && typeof jQuery.fn.isotope !== 'undefined') {
                    jQuery(portfolioItemsContainer).isotope('reloadItems').isotope('layout'); // Ensure layout is recalculated
                }
            }
        });
    }
});

</script>




            <?php do_action('kalium_portfolio_items_before', $portfolio_query); ?>
            
            <div id="<?php echo $portfolio_args['id']; ?>" class="<?php echo implode(' ', apply_filters('kalium_portfolio_container_classes', $portfolio_container_classes)); ?>">
            
            
            </div>
            
            <?php do_action('kalium_portfolio_items_after'); ?>
            <?php
            if (is_page('distribution')): ?>
        <style>
            /* Disable pointer events on the distribution page for portfolio items */
            .portfolio-item a.item-link, .portfolio-item a.thumb-placeholder {
                pointer-events: none !important;
            }

            /* You can keep hover effects with this: */
            .portfolio-item:hover .item-link, .portfolio-item:hover .thumb-placeholder {
                pointer-events: auto;
            }
        </style>
        <script>
            document.addEventListener('DOMContentLoaded', function() {
                // Select all <a> elements within portfolio items
                var portfolioLinks = document.querySelectorAll('.portfolio-item a.item-link, .portfolio-item a.thumb-placeholder');

                // Loop through each <a> element and prevent the default behavior, as a backup to pointer-events
                portfolioLinks.forEach(function(link) {
                    link.addEventListener('click', function(event) {
                        event.preventDefault();
                                     // Prevent the default click action
                        console.log('Link click prevented'); // Log to ensure it's working
                    });
                                    link.setAttribute('href', '#');
                });
            });
                
        </script>
<?php endif; ?>
            <?php
            // Generate Portfolio Instance Object
            kalium_portfolio_generate_portfolio_instance_object($portfolio_args);

            // Portfolio Pagination
            switch ($pagination['type']) {
                // Portfolio Pagination
                case 'endless':
                case 'endless-reveal':
                    kalium_portfolio_endless_pagination($portfolio_args);
                    break;

                // Standard Pagination
                default:
                    $prev_icon = '<i class="flaticon-arrow427"></i>';
                    $prev_text = __('Previous', 'kalium');

                    $next_icon = '<i class="flaticon-arrow413"></i>';
                    $next_text = __('Next', 'kalium');

                    ?>
                            <div class="pagination-container align-<?php echo $pagination['align']; ?>">
                            <?php
                            $paginate_links_args = apply_filters('kalium_portfolio_pagination_args', array(
                                'mid_size' => 2,
                                'end_size' => 2,
                                'total' => $pagination['max_num_pages'],
                                'prev_text' => "{$prev_icon} {$prev_text}",
                                'next_text' => "{$next_text} {$next_icon}",
                            ));

                            if (is_front_page()) {
                                $paginate_links_args['current'] = $pagination['paged'];
                            }

                            echo paginate_links($paginate_links_args);
                            ?>
                            </div>
                        <?php
            }
            ?>
        </div>
    </div>

</div>