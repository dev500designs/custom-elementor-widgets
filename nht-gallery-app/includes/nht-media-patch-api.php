<?php

function nht_register_media_patch_endpoints() {
    register_rest_route('nht/v1', '/media/update-notes/(?P<id>\d+)', [
        'methods' => WP_REST_Server::EDITABLE,
        'callback' => 'nht_update_media_notes',
        'permission_callback' => function () {
            return current_user_can('edit_posts');
        },
        'args' => [
            'id' => [
                'validate_callback' => function ($param, $request, $key) {
                    return is_numeric($param);
                },
            ],
            'image_notes' => [
                'required' => true,
                'validate_callback' => function ($param, $request, $key) {
                    return is_string($param);
                },
            ],
        ],
    ]);
}

function nht_update_media_notes($request) {
    $image_id = $request['id'];
    $image_notes = sanitize_text_field($request['image_notes']);

    $current_notes = get_field('image_notes', $image_id);

    if ($current_notes === $image_notes) {
        return new WP_Error('no_update_required', 'The submitted notes are the same as the current notes. No update required.', ['status' => 400]);
    }

    $update_result = update_field('image_notes', $image_notes, $image_id);

    if ($update_result) {
        return new WP_REST_Response(['message' => 'Media notes updated successfully'], 200);
    } else {
        return new WP_Error('update_failed', 'Failed to update media notes', ['status' => 500]);
    }
}


add_action('rest_api_init', 'nht_register_media_patch_endpoints');
