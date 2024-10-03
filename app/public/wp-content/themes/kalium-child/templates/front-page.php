<?php
/*
 * Template Name: Custom Homepage
 * Template Post Type: page
 */
get_header(); ?>
<!-- Preloader -->

<!-- Your Front Page Content -->
<script>
window.addEventListener('load', function () {
    const preloader = document.getElementById('preloader');
    const content = document.getElementById('content');

    // Wait for the animation to finish before hiding the preloader
    setTimeout(function () {
        preloader.style.display = 'none';
        content.style.display = 'block';
    }, 300); // Match the duration of the animation (0.8s)
});
</script>
<div id="preloader">
<i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
</div>


<?php
$translations = load_translation_file();
?>

<div class="main-container">
<script>
document.addEventListener('DOMContentLoaded', function () {
    const carousel = document.querySelector('.laurel-carousel');
    const slides = document.querySelectorAll('.laurel-slide');
    let slideWidth = slides[0] + parseInt(getComputedStyle(slides[0]).marginRight, 10);
    let currentPosition = 0;

    function scrollSlides() {
        currentPosition -= 1; // Adjust the speed here

        if (currentPosition <= -slideWidth) {
            carousel.appendChild(carousel.firstElementChild); // Move the first slide to the end
            currentPosition += slideWidth;
        }

        carousel.style.transform = `translateX(${currentPosition}px)`;
        requestAnimationFrame(scrollSlides); // Continuously call scrollSlides
    }

    scrollSlides();
});

document.addEventListener('DOMContentLoaded', function () {
    const video = document.querySelector('.video');
    const source = video.querySelector('source');

    // Create an Intersection Observer with a threshold of 0.5
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.intersectionRatio >= 0.5) {
                // If at least 50% of the video is visible, load and play it
                if (!source.src) {
                    source.src = source.dataset.src;
                    console.log('Video source set:', source.src); // Log the event
 // Lazy load the video
                    video.load();
                }
                video.play(); // Play when more than 50% of the video is visible
            } else {
                // Pause the video if less than 50% is visible
                video.pause();
            }
        });
    }, { threshold: 0.5 }); // Trigger when 50% of the video is in view

    observer.observe(video); // Start observing the video
});
</script>

    <div class="hero-container">
        <section class="hero-section-front">
    
            <video class="video" autoplay loop muted poster>
                <source data-src="http://esf.local/wp-content/uploads/2024/08/esf_webloop_v4-1080p-1.mp4" type="video/mp4">
                Your browser does not support the video tag.
            </video>
        </section>
    </div>
    <div class="app">
        <section>
            <div class="container-tagline container">
            <!-- <p class="reveal">EyeSteelFilm is a film and interactive media company dedicated to using cinematic expression as a
                catalyst for social and political change. It was created to develop cinema that empowers people who
                are ignored by mainstream media, a mandate that has taken the company to explore projects, people
                and ideas around the world.</p> -->
                <p class="reveal">EyeSteelFilm is a film and interactive media company dedicated to using cinematic expression as a
                catalyst for social and political change. It was created to develop cinema that empowers people who
                are ignored by mainstream media, people
                and ideas around the world.</p>
            </div>
        </section>
    </div>





    <!-- Information Boxes -->
    <section class="info-boxes">
    <div class="info-box">
        <h3><?php echo $translations['films']; ?></h3>
        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
        <div class="learn-more-container">
            <a href="/films" class="learn-more"><?php echo $translations['learn_more']; ?></a>
       
            <i class="fa fa-long-arrow-right" aria-hidden="true"></i>
</div>
        </div>
    <div class="info-box">
        <h3><?php echo $translations['distribution']; ?></h3>
        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
        <div class="learn-more-container">
            <a href="/distribution" class="learn-more"><?php echo $translations['learn_more']; ?></a>    
            <i class="fa fa-long-arrow-right" aria-hidden="true"></i>
        </div>
    </div>
    <div class="info-box">
        <h3><?php echo $translations['about']; ?></h3>
        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
        <div class="learn-more-container">
            <a href="/about" class="learn-more"><?php echo $translations['learn_more']; ?></a>
            <i class="fa fa-long-arrow-right" aria-hidden="true"></i>
        </div>

    </div>
</section>



</div>

<!-- Footer Section -->

<?php get_footer(); ?>
