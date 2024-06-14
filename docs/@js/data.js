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