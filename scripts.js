const recipes = [
    {
        name: "Spaghetti with Tomato Sauce",
        description: "This classic recipe is easy to make and delicious!",
        servings: 4,
        ingredients: [
            { amount: 16, unit: "oz", ingredient: "spaghetti" },
            { amount: 14, unit: "oz", ingredient: "crushed tomatoes" },
            { amount: 3, unit: "cloves", ingredient: "garlic, minced" },
            { amount: 2, unit: "tablespoons", ingredient: "olive oil" },
            { ingredient: "salt and pepper, to taste" },
            { ingredient: "grated Parmesan cheese (optional)" }
        ],
        directions: [
            "Bring a large pot of salted water to a boil. Add the spaghetti and cook until al dente, according to package instructions.",
            "Meanwhile, heat the olive oil in a large saucepan over medium heat. Add the minced garlic and sauté for about 1 minute, until fragrant.",
            "Add the crushed tomatoes to the saucepan and stir to combine. Season with salt and pepper, to taste.",
            "Simmer the tomato sauce for about 10 minutes, until slightly thickened.",
            "Drain the cooked spaghetti and add it to the tomato sauce. Toss to coat the spaghetti evenly with the sauce.",
            "Serve the spaghetti hot, topped with grated Parmesan cheese, if desired."
        ]
    },
    {
        name: "Magic Cookie Bar",
        description: "Grandma's Recipe",
        servings: 35,
        ingredients: [
            { amount: 1/2, unit: "cup", ingredient: "margarine or butter" },
            { amount: 3/2, unit: "cups", ingredient: "graham cracker crumbs" },
            { amount: 14, unit: "oz", ingredient: "sweetened condensed milk" },
            { amount: 4/3, unit: "cups", ingredient: "flaked coconut" },
            { amount: 1, unit: "cup", ingredient: "chopped nuts" }
        ],
        directions: [
            "Preheat oven to 350°F (325°F for glass dish). In a 13\" x 9\" baking pan, melt butter in oven.",
            "Sprinkle crumbs over butter; pour sweetened condensed milk evenly over crumbs.",
            "Top evenly with remaining ingredients; press down firmly. Bake for 25 to 30 minutes.",
            "Cool and chill thoroughly if desired. Cut into bars. Store loosely covered at room temperature."
        ]
    },
    {
        name: "Shrimp Creole",
        description: "Grandma's Recipe",
        servings: 6,
        ingredients: [
            { amount: 1/4, unit: "cup", ingredient: "olive oil and shortening" },
            { amount: 1/4, unit: "cup", ingredient: "flour" },
            { amount: 4, unit: "cloves", ingredient: "garlic, minced" },
            { amount: 1/2, unit: "cup", ingredient: "chopped celery" },
            { amount: 1/2, unit: "cup", ingredient: "chopped green peppers" },
            { amount: 16, unit: "oz", ingredient: "tomato sauce" },
            { amount: 1/2, unit: "teaspoon", ingredient: "black pepper" },
            { amount: 1/2, unit: "teaspoon", ingredient: "red pepper" },
            { amount: 3/4, unit: "teaspoon", ingredient: "salt" },
            { amount: 24, unit: "oz", ingredient: "raw shrimp, shelled and deveined, fresh or frozen" }
        ],
        directions: [
            "Heat oil, add flour, shrimp.",
            "Add garlic, celery, green peppers. Add tomato sauce and seasonings. Cook for 20 minutes, stirring frequently.",
            "Add shrimp and cook for an additional 15-25 minutes.",
            "Serve over hot rice."
        ]
    },
    {
        name: "Chili",
        description: "Grandma's Recipe",
        servings: 15,
        ingredients: [
            { amount: 1.5, unit: "lb", ingredient: "very lean hamburger" },
            { amount: 2, unit: "large", ingredient: "onions" },
            { amount: 40, unit: "oz", ingredient: "kidney beans" },
            { amount: 28, unit: "oz", ingredient: "whole peeled tomatoes" },
            { amount: 2, unit: "tablespoons", ingredient: "chili powder" },
            { amount: 1/4, unit: "teaspoon", ingredient: "black pepper" },
            { amount: 3/4, unit: "teaspoon", ingredient: "salt" },
            { amount: 1/8, unit: "teaspoon", ingredient: "red pepper" }
        ],
        directions: [
            "Brown hamburger with chopped onions (should be crumbly).",
            "Mix tomatoes, beans, and seasonings in a large pot. Heat.",
            "After hamburger mix is browned, add to bean mixture. Simmer until thickened.",
            "Taste and add more seasoning if desired."
        ]
    }
];


  
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////


document.addEventListener('DOMContentLoaded', function() {
    
    const recipesContainer = document.getElementById('recipes');

 // Function to convert decimal numbers to fractions or keep as whole number
    function toFraction(amount) {
        // Unicode characters for common fractions
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

            // Find the nearest fraction representation
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



    function renderRecipes() {
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
    }

    renderRecipes();
});
