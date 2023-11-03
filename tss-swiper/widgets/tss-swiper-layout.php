<?php if (!defined('ABSPATH')) {
    exit;
} // Exit if accessed directly 
?>

<div id="tssSwiper" class="tss-swiper">
    
    <div class="carousel-wrapper">
        <div class="swiper">
            <div class="swiper-wrapper">
                <?php 
                $index = 1; // Initialize the counter
                foreach ($settings['slides'] as $item) : 
                    $index_padded = str_pad($index, 2, '0', STR_PAD_LEFT); // Pad the index with leading zero
                ?>
                    <div class="swiper-slide item">
                        <span class="number"><?php echo $index_padded; ?></span>
                        <div class="img-wrap">
                            <img src="<?php echo esc_url($item['image']['url']); ?>" alt="<?php echo esc_attr($item['title']); ?>" style="max-width: 200px;">
                        </div>
                        <h3 class="title"><?php echo esc_html($item['title']); ?></h3>
                        <div class="desc"><?php echo esc_html($item['description']); ?></div>
                    </div>
                <?php 
                $index++; // Increment the counter
                endforeach; ?>
            </div>
        </div>
    </div>

</div>
<div class="tss-cursor">Drag</div>
