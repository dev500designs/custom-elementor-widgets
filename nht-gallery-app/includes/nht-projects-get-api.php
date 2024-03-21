<?php

function nht_register_project_endpoints() {
    register_rest_route('nht/v1', '/project/(?P<id>\d+)', array(
        'methods' => 'GET',
        'callback' => 'nht_get_project_data',
        'permission_callback' => '__return_true',
    ));

    register_rest_route('nht/v1', '/project-detail/(?P<id>\d+)', array(
        'methods' => 'GET',
        'callback' => 'nht_get_project_detail',
        'permission_callback' => '__return_true',
    ));

    register_rest_route('nht/v1', '/project/(?P<id>\d+)/image_categories', array(
        'methods' => 'GET',
        'callback' => 'nht_get_image_categories',
        'permission_callback' => '__return_true',
    ));

    register_rest_route('nht/v1', '/project/(?P<id>\d+)', array(
        'methods' => WP_REST_Server::EDITABLE,
        'callback' => 'nht_update_project_data',
        'permission_callback' => function () {
            return current_user_can('edit_posts');
        },
    ));
    
}

function nht_get_image_categories($data) {
    $post_id = $data['id'];
    $project_images = get_field('project_images', $post_id);
    $image_categories = [];

    if (!empty($project_images)) {
        foreach ($project_images as $image) {
            $image_category = get_field('image_category', $image['ID']);
            if (!in_array($image_category, $image_categories) && !empty($image_category)) {
                $image_categories[] = $image_category;
            }
        }
    }

    return new WP_REST_Response($image_categories, 200);
}

function nht_get_project_detail($data) {
    $post_id = $data['id'];
    $post = get_post($post_id);

    if (!$post) {
        return new WP_Error('no_post', 'Post not found', array('status' => 404));
    }

    // Get post content
    $post_fields = [
        'content' => $post->post_content,
        'excerpt' =>  $post->post_excerpt,
        'date' => $post->post_date,
        'modified' => $post->post_modified,
        'author' => get_the_author_meta('display_name', $post->post_author),
        // Basic Info
        'price' => get_field('price', $post_id),
        'square_footage' => get_field('square_footage', $post_id),
        'square_footage_max' => get_field('square_footage_max', $post_id),
        'target_market' => get_field('target_market', $post_id),
        'sales_start_date' => get_field('sales_start_date', $post_id),
        'sales_as_of' => get_field('density', $post_id),
        'unique_selling_position' => get_field('unique_selling_position', $post_id),
        // Address
        'address_line1' => get_field('address_address_line1', $post_id),
        'address_line2' => get_field('address_address_line2', $post_id),
        'address_given_name' => get_field('address_given_name', $post_id),
        'address_locality' => get_field('address_locality', $post_id),
        'address_postal_code' => get_field('address_postal_code', $post_id),
        'address_additional_name' => get_field('address_additional_name', $post_id),
        'address_country' => get_field('address_country', $post_id),
        'address_regions' => get_the_terms($post_id, 'regions'),
        // Featured
        'featured_name' => get_field('featured_name', $post_id),
        'featured_date' => get_field('featured_date', $post_id),
        'featured_image' => get_the_post_thumbnail_url($post_id, 'large'),
    ];

    $post_fields = array_merge($post_fields, nht_get_project_terms($post_id));

    $response = array(
        'id' => $post_id,
        'title' => get_the_title($post_id),
        'data' => $post_fields
    );

    return new WP_REST_Response($response, 200);
}

function nht_get_project_data($data) {
    $post_id = $data['id'];
    $post = get_post($post_id);

    // Check if an `image_category` filter is provided
    $image_category_filter = isset($data['image_category']) ? $data['image_category'] : null;
    
    if (!$post) {
        return new WP_Error('no_post', 'Post not found', array('status' => 404));
    }

    $response = array(
        'id' => $post_id,
        'title' => get_the_title($post_id),
    );

    
    $project_images = get_field('project_images', $post_id);
    $images_response = [];

    if (!empty($project_images)) {
        foreach ($project_images as $image) {
            $image_id = $image['ID'];
            
            $image_category = get_field('image_category', $image_id);
            // Check if image_category matches, if provided
            if ($image_category_filter && get_field('image_category', $image_id) !== $image_category_filter) {
                continue; // Skip this image if the category doesn't match
            }

            $image_description = get_field('image_description', $image_id);
            
            $image_data = [
                'id' => $image_id,
                'thumbnail' => $image['sizes']['thumbnail'],
                'large' => $image['sizes']['large'],
                'image_category' => $image_category,
                'image_description' => $image_description
            ];
            array_push($images_response, $image_data);
        }
    }
    
    $response['images'] = $images_response;

    return new WP_REST_Response($response, 200);
}

add_action('rest_api_init', 'nht_register_project_endpoints');
