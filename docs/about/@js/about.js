// Function to create breadcrumb link
function createBreadcrumbLink(name, url, isLast) {
    const span = document.createElement('span');
    if (isLast) {
        span.textContent = name;
    } else {
        const link = document.createElement('a');
        link.textContent = name;
        link.href = url;
        span.appendChild(link);
    }
    return span;
}

// Function to create breadcrumbs
function createBreadcrumbs() {
    const breadcrumbContainer = document.getElementById('breadcrumbs');
    breadcrumbContainer.innerHTML = ''; // Clear any existing breadcrumbs

    // Add "Home" link
    const homeLink = createBreadcrumbLink('Home', '../', false);
    breadcrumbContainer.appendChild(homeLink);

    // Add breadcrumb for About page
    const aboutBreadcrumb = createBreadcrumbLink('About', '../about', true);
    breadcrumbContainer.appendChild(aboutBreadcrumb);
}

// Function to initialize the page
function initAboutPage() {
    createBreadcrumbs();
    // Add other initialization logic here
}

// Initialize the page when DOM content is loaded
document.addEventListener('DOMContentLoaded', initAboutPage);
