async function fetchAllJsonFiles() {
    const response = await fetch(`../@data/index.json?nocache=${new Date().getTime()}`);
    const { files } = await response.json();
    const fetchPromises = files.map(fileName => fetch(`../@data/${fileName}?nocache=${new Date().getTime()}`).then(res => res.json()));
    return Promise.all(fetchPromises);
}

async function fetchAllCategories() {
    const jsonFiles = await fetchAllJsonFiles();
    let allCategories = [];
    jsonFiles.forEach(data => {
        if (data.categories) {
            allCategories = allCategories.concat(data.categories);
        }
    });
    return allCategories;
}

async function fetchAllRecipes() {
    const jsonFiles = await fetchAllJsonFiles();
    let allRecipes = [];
    jsonFiles.forEach(data => {
        if (data.recipes) {
            allRecipes = allRecipes.concat(data.recipes);
        }
    });
    return allRecipes;
}

function findCategory(categories, path) {
    if (path.length === 0) return null;
    const categoryName = path[0];
    const category = categories.find(cat => cat.name === categoryName || cat === categoryName);
    if (!category) return null;
    if (typeof category === 'string') return [];
    if (path.length === 1) return category.subcategories || [];
    return findCategory(category.subcategories || [], path.slice(1));
}



async function findRecipes(categoryPath) {
    const recipes = await fetchAllRecipes();

    const matchingRecipes = recipes.filter(recipe => {
        // Check if the recipe has categories
        if (!recipe.categories || !Array.isArray(recipe.categories) || recipe.categories.length === 0) {
            return false;
        }
        // Check if any category in the recipe matches any part of the provided path
        return recipe.categories.some(catPath => {
            if (catPath.length !== categoryPath.length) {
                return false;
            }
            return catPath.every((category, index) => {
                return category === categoryPath[index] || categoryPath[index] === undefined;
            });
        });
    });

    return matchingRecipes;
}


async function searchAndDisplayResults(paths) {

    const categories = await fetchAllCategories();
    const recipes = await fetchAllRecipes();
    const categoriesToDisplay = [];
    const recipesToDisplay = [];

    await Promise.all(paths.map(async path => {
        if (path.length === 0) {
            categoriesToDisplay.push(...categories);
        } else {
            const result = findCategory(categories, path);
            if (result !== null) {
                if (typeof result === 'string') {
                    categoriesToDisplay.push(result);
                } else if (Array.isArray(result)) {
                    categoriesToDisplay.push(...result);
                }
            } else {
                categoriesToDisplay.push('Category not found');
            }

            const categoryRecipes = await findRecipes(path);
            categoryRecipes.forEach(recipe => {
                recipesToDisplay.push(recipe);
            });
        }
    }));
    console.log("TEST",categoriesToDisplay);
    display(categoriesToDisplay,recipesToDisplay,paths);
}


function createLink(item, baseQueryString) {
    const link = document.createElement('a');
    link.textContent = (typeof item === 'object') ? item.name : item;
    const updatedCategories = (typeof item === 'object') ? [item.name] : [item];
    const categoryQueryString = updatedCategories.map(category => `category=${encodeURIComponent(category)}`).join('&');
    const linkHref = `${window.location.pathname}?${baseQueryString}${baseQueryString ? '&' : ''}${categoryQueryString}`;
    link.href = linkHref;
    return link;
}

function display(categoriesToDisplay, recipesToDisplay,paths) {
    var jsonData = JSON.stringify(paths);
    console.log("jsonData",typeof jsonData, jsonData);
    const container = document.getElementById('categories-container');
    container.innerHTML = '';

    // Parse existing query parameters
    const params = new URLSearchParams(window.location.search);

    const default_thumbnail = '../@img/default-thumbnail.jpg'

    function getEmojiImageUrl(emojiCode) {
        // Convert each character of the emoji code to hexadecimal values separated by dashes
        const emojiHexCodes = Array.from(emojiCode)
            .map(char => char.codePointAt(0).toString(16))
            .join('-');
    
        // Construct the URL for fetching emoji images from Twemoji's GitHub repository
        const twemojiBaseUrl = 'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/';
        const imageUrl = `${twemojiBaseUrl}${emojiHexCodes}.png`;
    
        return imageUrl;
    }
    
    

    
    categoriesToDisplay.forEach(item => {
        const element = document.createElement('div');
        element.classList.add('cell'); // Apply the cell class
        
        // Create thumbnail image
        const thumbnail = document.createElement('img');
        if (item.emoji) {
            thumbnail.src = getEmojiImageUrl(item.emoji)
        } else {
            thumbnail.src = item.thumbnail ||default_thumbnail ; // Use default if thumbnail is not provided
            thumbnail.alt = 'Thumbnail';
        }
        element.appendChild(thumbnail);

        // Create link with category name
        const link = createLink(item, params.toString());
        element.appendChild(link);
        
        // Make the entire cell clickable
        element.addEventListener('click', function() {
            window.location.href = link.href;
        });

        container.appendChild(element);
    });

    recipesToDisplay.forEach(item => {
        const element = document.createElement('div');
        element.classList.add('cell'); // Apply the cell class

        // Check if recipe is a string
        const recipeName = (typeof item === 'string') ? item : item.name;

       // Create thumbnail image
       const thumbnail = document.createElement('img');
       if (item.emoji) {
           thumbnail.src = getEmojiImageUrl(item.emoji)
       } else {
           thumbnail.src = item.thumbnail ||default_thumbnail ; // Use default if thumbnail is not provided
           thumbnail.alt = 'Thumbnail';
       }
       element.appendChild(thumbnail);

        // Create link with recipe name
        const link = document.createElement('a');
        link.textContent = recipeName;
        link.href = item.url || `../recipes?recipe=${encodeURIComponent(recipeName)}`;
        if (item.url) {
            link.target = '_blank'; // Open custom URL in new tab
        }
        element.appendChild(link);

        // Make the entire cell clickable
        element.addEventListener('click', function (event) {
            if (item.url) {
                sessionStorage.setItem(recipeName, jsonData);
                window.open(link.href, '_blank'); // Open custom URL in new tab
            } else {
                sessionStorage.setItem(recipeName, jsonData);
                window.location.href = link.href; // Open default URL in the same tab
            }
            event.preventDefault(); // Prevent default action to handle link click manually
        });

        container.appendChild(element);
    });
}

function createBreadcrumbs(categoryPath) {
    // Add "Home" link
    insertBreadcrumb('Home', '../', false);

    // Add "Categories" link or text
    const isLast = categoryPath.length === 0;
    insertBreadcrumb('Categories', '../categories', isLast);

    // Add links for each category in the path
    let accumulatedPath = '';
    categoryPath.forEach((category, index) => {
        accumulatedPath += `category=${encodeURIComponent(category)}`;
        const isLast = index === categoryPath.length - 1;
        insertBreadcrumb(category, `../categories?${accumulatedPath}`, isLast);
        if (!isLast) {
            accumulatedPath += '&';
        }
    });
}

window.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const categories = params.getAll('category').map(decodeURIComponent);
    if (categories.length === 0) {
        searchAndDisplayResults([[]]);
    } else {
        document.getElementById('recipe-title').textContent = categories[categories.length - 1];
        const paths = [categories]; // Pass all categories as a single array
        searchAndDisplayResults(paths);
    }
    createBreadcrumbs(categories);
});
