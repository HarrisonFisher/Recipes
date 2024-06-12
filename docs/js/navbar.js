document.addEventListener("DOMContentLoaded", function() {
    const navbar = document.querySelector('.navbar');
    const prefix = navbar.getAttribute('data-prefix');
    
    const updateLinks = () => {
        const links = navbar.querySelectorAll('.navbar-link');
        links.forEach(link => {
            const suffix = link.getAttribute('data-suffix');
            link.setAttribute('href', prefix + suffix);
        });
    };

    // Initial update
    updateLinks();

    // MutationObserver to watch for changes in the .navbar element
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList' || mutation.type === 'attributes') {
                updateLinks();
            }
        });
    });

    // Configure the observer to watch for child nodes and attribute changes
    observer.observe(navbar, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['data-suffix']
    });
});
