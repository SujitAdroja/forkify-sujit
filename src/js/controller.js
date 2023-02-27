import * as modal from './modal';
import { MODAL_CLOSE_SEC } from './config';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import recipeView from './views/recipeView';
import resultView from './views/resultView';
import paginationView from './views/paginationView';
import bookMarksView from './views/bookMarksView';
import addRecipeView from './views/addRecipeView';

//inbuild
import icons from 'url:../img/icons.svg';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    resultView.update(modal.getSearchResults());

    //render book marks
    bookMarksView.update(modal.state.bookMarks);

    //1 loading recipe

    await modal.loadRecipe(id);

    // const { recipe } = modal.state;
    // render recipe
    recipeView.render(modal.state.recipe);
    // recipeView.render(modal.getSearchResults(1));
  } catch (err) {
    recipeView.renderError();
  }
};
const controlSearchResults = async function () {
  try {
    resultView.renderSpinner();

    const query = searchView.getQuery();
    if (!query) return;

    await modal.loadSearchResults(query);

    // resultView.render(modal.state.search.result);
    resultView.render(modal.getSearchResults());
    //render pagination
    paginationView.render(modal.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (gotoPage) {
  // render list of items
  resultView.render(modal.getSearchResults(gotoPage));
  //render new pagination
  paginationView.render(modal.state.search);
};

const controlServings = function (newServings) {
  //update the recipe servings (in state)
  modal.updateServings(newServings);
  //update the recipeView
  // recipeView.render(modal.state.recipe);
  recipeView.update(modal.state.recipe);
};

const controlAddBookMark = function () {
  //1>add book mark and remove bookmarks
  if (!modal.state.recipe.bookMarked) {
    modal.addBookMark(modal.state.recipe);
  } else {
    modal.deleteBookMark(modal.state.recipe.id);
  }
  //2>update recipe view

  recipeView.update(modal.state.recipe);

  //3>rener bookmarks
  bookMarksView.render(modal.state.bookMarks);
};

const controlBookmarks = function () {
  bookMarksView.render(modal.state.bookMarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //render spinner
    addRecipeView.renderSpinner();
    //upload recipe data
    await modal.uploadRecipe(newRecipe);

    //render recipe
    recipeView.render(modal.state.recipe);

    //success message
    addRecipeView.renderMessage();

    //reder bookmarks view
    bookMarksView.render(modal.state.bookMarks);

    //change id in url

    window.history.pushState(null, '', `#${modal.state.recipe.id}`);

    // //close form
    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);

    //
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookMarksView.addHandlerLoad(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookMark(controlAddBookMark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
// window.addEventListener('hashchange', showRecipe);
// window.addEventListener('load', showRecipe);

// ['hashchange', 'load'].forEach(event =>
//   window.addEventListener(event, controlRecipes)
// );
/*
DONE BY ME FOR PRACTICE
const showRecipe = async function () {
  try {
    const res = await fetch(
      'https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bc886'
    );
    const data = await res.json();
    console.log(data.data.recipe);
  } catch (err) {
    alert(err);
  }
};
showRecipe();
*/
