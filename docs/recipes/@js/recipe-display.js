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
        
        document.getElementById('recipe-servings').value = recipe.servings;
        document.getElementById('recipe-servings').min = recipe.servings;
        document.getElementById('recipe-servings').setAttribute('data-servings', recipe.servings);


        const ingredientsTableBody = document.querySelector('#recipe-ingredients tbody');
        recipe.ingredients.forEach(ingredient => {
            const row = ingredientsTableBody.insertRow();
            row.innerHTML = `
                <td data-amount="${ingredient.amount}">${ingredient.amount}</td>
                <td>${ingredient.unit || ''}</td>
                <td>${ingredient.ingredient}</td>
            `;
        });

        // const directionsList = document.getElementById('recipe-directions');
        // recipe.directions.forEach(step => {
        //     const listItem = document.createElement('li');
        //     listItem.textContent = step;
        //     directionsList.appendChild(listItem);
        // });
        const directionsContainer = document.getElementById('recipe-directions');
        directionsContainer.innerHTML = ''; // Clear previous directions
        recipe.directions.forEach((step, index) => {
            const stepContainer = document.createElement('div');
            stepContainer.classList.add('step-container');

            const stepNumber = document.createElement('h3');
            stepNumber.classList.add('step-number');
            stepNumber.textContent = `Step ${index + 1}:`;

            const stepText = document.createElement('span');
            stepText.classList.add('step-text');
            stepText.textContent = ` ${step}`;

            stepContainer.appendChild(stepNumber);
            stepContainer.appendChild(stepText);
            directionsContainer.appendChild(stepContainer);
        });


        const default_thumbnail = '../@img/default-thumbnail.jpg';
        function getEmojiImageUrl(emojiCode) {
            const emojiHexCodes = Array.from(emojiCode)
                .map(char => char.codePointAt(0).toString(16))
                .join('-');
            const twemojiBaseUrl = 'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/';
            const imageUrl = `${twemojiBaseUrl}${emojiHexCodes}.png`;
            return imageUrl;
        }
        
        var recipe_thumbnail = document.getElementById('recipe-thumbnail');
        if (recipe.emoji) {
            recipe_thumbnail.src = getEmojiImageUrl(recipe.emoji);
        } else {
            recipe_thumbnail.src = recipe.thumbnail || default_thumbnail;
            recipe_thumbnail.alt = 'Thumbnail';
        }

    } catch (error) {
        console.error('Error rendering recipe:', error);
        contentContainer.innerHTML = 'An error occurred';
    }
}


function createBreadcrumbs(categoryPath, recipeName) {
    // Add "Home" link
    insertBreadcrumb('Home', '../', false);

    if (categoryPath) {
        // Add "Categories" link
        insertBreadcrumb('Categories', '../categories', false);

        // Add links for each category in the path
        let accumulatedPath = '';
        categoryPath.forEach((category, index) => {
            accumulatedPath += `category=${encodeURIComponent(category)}`;
            const isLast = index === categoryPath.length - 1;
            insertBreadcrumb(category, `../categories?${accumulatedPath}`, isLast && !recipeName);
            if (!isLast) {
                accumulatedPath += '&';
            }
        });
    }

    // Add recipe name as the last breadcrumb
    if (recipeName) {
        insertBreadcrumb(recipeName, '', true);
    }
}

function updateFractionText() {
    const fractionElements = document.querySelectorAll('[data-amount]');
    fractionElements.forEach(element => {
        const dataAmount = element.getAttribute('data-amount');
        if (dataAmount === undefined || dataAmount === 'undefined') {
            element.textContent = '';
        } else {
            const originalAmount = parseFloat(dataAmount);
            const currentServings = parseFloat(document.getElementById('recipe-servings').value);
            const originalServings = parseFloat(document.getElementById('recipe-servings').getAttribute('data-servings'));
            const minServings = parseFloat(document.getElementById('recipe-servings').min);

            const adjustedAmount = (originalAmount / originalServings) * currentServings;

            element.textContent = toFraction(adjustedAmount);
        }
    });

    // Toggle visibility of recipe warning based on servings
    const recipeWarning = document.getElementById('recipe-warning');
    const currentServings = parseFloat(document.getElementById('recipe-servings').value);
    const minServings = parseFloat(document.getElementById('recipe-servings').min);

    if (currentServings !== minServings) {
        recipeWarning.classList.remove('hidden');
    } else {
        recipeWarning.classList.add('hidden');
        recipeWarning.innerHTML = "<strong>Adjusted Cooking Time:</strong> If you change the amount of ingredients, adjust the baking time accordingly to ensure proper cooking.";
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
            const parsedData = JSON.parse(data);
            if (Array.isArray(parsedData) && parsedData.length === 1) {
                createBreadcrumbs(parsedData[0], recipeName);
            } else {
                createBreadcrumbs(null, recipeName);
            }
        } catch (error) {
            console.error('Error parsing JSON from sessionStorage:', error);
        }
    } else {
        createBreadcrumbs(null, recipeName);
    }

    // Initial update of fraction text
    updateFractionText();

    // MutationObserver to watch for changes in the #recipe-ingredients table
    const ingredientsTable = document.getElementById('recipe-ingredients');
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList' || mutation.type === 'attributes') {
                updateFractionText();
            }
        });
    });

    // Configure the observer to watch for child nodes and attribute changes
    observer.observe(ingredientsTable, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['data-amount']
    });
});
