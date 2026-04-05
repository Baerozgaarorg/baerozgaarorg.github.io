function toggleAccordion(element, event) {
    // Prevent toggling if user clicks inside the accordion content implicitly (though onclick is on the parent)
    // Actually the onclick is on the .service-box, so clicking anywhere inside triggers it.
    // If they click a video or link, we don't want to close the accordion.
    if(event.target.closest('.accordion-content-wrapper')) {
        // Allow clicking on links inside without toggling accordion
        if (event.target.tagName.toLowerCase() === 'a' || event.target.tagName.toLowerCase() === 'video') {
             return;
        }
        // Actually, let's just make the whole accordion-content area NOT close the accordion when clicked.
        // User has to click the top header to close it.
        return;
    }

    const box = element;
    box.classList.toggle('expanded');
    
    if(box.classList.contains('expanded')) {
        setTimeout(() => {
            // Scroll title into view with a bit of offset
            const offset = 80; // height of fixed header roughly
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = box.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                 top: offsetPosition,
                 behavior: "smooth"
            });
        }, 150);
    }
}

// Scroll linked timeline
let isTicking = false;
window.addEventListener('scroll', () => {
    if (!isTicking) {
        window.requestAnimationFrame(() => {
            updateScrollTimeline();
            isTicking = false;
        });
        isTicking = true;
    }
});

function updateScrollTimeline() {
    const activeBox = document.querySelector('.service-box.expanded');
    if(!activeBox) return;

    const wrapper = activeBox.querySelector('.accordion-content');
    const scrollLineFill = activeBox.querySelector('.scroll-line-fill');
    const dot = activeBox.querySelector('.scroll-dot');
    
    if(!wrapper || !scrollLineFill || !dot) return;

    const rect = wrapper.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // We want the line to start filling when the dot reaches near the top third of the screen
    const dotRect = dot.getBoundingClientRect();
    const triggerPoint = windowHeight * 0.4; // 40% from top
    
    let scrollPercentage = 0;
    
    if(dotRect.top < triggerPoint) {
        const scrolledDistance = triggerPoint - dotRect.top;
        // height of the timeline we need to traverse
        const totalHeight = rect.height - parseInt(window.getComputedStyle(wrapper).paddingBottom || 0);
        
        scrollPercentage = (scrolledDistance / totalHeight) * 100;
    }

    if(scrollPercentage < 0) scrollPercentage = 0;
    if(scrollPercentage > 100) scrollPercentage = 100;

    scrollLineFill.style.height = scrollPercentage + '%';
}
