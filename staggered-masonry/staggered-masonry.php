<?php

/**
 * Plugin Name: Staggered Masonry
 * Description: A custom Elementor widget for a staggered masonry layout.
 * Version: 1.0.0
 * Author: 500 Designs R&D
 */


function register_staggered_masonry_widget($widgets_manager) {

    require_once(__DIR__ . '/widgets/staggered-masonry-widget.php');
    // require_once(__DIR__ . '/widgets/hello-world-widget-2.php');

    $widgets_manager->register(new \Elementor_Staggered_Masonry_Widget());
    // $widgets_manager->register(new \Elementor_Hello_World_Widget_2());
}
add_action('elementor/widgets/register', 'register_staggered_masonry_widget');
