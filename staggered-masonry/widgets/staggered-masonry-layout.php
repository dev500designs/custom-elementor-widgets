<?php
// staggered-masonry-layout.php

function render_staggered_masonry($gallery, $heading_text) {

?>

    <h3><?= esc_html($heading_text); ?></h3>

    <div id="staggeredMasonry" class="section is--grid">
        <div class="grid_wrapper-contain">
            <?php
            // Process the images in groups of 4
            for ($i = 0; $i < count($gallery); $i += 4) : ?>

                <div class="grid_wrapper">
                    <div role="list" class="grid_list">
                        <?php for ($j = 0; $j < 4 && $i + $j < count($gallery); $j++) :
                            $image = $gallery[$i + $j];
                            $alt_text = get_post_meta($image['id'], '_wp_attachment_image_alt', true);
                            if (empty($alt_text)) {
                                $alt_text = get_the_title($image['id']);
                            }
                        ?>
                            <div role="listitem" class="grid_item">
                                <div class="grid_element"><img src="<?= esc_url($image['url']); ?>" loading="lazy" alt="<?= esc_attr($alt_text); ?>" class="grid_img" data-name="<?= $image['id'] ?>" /></div>
                            </div>
                        <?php endfor; ?>
                    </div>
                </div>

            <?php endfor; ?>
        </div>
    </div>
<?php
}
