<?php

function nht_register_gallery_patch_endpoints() {
    register_rest_route("nht/v1", "/gallery/items/add/(?P<id>\d+)", [
        "methods" => "PATCH",
        "callback" => "nht_add_item_to_existing_gallery",
        "permission_callback" => "nht_gallery_permission_check",
    ]);

    register_rest_route("nht/v1", "/gallery/items/remove/(?P<id>\d+)", [
        "methods" => "PATCH",
        "callback" => "nht_remove_item_from_existing_gallery",
        "permission_callback" => "nht_gallery_permission_check",
    ]);

    register_rest_route('nht/v1', '/gallery/items/replace/(?P<id>\d+)', [
        'methods' => 'PUT',
        'callback' => 'nht_replace_gallery_items',
        'permission_callback' => 'nht_gallery_permission_check',
        'args' => [
            'id' => [
                'validate_callback' => function ($param, $request, $key) {
                    return is_numeric($param);
                },
            ],
        ],
    ]);

    register_rest_route("nht/v1", "/gallery/rename/(?P<id>\d+)", [
        "methods" => "PATCH",
        "callback" => "nht_rename_gallery",
        "permission_callback" => function () {
            return current_user_can("edit_posts");
        },
        "args" => [
            "id" => [
                "validate_callback" => function ($param, $request, $key) {
                    return is_numeric($param);
                },
            ],
        ],
    ]);
}

function nht_gallery_permission_check($request) {
    $post_id = $request["id"];
    return current_user_can("edit_post", $post_id);
}

function nht_add_item_to_existing_gallery($request) {
    $post_id = $request["id"];
    $new_items = $request->get_json_params();

    $existing_items = get_field("gallery_images", $post_id) ?: [];

    $filtered_new_items = array_filter($new_items, function ($item) use (
        $existing_items
    ) {
        return !in_array($item, $existing_items);
    });

    if (!empty($filtered_new_items)) {
        $result = update_field(
            "gallery_images",
            array_merge($existing_items, $filtered_new_items),
            $post_id
        );
        if (!$result) {
            return new WP_Error(
                "update_failed",
                "Failed to update gallery items.",
                ["status" => 500]
            );
        }
        return new WP_REST_Response(
            ["message" => "Items added successfully to the gallery"],
            200
        );
    } else {
        return new WP_REST_Response(["message" => "No new items to add"], 200);
    }
}

function nht_remove_item_from_existing_gallery($request) {
    $post_id = $request["id"];
    $items_to_remove = $request->get_json_params();

    error_log(
        "Attempting to remove items from gallery: " .
            print_r($items_to_remove, true) .
            " for post ID: " .
            $post_id
    );

    $existing_items = get_field("gallery_images", $post_id, false) ?: [];

    error_log("Existing gallery items: " . print_r($existing_items, true));

    $filtered_items = array_diff($existing_items, $items_to_remove);

    error_log(
        "Gallery items after removal attempt: " . print_r($filtered_items, true)
    );

    if (count($filtered_items) === count($existing_items)) {
        return new WP_REST_Response(
            [
                "message" =>
                "No items were removed. Check if the IDs exist in the gallery.",
            ],
            200
        );
    }

    $result = update_field(
        "gallery_images",
        array_values($filtered_items),
        $post_id
    );

    if ($result === false) {
        return new WP_Error(
            "update_failed",
            "ACF update_field() returned false. Update may not have been necessary.",
            ["status" => 500]
        );
    }

    return new WP_REST_Response(
        ["message" => "Items removed successfully from the gallery"],
        200
    );
}

function nht_replace_gallery_items($request) {
    $post_id = $request['id'];
    $new_items = $request->get_json_params();

    if (!is_array($new_items)) {
        return new WP_Error('invalid_request', 'Invalid data format. A JSON array of item IDs is expected.', ['status' => 400]);
    }

    $result = update_field('gallery_images', $new_items, $post_id);

    if ($result === false) {
        return new WP_Error('update_failed', 'Failed to update gallery items. Please check your data and try again.', ['status' => 500]);
    }

    return new WP_REST_Response(['message' => 'Gallery items replaced successfully'], 200);
}

function nht_rename_gallery($request) {
    $post_id = $request["id"];
    $post_type = get_post_type($post_id);

    if ($post_type !== "my_collection") {
        return new WP_Error(
            "invalid_post_type",
            'The provided ID does not belong to a "my_collection" post type.',
            ["status" => 400]
        );
    }

    $request_body = $request->get_json_params();
    $new_title = $request_body["name"];
    $new_title = sanitize_text_field($new_title);

    if (strlen($new_title) > 200) {
        return new WP_Error(
            "invalid_request",
            "The new title exceeds the recommended maximum length of 200 characters.",
            ["status" => 400]
        );
    }

    if (empty($new_title)) {
        return new WP_Error("invalid_request", "A new title is required.", [
            "status" => 400,
        ]);
    }

    $result = wp_update_post(
        [
            "ID" => $post_id,
            "post_title" => $new_title,
        ],
        true
    );

    if (is_wp_error($result)) {
        return $result;
    }

    return new WP_REST_Response(
        ["message" => "Gallery renamed successfully"],
        200
    );
}

add_action("rest_api_init", "nht_register_gallery_patch_endpoints");
