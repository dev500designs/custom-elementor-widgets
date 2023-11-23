<?php if (!defined('ABSPATH')) {
    exit;
} // Exit if accessed directly 
?>

<div id="tssSwiper" class="tss-swiper <?php echo ($settings['show_slide_numbers'] === 'yes' ? '' : 'no-numbers'); ?>">

    <div class="carousel-wrapper">
        <div class="swiper">
            <div class="swiper-wrapper">
                <?php
                $index = 1; // Initialize the counter
                foreach ($settings['slides'] as $item) :
                    $index_padded = str_pad($index, 2, '0', STR_PAD_LEFT); // Pad the index with leading zero

                    // Only display the number span if show_slide_numbers is set to 'yes'
                    if ($settings['show_slide_numbers'] === 'yes') :
                ?>
                        <div class="swiper-slide item">
                            <span class="number"><?php echo $index_padded; ?></span>
                            <div class="img-wrap">
                                <img src="<?php echo esc_url($item['image']['url']); ?>" alt="<?php echo esc_attr($item['title']); ?>" style="max-width: 200px;">
                            </div>
                            <div class="text-wrap">
                                <h3 class="title"><?php echo esc_html($item['title']); ?></h3>
                                <div class="desc"><?php echo esc_html($item['description']); ?></div>
                            </div>
                        </div>
                    <?php else : ?>
                        <div class="swiper-slide item">
                            <div class="img-wrap">
                                <img src="<?php echo esc_url($item['image']['url']); ?>" alt="<?php echo esc_attr($item['title']); ?>" style="max-width: 200px;">
                            </div>
                            <div class="text-wrap">
                                <h3 class="title"><?php echo esc_html($item['title']); ?></h3>
                                <div class="desc"><?php echo esc_html($item['description']); ?></div>
                            </div>
                        </div>
                <?php
                    endif;
                    $index++; // Increment the counter
                endforeach; ?>
            </div>
        </div>
    </div>

</div>
<div class="tss-cursor">Drag</div>