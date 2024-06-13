// @js/nav.js
document.addEventListener("DOMContentLoaded", function() {
    // Ensure content is fully injected before initializing navigation
    new HtmlInjector().init().then(() => {

        const containers = document.querySelectorAll('.nav');

        const updateLinks = (container) => {
            console.log(container);
            const prefix = container.getAttribute('data-prefix');
            const links = container.querySelectorAll('.nav-link');
            
            links.forEach(link => {
                const suffix = link.getAttribute('data-suffix');
                link.setAttribute('href', prefix + suffix);
            });
        };

        // Initial update for all containers
        containers.forEach(container => {
            updateLinks(container);

            // Create a MutationObserver to watch for changes in the container
            const observer = new MutationObserver((mutationsList) => {
                for (const mutation of mutationsList) {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        updateLinks(container);
                    }
                }
            });

            // Configure the observer to watch for child node additions
            observer.observe(container, { childList: true, subtree: true });
        });

        // MutationObserver to watch for changes in the .nav elements
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'data-prefix') {
                    updateLinks(mutation.target);
                }
            });
        });


        // Configure the observer to watch for attribute changes on .nav elements
        containers.forEach(container => {
            observer.observe(container, {
                attributes: true,
                attributeFilter: ['data-prefix']
            });
        });

        // Mobile menu toggle
        const mobileMenu = document.querySelector('.mobile-menu');
        const sidebar = document.querySelector('.sidebar');

        if (mobileMenu && sidebar) {
            mobileMenu.addEventListener('click', function() {
                sidebar.classList.toggle('active');
            });

            // Close sidebar when clicking outside of it (optional)
            document.addEventListener('click', function(e) {
                if (!sidebar.contains(e.target) && !mobileMenu.contains(e.target)) {
                    sidebar.classList.remove('active');
                }
            });
        }
    });
});
