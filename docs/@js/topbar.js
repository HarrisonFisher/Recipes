// Fetch and include the top bar content
fetch('/@include/topbar.html')
.then(response => {
    if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    return response.text();
})
.then(html => {
    document.getElementById('topbar-container').innerHTML = html;
})
.catch(error => {
    console.error('Error fetching /@include/topbar.html?v=1:', error);
    document.getElementById('topbar-container').innerHTML = '<p>Failed to load top bar. Please try again later.</p>';
});