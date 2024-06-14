// @js/nav.js
document.addEventListener("DOMContentLoaded", function() {
    // Function to get the relative path based on the depth of the current page
    function getRelativePath() {
        // Get the current path of the document (e.g., /about/index.html)
        const currentPath = window.location.pathname;
        
        // Count the number of slashes to determine the depth
        const depth = (currentPath.match(/\//g) || []).length;
        
        // Construct the relative prefix based on the depth
        return '../'.repeat(depth-1);
    }

    console.log("getRelativePath()", getRelativePath());

    new HtmlInjector().init().then(() => {
        const updateLink = (link) => {
            const prefix = getRelativePath(); // Get the relative path dynamically
            const suffix = link.getAttribute('data-suffix');
            link.setAttribute('href', prefix + suffix);
        };

        const observeLinks = () => {
            const links = document.querySelectorAll('.nav-link');
            
            links.forEach(link => {
                if (!link.__observed) {
                    updateLink(link);
                    link.__observed = true;
                }
            });

            // Create a MutationObserver to watch for changes in the document
            const observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('nav-link')) {
                                updateLink(node);
                            }
                        });
                    } else if (mutation.type === 'attributes' && mutation.attributeName === 'data-suffix') {
                        updateLink(mutation.target);
                    }
                });
            });

            // Configure the observer to watch for changes in the document
            observer.observe(document.documentElement, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['data-suffix']
            });
        };

        // Initial observation
        observeLinks();

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

    console.log("window.location.pathname", window.location.pathname);
});
