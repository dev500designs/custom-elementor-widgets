<?php

function nht_register_media_get_endpoints() {
    register_rest_route('nht/v1', '/media/(?P<id>\d+)', [
        'methods' => WP_REST_Server::READABLE,
        'callback' => 'nht_get_single_media',
        'args' => [
            'id' => [
                'validate_callback' => function ($param, $request, $key) {
                    return is_numeric($param);
                },
            ],
        ],
    ]);
}

function nht_get_single_media($request) {
    $image_id = $request['id'];
    $image_post = get_post($image_id);

    if (!$image_post || $image_post->post_type !== 'attachment') {
        return new WP_Error('no_media', 'Media item not found', ['status' => 404]);
    }

    $response = [
        'id' => $image_id,
        'title' => $image_post->post_title,
        'thumbnail' => wp_get_attachment_image_url($image_id, 'thumbnail'),
        'image_category' => get_field('image_category', $image_id),
        'image_description' => get_field('image_description', $image_id),
        'image_notes' => get_field('image_notes', $image_id),
    ];

    return new WP_REST_Response($response, 200);
}

add_action('rest_api_init', 'nht_register_media_get_endpoints');
