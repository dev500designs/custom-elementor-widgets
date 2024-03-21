<?php

add_action("rest_api_init", "nht_register_gallery_endpoints");

function nht_register_gallery_endpoints() {
    register_rest_route("nht/v1", "/gallery/(?P<id>\d+)", [
        "methods" => "GET",
        "callback" => "nht_get_single_gallery",
        "permission_callback" => "__return_true",
        "args" => [
            'page' => [
                'required' => false,
                'validate_callback' => function ($param, $request, $key) {
                    return is_numeric($param);
                },
                'default' => 1,
            ],
            'per_page' => [
                'required' => false,
                'validate_callback' => function ($param, $request, $key) {
                    return is_numeric($param);
                },
                'default' => 12,
            ],
            'sort_by_date' => [
                'required' => false,
                'validate_callback' => function ($param, $request, $key) {
                    return in_array($param, ['asc', 'desc', '']);
                },
                'default' => '',
            ],
            'filter_by_category' => [
                'required' => false,
                'validate_callback' => function ($param, $request, $key) {
                    return is_string($param);
                },
            ],
        ],
    ]);

    register_rest_route("nht/v1", "/all-gallery-images/(?P<id>\d+)", [
        "methods" => "GET",
        "callback" => "nht_get_all_gallery_images",
        "permission_callback" => "__return_true",
        "args" => [
            'id' => [
                'required' => true,
                'validate_callback' => function($param, $request, $key) {
                    return is_numeric($param);
                }
            ],
        ],
    ]);
}


function nht_get_single_gallery($data) {
    $post_id = $data['id'];
    $page = isset($data['page']) ? (int) $data['page'] : 1;
    $per_page = isset($data['per_page']) ? (int) $data['per_page'] : 12;
    $sort_by_date = $data['sort_by_date'];
    $filter_by_category = isset($data['filter_by_category']) ? $data['filter_by_category'] : '';

    nht_parse_gallery_items_and_clear_content($post_id);

    $post = get_post($post_id);

    if (!$post || $post->post_type !== 'my_collection') {
        return new WP_Error('no_post', 'Gallery not found', ['status' => 404]);
    }

    $gallery_images = get_field('gallery_images', $post_id) ?: [];
    $all_categories = [];


    foreach ($gallery_images as $image) {
        $image_id = $image['id'];
        $image_category = get_field("image_category", $image_id);
        if (!in_array($image_category, $all_categories, true)) {
            $all_categories[] = $image_category;
        }
    }


    if (!empty($filter_by_category)) {
        $gallery_images = array_filter($gallery_images, function ($image) use ($filter_by_category) {
            $image_category = get_field("image_category", $image['id']);
            return $image_category === $filter_by_category;
        });
    }


    if ($sort_by_date !== '') {
        usort($gallery_images, function ($a, $b) use ($sort_by_date) {
            $date_a = get_the_date('U', $a['id']);
            $date_b = get_the_date('U', $b['id']);
            if ($sort_by_date === 'asc') {
                return $date_a <=> $date_b;
            } else {
                return $date_b <=> $date_a;
            }
        });
    }

    $total_images = count($gallery_images);
    $total_pages = ceil($total_images / $per_page);
    $gallery_image_ids = [];
    $first_image_thumbnail = null;
    $paginated_images = array_slice($gallery_images, ($page - 1) * $per_page, $per_page);

    foreach ($paginated_images as $index => $image) {
        $image_id = $image['id'];
        $first_image_thumbnail = ($page - 1) * $per_page + $index === 0 ? wp_get_attachment_image_url($image_id, 'thumbnail') : $first_image_thumbnail;

        $project_id = wp_get_post_parent_id($image_id);
        $project_post = get_post($project_id);

        $paginated_images[$index] = [
            'id' => $image_id,
            'title' => get_the_title($image_id),
            'thumbnail' => wp_get_attachment_image_url($image_id, 'thumbnail'),
            'large' => wp_get_attachment_image_url($image_id, 'large'),
            'image_category' => get_field("image_category", $image_id),
            'image_description' => get_field("image_description", $image_id),
            'image_notes' => get_field("image_notes", $image_id),
            'published_date' => get_the_date('c', $image_id),
            'project_id' => wp_get_post_parent_id($image_id),
            'project_title' => get_the_title($project_id),
            'address_country' => get_field('address_country', $project_id),
            'address_locality' => get_field('address_locality', $project_id),
            'address_regions' => get_the_terms($project_id, 'regions'),
        ];

        $paginated_images[$index] = array_merge($paginated_images[$index], nht_get_project_terms($project_id));

        $gallery_image_ids[$index] = $image_id;
    }

    $response = [
        'id' => $post_id,
        'title' => get_the_title($post_id),
        'url' => get_permalink($post_id),
        'first_image_thumbnail' => $first_image_thumbnail,
        'gallery_image_ids' => $gallery_image_ids,
        'current_page' => $page,
        'total_pages' => $total_pages,
        'all_images_categories' => array_values(array_filter($all_categories)),
        'gallery_images' => $paginated_images,
    ];

    return new WP_REST_Response($response, 200);
}

function nht_get_all_gallery_images($data) {
    $post_id = (int) $data['id'];
    $post = get_post($post_id);

    // Check if the post exists and is of the correct type
    if (!$post || $post->post_type !== 'my_collection') {
        return new WP_Error('no_post', 'Gallery not found', ['status' => 404]);
    }

    $gallery_images = get_field('gallery_images', $post_id) ?: [];
    $images_details = [];

    // Iterate through each gallery image to retrieve required details
    foreach ($gallery_images as $image) {
        $image_id = $image['id']; // Assuming 'id' is the correct key from your setup
        $images_details[] = [
            'id' => $image_id,
            'title' => get_the_title($image_id),
            'thumbnail' => wp_get_attachment_image_url($image_id, 'thumbnail'),
        ];
    }

    return new WP_REST_Response($images_details, 200);
}