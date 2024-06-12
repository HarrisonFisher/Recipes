


    // python -m http.server
    // http://localhost:8000/ 




const recipesContainer = document.getElementById('recipes');

// Function to fetch recipes from JSON file
async function fetchRecipes() {
    try {
        const response = await fetch('recipes.json');
        const recipes = await response.json();
        return recipes;
    } catch (error) {
        console.error('Error fetching recipes:', error);
        return [];
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

// Function to render recipes
async function renderRecipes() {
    try {
        const recipes = await fetchRecipes();

        recipesContainer.innerHTML = '';
        recipes.forEach(recipe => {
            const recipeElement = document.createElement('div');
            recipeElement.classList.add('recipe');

            recipeElement.innerHTML = `
                <h2>${recipe.name}</h2>
                <p>${recipe.description}</p>
                <p>Servings: ${recipe.servings}</p>
                <h3>Ingredients:</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Amount</th>
                            <th>Unit</th>
                            <th>Ingredient</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${recipe.ingredients.map(ingredient => `
                            <tr>
                                <td>${toFraction(ingredient.amount)}</td>
                                <td>${ingredient.unit || ''}</td>
                                <td>${ingredient.ingredient !== undefined ? ingredient.ingredient : ''}</td>
                            </tr>`
                        ).join('')}
                    </tbody>
                </table>
                <h3>Directions:</h3>
                <ol>
                    ${recipe.directions.map(step => `<li>${step}</li>`).join('')}
                </ol>
            `;

            recipesContainer.appendChild(recipeElement);
        });
    } catch (error) {
        console.error('Error rendering recipes:', error);
    }
}

// Call renderRecipes to display recipes
renderRecipes();