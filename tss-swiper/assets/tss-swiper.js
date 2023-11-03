jQuery(document).ready(function ($) {
    console.log("init tss-swiper v1.3");
    var swiperContainer = $('.tss-swiper').closest('.e-con-inner');
    swiperContainer.css({
        'margin': '0',
        'max-width': 'none',
    }).addClass('tss-swiper-container');

    var swiperParent = $('.tss-swiper').closest('.elementor-element.e-parent');
    swiperParent.css({
        'padding': '0',
    }).addClass('tss-swiper-parent');

    // init Swiper
    const tssSliders = document.querySelectorAll(".tss-swiper");

    for (const slider of tssSliders) {
        const swiper = slider.querySelector(".swiper");
        new Swiper(swiper, {
            slidesPerView: 'auto',
            spaceBetween: 0,
            loop: true,
            lazyLoading: true,
            keyboard: {
                enabled: true
            },
            breakpoints: {
                768: {
                    slidesPerView: 4
                },
                1200: {
                    slidesPerView: 4
                }
            }
        });
    }

    // init Cursor Effect
    const cursor = document.querySelector(".tss-cursor");
    const body = document.body;
    const toggleClass = "show-custom-cursor";

    function pointermoveHandler(e) {
        const target = e.target;
        if (
            target.closest(".carousel-wrapper") &&
            window.matchMedia("(hover: hover)").matches
        ) {
            body.classList.add(toggleClass);
            cursor.style.setProperty("--cursor-x", `${e.clientX}px`);
            cursor.style.setProperty("--cursor-y", `${e.clientY - 15}px`);
        } else {
            body.classList.remove(toggleClass);
        }
    }
    document.addEventListener("pointermove", pointermoveHandler);

    function fitTextToHeight(selector, maxHeight) {
        const elements = document.querySelectorAll(selector);

        elements.forEach(function (element) {
            let computedStyle = window.getComputedStyle(element);
            let fontSize = parseInt(computedStyle.getPropertyValue('font-size'));
            let lineHeight = parseInt(computedStyle.getPropertyValue('line-height'));

            // Reduce font size until the content fits the specified height
            while ((element.scrollHeight > maxHeight) && (fontSize > 0)) {
                fontSize--;
                lineHeight = fontSize * 1.2; // Assuming line-height to be 1.2 times the font-size
                element.style.fontSize = fontSize + 'px';
                element.style.lineHeight = lineHeight + 'px';
            }
        });
    }

    // fitTextToHeight('#tssSwiper .desc', 90);

    // Optionally, re-adjust on window resize
    window.addEventListener('resize', (event) => {
        // fitTextToHeight('#tssSwiper .desc', 90);
    });

});
