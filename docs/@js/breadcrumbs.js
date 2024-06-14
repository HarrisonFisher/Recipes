// breadcrumbs.js

function createBreadcrumbLink (name, url, isLast) {
    const span = document.createElement('li');
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

function insertBreadcrumb() {
    const breadcrumbContainer = document.getElementById('breadcrumbs');
    // breadcrumbContainer.innerHTML = ''; // Clear any existing breadcrumbs
    var args = Array.prototype.slice.call(arguments);
    const breadcrumb =  createBreadcrumbLink.apply(null, args);
    breadcrumbContainer.appendChild(breadcrumb);
}