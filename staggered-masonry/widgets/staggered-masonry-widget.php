<?php
class Elementor_Staggered_Masonry_Widget extends \Elementor\Widget_Base {

    public function get_name() {
        return 'staggered_masonry_widget';
    }

    public function get_title() {
        return esc_html__('Staggered Masonry', 'elementor-addon');
    }

    public function get_icon() {
        return 'eicon-code';
    }

    public function get_categories() {
        return ['basic'];
    }

    public function get_keywords() {
        return ['staggered', 'masonry'];
    }

    protected function _register_controls() {
        $this->start_controls_section(
            'content_section',
            [
                'label' => esc_html__('Content', 'elementor-addon'),
                'tab' => \Elementor\Controls_Manager::TAB_CONTENT,
            ]
        );

        // Adding a gallery control
        $this->add_control(
            'gallery',
            [
                'label' => esc_html__('Add Images', 'elementor-addon'),
                'type' => \Elementor\Controls_Manager::GALLERY,
                'default' => [],
            ]
        );

        // Adding a text area control for heading
        $this->add_control(
            'heading_text',
            [
                'label' => esc_html__('Heading Text', 'elementor-addon'),
                'type' => \Elementor\Controls_Manager::TEXTAREA,
                'default' => esc_html__('Default heading text here', 'elementor-addon'),
            ]
        );

        $this->end_controls_section();
    }

    protected function render() {

        // Enqueue GSAP
        wp_enqueue_script(
            'gsap',
            'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.8.0/gsap.min.js',
            [], // No dependencies
            false,
            true // Load in footer for better performance
        );

        // Enqueue ScrollTrigger
        wp_enqueue_script(
            'gsap-scrolltrigger',
            'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.8.0/ScrollTrigger.min.js',
            ['gsap'], // Dependent on GSAP
            false,
            true // Load in footer for better performance
        );
        // Enqueue custom CSS
        wp_enqueue_style(
            'staggered-masonry-css',
            plugin_dir_url(__FILE__) . '../assets/staggered-masonry.css'
        );

        // Enqueue custom JS
        wp_enqueue_script(
            'staggered-masonry-js',
            plugin_dir_url(__FILE__) . '../assets/staggered-masonry.js',
            ['jquery'], // If you have dependencies like jQuery
            false,
            true // Load in footer for better performance
        );

        // Get the settings
        $settings = $this->get_settings_for_display();

        // Get gallery and heading_text
        $gallery = $settings['gallery'];
        $heading_text = $settings['heading_text'];

        // Include the rendering template file
        include_once 'staggered-masonry-layout.php';

        // Call the rendering function
        render_staggered_masonry($gallery, $heading_text);
    }
}
