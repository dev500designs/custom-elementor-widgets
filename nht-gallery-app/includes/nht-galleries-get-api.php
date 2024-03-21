<?php

add_action("rest_api_init", "nht_register_galleries_endpoints");

function nht_register_galleries_endpoints() {
    register_rest_route("nht/v1", "/galleries/(?P<user_id>\d+)", [
        "methods" => "GET",
        "callback" => "nht_get_galleries",
        "permission_callback" => "__return_true",
    ]);
}


function nht_get_galleries($data) {
    $args = [
        "post_type" => "my_collection",
        "posts_per_page" => -1,
        "author" => $data["user_id"],
    ];
    $posts_query = new WP_Query($args);
    $response = [];

    if ($posts_query->have_posts()) {
        while ($posts_query->have_posts()) {
            $posts_query->the_post();
            $post_id = get_the_ID();

            nht_parse_gallery_items_and_clear_content($post_id);

            $gallery_images = get_field("gallery_images", $post_id);
            $first_image_thumbnail = "";
            $images_count = 0;

            if (!empty($gallery_images) && is_array($gallery_images)) {
                if (is_array($gallery_images[0]) && isset($gallery_images[0]['id'])) {
                    $first_image_id = $gallery_images[0]['id'];
                    $first_image_thumbnail = wp_get_attachment_image_url(
                        $first_image_id,
                        "thumbnail"
                    );
                }
                $images_count = count($gallery_images);
            }

            $response[] = [
                "id" => $post_id,
                "title" => get_the_title(),
                "author" => get_the_author(),
                "first_image_thumbnail" => $first_image_thumbnail,
                "images_count" => $images_count,
                "url" => get_permalink($post_id),
            ];
        }
        wp_reset_postdata();
    }

    return new WP_REST_Response($response, 200);
}
