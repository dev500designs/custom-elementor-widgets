<?php

function nht_register_gallery_delete_endpoints() {
    
    register_rest_route('nht/v1', '/gallery/delete/(?P<id>\d+)', [
        'methods' => 'DELETE',
        'callback' => 'nht_delete_gallery',
        'permission_callback' => 'nht_gallery_permission_check',
    ]);
}

function nht_delete_gallery($request) {
    $post_id = $request['id'];
    
    $post = get_post($post_id);
    if (!$post) {
        return new WP_Error("post_not_found", "The specified gallery does not exist.", ['status' => 404]);
    }

    $delete_result = wp_delete_post($post_id, true);
    if ($delete_result === false) {
        return new WP_Error("delete_failed", "Failed to delete the specified gallery.", ['status' => 500]);
    }

    return new WP_REST_Response(
        [
            "message" => "Gallery cloned successfully", 
        ], 200);
}

add_action('rest_api_init', 'nht_register_gallery_delete_endpoints');
