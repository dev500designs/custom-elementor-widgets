<?php

function all_are_integers($array) {
    foreach ($array as $value) {
        if (!is_int($value)) {
            return false;
        }
    }
    return true;
}

function nht_parse_gallery_items_and_clear_content($post_id) {
    $post = get_post($post_id);
    $content = $post->post_content;

    if (!empty(trim($content))) {
        $parsed_items = nht_parse_gallery_items($content);
        if (!empty($parsed_items)) {
            update_field('gallery_images', $parsed_items, $post_id);

            wp_update_post([
                'ID' => $post_id,
                'post_content' => '',
            ]);
        }
    }
}

function nht_parse_gallery_items($content) {
    $parsed_items = [];
    $dom = new DOMDocument();
    @$dom->loadHTML(mb_convert_encoding($content, 'HTML-ENTITIES', 'UTF-8'));

    $figures = $dom->getElementsByTagName('figure');
    foreach ($figures as $figure) {
        $imgs = $figure->getElementsByTagName('img');
        foreach ($imgs as $img) {
            $dataId = $img->getAttribute('data-id');
            if (!empty($dataId)) {
                $parsed_items[] = $dataId;
            }
        }
    }
    return $parsed_items;
}


function nht_get_project_terms($project_id) {
    $object = array();
    $terms = array(
        'builders' => get_the_terms($project_id, 'builders'),
        'product_types' => get_the_terms($project_id, 'product_type'),
        'architects' => get_the_terms($project_id, 'architects'),
        'landscape_architects' => get_the_terms($project_id, 'landscape_architects'),
        'interior_designers' => get_the_terms($project_id, 'interior_design'),
        'jbrec_consultants' => get_the_terms($project_id, 'jbrec')
    );
    
    foreach ($terms as $term => $field) {
        if (!empty($field)) {
            $term_data = [];
            $site_field_name = 'site';
            switch($term) {
                case 'builders':
                $site_field_name = 'builders-site';
                  break;
                case 'architects':
                $site_field_name = 'architects-site';
                  break;
                case 'interior_designers':
                    $site_field_name = 'interior_design-site';
                  break;
                case 'jbrec_consultants':
                    $site_field_name = 'jbrec-site';
                  break;
                case 'landscape_architects':
                    $site_field_name = 'landscape_architects-site';
                  break;
              }
            foreach ($field as $value) {
                $item_data = [
                    'id' => $value->term_id,
                    'name' => $value->name,
                    'slug' => $value->slug,
                    'description' => $value->description,
                    'site' => get_field($site_field_name, $value),
                ];

                if($term == 'jbrec_consultants') {
                    $item_data['role'] = get_field('jbrec-job_role', $value);
                    $item_data['email'] = get_field('jbrec-email', $value);
                    $item_data['location'] = get_field('jbrec-location', $value);
                }

                $term_data[] = $item_data;
            }
            $object[$term] = $term_data;
        }
    }

    return $object;
}