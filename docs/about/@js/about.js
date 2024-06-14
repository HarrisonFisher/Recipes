// Function to create breadcrumbs
function createBreadcrumbs() {
    // Add "Home" link
    insertBreadcrumb('Home', '../', false);

    // Add breadcrumb for About page
    insertBreadcrumb('About', '../about', true);
}

// Function to initialize the page
function initAboutPage() {
    createBreadcrumbs();
    // Add other initialization logic here
}

// Initialize the page when DOM content is loaded
document.addEventListener('DOMContentLoaded', initAboutPage);