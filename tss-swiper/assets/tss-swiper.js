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
            loop: false,
            centeredSlides: false,
            lazyLoading: true,
            keyboard: {
                enabled: true
            },
            breakpoints: {
                1400: {
                    centeredSlides: false,
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




});
