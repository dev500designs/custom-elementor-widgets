<?php
/**
 * Plugin Name: TSS Swiper Widget
 * Description: Custom Elementor widget for a swiper/slider.
 * Version:     1.0.0
 * Author:      james500dev
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly.
}

/**
 * Register TSS Swiper Widget.
 */
function register_tss_swiper_widget( $widgets_manager ) {
    require_once( __DIR__ . '/widgets/tss-swiper-widget.php' );
    $widgets_manager->register( new \TSS_Swiper_Widget() );
}

add_action( 'elementor/widgets/register', 'register_tss_swiper_widget' );

/**
 * Enqueue TSS Swiper scripts and styles only when the widget is used.
 */
function tss_swiper_scripts() {
    // if ( \Elementor\Plugin::$instance->frontend->has_elementor_in_page() ) {
        // Swiper dependencies
        wp_enqueue_style('swiper-css', 'https://cdnjs.cloudflare.com/ajax/libs/Swiper/7.3.1/swiper-bundle.min.css');
        wp_enqueue_script('swiper-js', 'https://cdnjs.cloudflare.com/ajax/libs/Swiper/7.3.1/swiper-bundle.min.js', [], null, true);

        // Your custom scripts and styles
        wp_enqueue_script('tss-swiper-js', get_stylesheet_directory_uri() . '/tss-swiper/assets/tss-swiper.js', ['jquery', 'swiper-js'], null, true);
        wp_enqueue_style('tss-swiper-css', get_stylesheet_directory_uri() . '/tss-swiper/assets/tss-swiper.css', ['swiper-css'], null);
    // }
}

add_action('wp_enqueue_scripts', 'tss_swiper_scripts');

