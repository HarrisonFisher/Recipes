// Function to fetch recipes from JSON file
async function fetchRecipe(recipeName) {
    try {
        const response = await fetch('recipes.json');
        const recipes = await response.json();
        const recipe = recipes.find(r => r.name === recipeName);
        return recipe;
    } catch (error) {
        console.error('Error fetching recipe:', error);
        return null;
    }
}

// Function to convert decimal numbers to fractions or keep as whole number
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

        let numerator = Math.round(fractionalPart * 16); // Using 16 as a denominator for better fraction representation

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

// Function to render recipe
async function renderRecipe(recipeName) {
    const contentContainer = document.getElementById('content');
    try {
        if (!recipeName) {
            // If no recipe parameter, include Home.html
            const response = await fetch('../Home.html?v=0');
            const html = await response.text();
            contentContainer.innerHTML = html;
            return;
        }

        const recipe = await fetchRecipe(recipeName);

        if (!recipe) {
            contentContainer.innerHTML = 'Recipe not found';
            return;
        }

        let html = `
            <h1>${recipe.name}</h1>
            <p>${recipe.description}</p>
            <p>Servings: ${recipe.servings}</p>
            <h2>Ingredients</h2>
            <table>
                <thead>
                    <tr>
                        <th>Amount</th>
                        <th>Unit</th>
                        <th>Ingredient</th>
                    </tr>
                </thead>
                <tbody>
        `;

        recipe.ingredients.forEach(ingredient => {
            html += `
                <tr>
                    <td>${toFraction(ingredient.amount)}</td>
                    <td>${ingredient.unit || ''}</td>
                    <td>${ingredient.ingredient}</td>
                </tr>
            `;
        });

        html += `
                </tbody>
            </table>
            <h2>Directions</h2>
            <ol>
        `;

        recipe.directions.forEach(step => {
            html += `<li>${step}</li>`;
        });

        html += `
            </ol>
        `;

        contentContainer.innerHTML = html;
    } catch (error) {
        console.error('Error rendering recipe:', error);
        contentContainer.innerHTML = 'An error occurred';
    }
}

// Extract recipe name from URL parameter
const urlParams = new URLSearchParams(window.location.search);
const recipeName = urlParams.get('recipe');

// Render the recipe
renderRecipe(recipeName);
