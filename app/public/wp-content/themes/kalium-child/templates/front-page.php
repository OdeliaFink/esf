<?php
/*
 * Template Name: Custom Homepage
 * Template Post Type: page
 */
get_header(); ?>
<div class="main-container">
    <div class="hero-container">


        <section class="hero-section">
    
            <video class="video" autoplay loop muted>
                <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4">
                Your browser does not support the video tag.
            </video>
       
        </section>
    </div>
    
    <!-- Tagline Section -->
    <section class="tagline-section">
        <p>Short tagline of ESF Short tagline of ESF Short tagline of ESF Short tagline of ESF Short tagline of ESF Short tagline of ESF</p>
    </section>
    
    <!-- Information Boxes -->
    <section class="info-boxes">
        <div class="info-box">
            <h3>Films</h3>
            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
            <a href="/films" class="learn-more">Learn More</a>
            <div class="icon-arrow"></div>
        </div>
        <div class="info-box dark">
            <h3>Distribution</h3>
            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
            <a href="/distribution" class="learn-more">Learn More</a>
            <div class="icon-arrow"></div>
        </div>
        <div class="info-box">
            <h3>Team</h3>
            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
            <a href="/team" class="learn-more">Learn More</a>
            <div class="icon-arrow"></div>
        </div>
    </section>

</div>

<!-- Footer Section -->

<?php get_footer(); ?>
