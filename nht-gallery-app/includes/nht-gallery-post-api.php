<?php

function nht_register_gallery_post_endpoints() {
    
    register_rest_route('nht/v1', '/gallery/clone/(?P<id>\d+)', [
        'methods' => 'POST',
        'callback' => 'nht_clone_gallery',
        'permission_callback' => 'nht_gallery_permission_check',
    ]);
   
    register_rest_route('nht/v1', '/gallery/create', [
        'methods' => 'POST',
        'callback' => 'nht_create_new_gallery',
        'permission_callback' => function () {
            return current_user_can("edit_posts");
        },
    ]);
}

function nht_clone_gallery($request) {
    $post_id = $request['id'];
    $request_body = $request->get_json_params();
    $name_for_clone = sanitize_text_field($request_body["name_for_clone"] ?? '');

    if (empty($name_for_clone)) {
        return new WP_Error("invalid_request", "A name for the cloned gallery is required.", ['status' => 400]);
    }

    $post = get_post($post_id);
    if (!$post) {
        return new WP_Error("post_not_found", "The specified gallery does not exist.", ['status' => 404]);
    }
    
    $post_arr = [
        'post_title'   => $name_for_clone,
        'post_status'  => 'publish',
        'post_type'    => $post->post_type,
        'post_content' => $post->post_content,
    ];

    $clone_id = wp_insert_post($post_arr, true);

    if (is_wp_error($clone_id)) {
        return $clone_id; 
    }

    
    $gallery_images = get_field('gallery_images', $post_id);
    update_field('gallery_images', $gallery_images, $clone_id);

    return new WP_REST_Response(
        [
            "message" => "Gallery cloned successfully", 
            "clone_id" => $clone_id,
            "clone_url" => get_permalink($clone_id),
        ], 200);
}

function nht_create_new_gallery($request) {
    $request_body = $request->get_json_params();
    $new_gallery_name = sanitize_text_field($request_body["new_gallery_name"] ?? '');

    if (empty($new_gallery_name)) {
        return new WP_Error("invalid_request", "A name for the new gallery is required.", ['status' => 400]);
    }

    $post_arr = [
        'post_title'   => $new_gallery_name,
        'post_status'  => 'publish',
        'post_type'    => 'my_collection', 
    ];

    $new_gallery_id = wp_insert_post($post_arr, true);

    if (is_wp_error($new_gallery_id)) {
        return $new_gallery_id; 
    }

    
    update_field('gallery_images', [], $new_gallery_id);

    return new WP_REST_Response(["message" => "New gallery created successfully", "gallery_id" => $new_gallery_id], 200);
}

add_action('rest_api_init', 'nht_register_gallery_post_endpoints');
