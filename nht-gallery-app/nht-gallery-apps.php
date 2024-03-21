<?php

/**
 * Plugin Name: NHT Gallery Editor
 * Version: 2.5
 * Description: Injects Gallery Editor Apps
 * Author: 500 Designs
 * Author URI:  https://500designs.com
 * Text Domain: nth-gallery-apps
 */

define('NHT_PLUGIN_PATH', plugin_dir_path(__FILE__));
define('NHT_PLUGIN_URL', plugin_dir_url(__FILE__));

function enqueue_project_assets($project) {
    $dir_js = NHT_PLUGIN_PATH . $project . '/build/static/js/';
    $files_js = scandir($dir_js);
    $app_js = preg_grep('/^main\..*\.js$/', $files_js);
    $app_js = NHT_PLUGIN_URL . $project . '/build/static/js/' . array_shift($app_js);

    $dir_css = NHT_PLUGIN_PATH . $project . '/build/static/css/';
    $files_css = scandir($dir_css);
    $app_css = preg_grep('/^main\..*\.css$/', $files_css);
    $app_css = NHT_PLUGIN_URL . $project . '/build/static/css/' . array_shift($app_css);

    wp_enqueue_script($project . '-scripts', $app_js, array(), '1.0.0', true);
    wp_enqueue_style($project . '-styles', $app_css, array(), '1.0.0');
    
    wp_localize_script($project . '-scripts', 'nhtData', array(
        'nonce' => wp_create_nonce('wp_rest'),
        'apiUrl' => rest_url('nht/v1/'),
    ));
}

function nht_enqueue_assets() {
    if (is_singular('project')) {
        enqueue_project_assets('project-gallery-app');
    }

    if (is_singular('my_collection') || get_queried_object()->post_name == 'my-images') {
        enqueue_project_assets('my-gallery-app');
    }
}

add_action('wp_enqueue_scripts', 'nht_enqueue_assets');

function nht_render_app($id, $name) {
    $post_id = get_the_ID();
    $post_title = get_the_title();
    $user_id = get_current_user_id();
    return "<div id='{$id}' data-name='{$name}' 
        data-post-id='{$post_id}'
        data-post-title='{$post_title}'
        data-user-id='{$user_id}'
        data-plugin-path='" . plugin_dir_url(__FILE__) . "'
        ></div>";
}

function nht_my_gallery_app_render($atts) {
    return nht_render_app('nht-my-gallery-app-root', 'nht-my-gallery-app-root');
}

function nht_project_gallery_render($atts) {
    return nht_render_app('nht-project-gallery-app-root', 'nht-project-gallery-app-root');
}

add_shortcode('nht_project_gallery_app', 'nht_project_gallery_render');
add_shortcode('nht_my_gallery_app', 'nht_my_gallery_app_render');

require_once(NHT_PLUGIN_PATH . 'includes/helpers.php');
require_once(NHT_PLUGIN_PATH . 'includes/nht-projects-get-api.php');
require_once(NHT_PLUGIN_PATH . 'includes/nht-galleries-get-api.php');
require_once(NHT_PLUGIN_PATH . 'includes/nht-gallery-get-api.php');
require_once(NHT_PLUGIN_PATH . 'includes/nht-gallery-patch-api.php');
require_once(NHT_PLUGIN_PATH . 'includes/nht-gallery-post-api.php');
require_once(NHT_PLUGIN_PATH . 'includes/nht-gallery-delete-api.php');
require_once(NHT_PLUGIN_PATH . 'includes/nht-media-get-api.php');
require_once(NHT_PLUGIN_PATH . 'includes/nht-media-patch-api.php');
