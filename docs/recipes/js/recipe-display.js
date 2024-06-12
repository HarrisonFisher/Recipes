async function fetchAllJsonFiles() {
    const response = await fetch(`../data/index.json?nocache=${new Date().getTime()}`);
    const { files } = await response.json();
    const fetchPromises = files.map(fileName => fetch(`../data/${fileName}?nocache=${new Date().getTime()}`).then(res => res.json()));
    return Promise.all(fetchPromises);
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

async function fetchRecipe(recipeName) {
    try {
        const allRecipes = await fetchAllRecipes();
        const recipe = allRecipes.find(r => r.name === recipeName);
        return recipe;
    } catch (error) {
        console.error('Error fetching recipe:', error);
        return null;
    }
}

function toFraction(amount) {
    const fractionChars = {
        '1/4': '¼',
        '1/3': '⅓',
        '1/2': '½',
        '2/3': '⅔',
        '3/4': '¾',
        '1/5': '⅕',
        '2/5': '⅖',
        '3/5': '⅗',
        '4/5': '⅘',
        '1/6': '⅙',
        '5/6': '⅚',
        '1/8': '⅛',
        '3/8': '⅜',
        '5/8': '⅝',
        '7/8': '⅞'
    };

    if (amount === undefined) {
        return '';
    } else if (Number.isInteger(amount)) {
        return amount.toString();
    } else {
        const wholeNumber = Math.floor(amount);
        const fractionalPart = amount - wholeNumber;

        const fractions = Object.keys(fractionChars);
        const nearestFraction = fractions.reduce((prev, curr) => Math.abs(eval(curr) - fractionalPart) < Math.abs(eval(prev) - fractionalPart) ? curr : prev);

        let fraction = '';
        if (wholeNumber > 0) {
            fraction += wholeNumber + ' ';
        }

        fraction += fractionChars[nearestFraction];

        return fraction;
    }
}

async function renderRecipe(recipeName, containerId) {
    const contentContainer = document.getElementById(containerId);
    try {
        const recipe = await fetchRecipe(recipeName);
        if (!recipe) {
            contentContainer.innerHTML = 'Recipe not found';
            return;
        }

        // Fill in the data dynamically
        document.getElementById('recipe-name').textContent = recipe.name;
        document.getElementById('recipe-description').textContent = recipe.description;
        document.getElementById('recipe-servings').textContent = `Servings: ${recipe.servings}`;

        const ingredientsTableBody = document.querySelector('#recipe-ingredients tbody');
        recipe.ingredients.forEach(ingredient => {
            const row = ingredientsTableBody.insertRow();
            row.innerHTML = `
                <td>${toFraction(ingredient.amount)}</td>
                <td>${ingredient.unit || ''}</td>
                <td>${ingredient.ingredient}</td>
            `;
        });

        const directionsList = document.getElementById('recipe-directions');
        recipe.directions.forEach(step => {
            const listItem = document.createElement('li');
            listItem.textContent = step;
            directionsList.appendChild(listItem);
        });


        const default_thumbnail = '../img/default-thumbnail.jpg'
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
        var recipe_thumbnail = document.getElementById('recipe-thumbnail');
        if (recipe.emoji) {
            recipe_thumbnail.src = getEmojiImageUrl(recipe.emoji)
        } else {
            recipe_thumbnail.src = recipe.thumbnail ||default_thumbnail ; // Use default if thumbnail is not provided
            recipe_thumbnail.alt = 'Thumbnail';
        }

    } catch (error) {
        console.error('Error rendering recipe:', error);
        contentContainer.innerHTML = 'An error occurred';
    }
}



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

function createBreadcrumbs(categoryPath, recipeName) {
    const breadcrumbContainer = document.getElementById('breadcrumbs');
    breadcrumbContainer.innerHTML = ''; // Clear any existing breadcrumbs

    // Add "Home" link
    const homeLink = createBreadcrumbLink('Home', '../home', false);
    breadcrumbContainer.appendChild(homeLink);

   

    if (categoryPath) {
         // Add "Categories" link
        const categoriesLink = createBreadcrumbLink('Categories', '../categories', false);
        breadcrumbContainer.appendChild(categoriesLink);

        // Add links for each category in the path
        let accumulatedPath = '';
        categoryPath.forEach((category, index) => {
            accumulatedPath += `category=${encodeURIComponent(category)}`;
            const isLast = index === categoryPath.length - 1;
            const link = createBreadcrumbLink(category, `../categories?${accumulatedPath}`, isLast && !recipeName);
            breadcrumbContainer.appendChild(link);
            if (!isLast) {
                accumulatedPath += '&';
            }
        });
    }

    // Add recipe name as the last breadcrumb
    if (recipeName) {
        const recipeBreadcrumb = createBreadcrumbLink(recipeName, '', true);
        breadcrumbContainer.appendChild(recipeBreadcrumb);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const recipeName = urlParams.get('recipe');
    renderRecipe(recipeName, 'content');

    // Retrieve data from session storage and parse it
    var data = sessionStorage.getItem(recipeName);
    if (data) {
        try {
            // Parse the data if it's JSON
            const parsedData = JSON.parse(data);
            // If it's an array and contains only one element, extract that element
            if (Array.isArray(parsedData) && parsedData.length === 1) {
                createBreadcrumbs(parsedData[0],recipeName);
            } else {
                createBreadcrumbs(null,recipeName);
            }
        } catch (error) {
            console.error('Error parsing JSON from sessionStorage:', error);
        }
    } else {
        createBreadcrumbs(null,recipeName);
        // const breadcrumbContainer = document.getElementById('breadcrumbs');
        // breadcrumbContainer.appendChild(document.createTextNode('\u200B'));
    }
});
