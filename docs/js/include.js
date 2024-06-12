class HtmlInjector {
    constructor() {
        this.version = new Date().getTime();
        this.init();
    }

    init() {
        const elements = document.querySelectorAll('.include[src]');
        elements.forEach(element => {
            let url = element.getAttribute('src');
            // Append version parameter to URL
            url += (url.includes('?') ? '&' : '?') + 'v=' + this.version;
            this.fetchAndInject(url, element);
        });
    }

    fetchAndInject(url, element) {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }
                return response.text();
            })
            .then(html => {
                element.innerHTML = html;
            })
            .catch(error => {
                console.error(`Error fetching ${url}:`, error);
                element.innerHTML = '<p>Failed to load content. Please try again later.</p>';
            });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new HtmlInjector();
});
