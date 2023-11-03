<?php
if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly.
}

class TSS_Swiper_Widget extends \Elementor\Widget_Base {

    public function get_name() {
        return 'tss_swiper';
    }

    public function get_title() {
        return __( 'TSS Swiper', 'tss-swiper' );
    }

    public function get_script_depends() {
        return [ 'tss-swiper-js' ];
    }

    public function get_style_depends() {
        return [ 'tss-swiper-css' ];
    }

    protected function _register_controls() {

        $this->start_controls_section(
            'content_section',
            [
                'label' => __( 'Content', 'tss-swiper' ),
                'tab' => \Elementor\Controls_Manager::TAB_CONTENT,
            ]
        );

        $repeater = new \Elementor\Repeater();

        $repeater->add_control(
            'title',
            [
                'label' => __( 'Title', 'tss-swiper' ),
                'type' => \Elementor\Controls_Manager::TEXT,
                'default' => __( 'Item Title', 'tss-swiper' ),
                'label_block' => true,
            ]
        );

        $repeater->add_control(
            'description',
            [
                'label' => __( 'Description', 'tss-swiper' ),
                'type' => \Elementor\Controls_Manager::TEXTAREA,
                'rows' => 10,
                'default' => __( 'Item Description', 'tss-swiper' ),
                'label_block' => true,
            ]
        );

        $repeater->add_control(
            'image',
            [
                'label' => __( 'Choose Image', 'tss-swiper' ),
                'type' => \Elementor\Controls_Manager::MEDIA,
                'default' => [
                    'url' => \Elementor\Utils::get_placeholder_image_src(),
                ],
                'label_block' => true,
            ]
        );

        $this->add_control(
            'slides',
            [
                'label' => __( 'Slider Items', 'tss-swiper' ),
                'type' => \Elementor\Controls_Manager::REPEATER,
                'fields' => $repeater->get_controls(),
                'title_field' => '{{{ title }}}',
            ]
        );

        $this->end_controls_section();
    }

    protected function render() {
        $settings = $this->get_settings_for_display();
        if ( ! empty( $settings['slides'] ) ) {
            include 'tss-swiper-layout.php'; // Includes the layout file from the widgets folder.
        }
    }
    
}
