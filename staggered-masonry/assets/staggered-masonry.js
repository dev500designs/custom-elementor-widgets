jQuery(document).ready(function ($) {
    console.log("init staggerd masonry scripts... v1.6");
    gsap.registerPlugin(ScrollTrigger);

    ScrollTrigger.defaults({
        markers: false
    });

    // Grid Title Change
    $(".grid_text-item").eq(0).addClass("is--active");
    $(".grid_wrapper").each(function () {
        let triggerElement = $(this);
        let myIndex = $(this).index();
        let targetElement = $(".grid_text-item").eq(myIndex);
        gsap.timeline({
            scrollTrigger: {
                trigger: triggerElement,
                start: "top bottom",
                end: "bottom bottom",
                onEnter: () => {
                    $(".grid_text-item").removeClass("is--active");
                    targetElement.addClass("is--active");
                },
                onEnterBack: () => {
                    $(".grid_text-item").removeClass("is--active");
                    targetElement.addClass("is--active");
                }
            }
        });
    });

    // Grid Image Move
    $(".grid_item").each(function () {
        let triggerElement = $(this);
        let targetElement = $(this);
        let movementPercentage = 0;

        if (triggerElement.is(":nth-child(3n+1)")) {
            movementPercentage = -30;
        } else if (triggerElement.is(":nth-child(3n+2)")) {
            movementPercentage = -50;
        } else if (triggerElement.is(":nth-child(3n+3)")) {
            movementPercentage = -70;
        }

        gsap.timeline({
            scrollTrigger: {
                trigger: triggerElement,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.5
            }
        }).to(targetElement, {
            y: `${movementPercentage}%`,
            duration: 1
        });
    });

    // snap effect on intro text:
    var targetElement = $('#staggeredMasonry');

    // Climb up the hierarchy to find the parent with class "elementor-element"
    var parentElementorElement = targetElement.closest('.elementor-element.e-flex');
    parentElementorElement.addClass('sibling-main');

    if (parentElementorElement.length > 0) { // Check if the parent with class "elementor-element" is found
        // Target the sibling before the parent element with class "elementor-element"
        var galleryIntroTExt = parentElementorElement.prev();

        if (galleryIntroTExt.length > 0) { // Check if there is a previous sibling
            // Add the class "sibling-fixed" to the sibling
            galleryIntroTExt.addClass('sibling-fixed');
        }
    }

    // Get the last .grid_element within #staggeredMasonry
    var lastGridElement = document.querySelector("#staggeredMasonry .grid_wrapper:last-child .grid_element:last-child");

    // Define a GSAP timeline for the fade-out animation
    var tl = gsap.timeline({
        paused: true // Pause the timeline initially
    });

    // Add a fade-out animation to the previous sibling
    tl.to(galleryIntroTExt, {
        duration: .3, // Duration of 1 second
        opacity: 0,
        ease: "power2.out"
    });

    // Use ScrollTrigger to detect when the target element's bottom edge reaches 5% of the viewport edge
    ScrollTrigger.create({
        trigger: lastGridElement,
        start: "bottom 95%", // Start trigger when the bottom edge is 5% from the viewport's edge
        onEnter: function () { // Function to call when the trigger is entered
            tl.play(); // Play the fade-out animation
        },
        onLeaveBack: function () { // Function to call when scrolling back past the trigger
            tl.reverse(); // Reverse the fade-out animation
        }
    });

});
