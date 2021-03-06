const input = document.getElementById("search-input");
const mealItems = document.getElementById("item-panel");
const contentDetails = document.getElementById('meal-details')
const row = document.getElementById("row");
const button = document.getElementById("button");
// button event handler
button.addEventListener("click", eventWork);
// input event handler
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    eventWork();
  }
});
// api function
function eventWork() {
  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${input.value}`)
    .then((res) => res.json())
    .then((data) => {
      let allItem = "";
      if (data.meals) {
        data.meals.map((meal) => {
          allItem += `<div class="col-md-3">
                    <div class="item" mealId="${meal.idMeal}">
                    <a href="#" class="recipe-btn">
                        <img src = "${meal.strMealThumb}" id="meal-thumb" class="w-100 img-fluid">
                        <p id="meal-name">${meal.strMeal}</p>
                    </a>
                    </div>
                </div>`;
        });
        row.classList.remove("wrongMsg");
      } else {
        allItem = `Sorry, We Didn't Match Your Meal!`;
        row.classList.add("wrongMsg");
      }
      if (input.value === "") {
        allItem = `Please Type A Food Name`;
        row.classList.add("wrongMsg");
      }
      document.getElementById("row").innerHTML = allItem;
    });
}

// meal id found
row.addEventListener("click", (e) => {
  const meals = e.path.find((item) => {
    if (item.classList) {
      return item.classList.contains("item");
    } else {
      return false;
    }
  });
  if (meals) {
    const mealId = meals.getAttribute("mealId");
    getMealId(mealId);
  }
});

// get meal id
function getMealId(mealId) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
    .then((response) => response.json())
    .then((data) => {
      const meal = data.meals[0];
      mealDetailsContent(meal);
      mealItems.style.display='none';
      contentDetails.style.display='block'
    });
}

function mealDetailsContent(meal) {
  let strIngredient = [];
  for (let i = 1; i <= 15; i++) {
    if (meal[`strIngredient${i}`]) {
        strIngredient.push(
            `${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}`
        );
    }
  }
  let mealDetails= `
  <div class="row mt-3 mb-3">
      <div class="col-md-6 m-auto">
          <div id="meal-contents">
              <img src="${meal.strMealThumb}" class="img-fluid" />
          </div>
          <div class="meal-name">
              <h2>${meal.strMeal}</h2>
          </div>
              <span id="indgra-heading">Ingradients</span>
          <ul id="ingradients">
          ${strIngredient.map(ingradient=>`<li><span><i class="fas fa-check-square"></i></span> ${ingradient}</li>`).join(' ')}
          </ul>
          <button id="btn">Back To Home</button>
      </div>
  </div>
  `
  document.getElementById("meal-details").innerHTML = mealDetails;
  const btn = document.getElementById('btn')
btn.addEventListener('click', ()=>{
  contentDetails.style.display = 'none';
  mealItems.style.display='block';

})
}
