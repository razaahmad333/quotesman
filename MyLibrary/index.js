console.log("lo mai aa gya");
let quotes;
fetch("https://type.fit/api/quotes")
  .then((response) => {
    return response.json();
  })
  .then((jsondata) => {
    quotes = jsondata.splice(0, 10);
    console.log(quotes[0]);
    updateCardsWithQuotes();
  })
  .catch((error) => {
    console.log(error);
  });

// console.log(quoteBoxes);

let hearts = document.querySelectorAll(".heart");
hearts.forEach((heart) => {
  heart.onclick = () => {
    heart.textContent !== "favorite"
      ? (heart.textContent = "favorite")
      : (heart.textContent = "favorite_border");
  };
});

function updateCardsWithQuotes() {
  let i = 0;
  let quoteBoxes = document.querySelectorAll(".card");
  quoteBoxes.forEach((box) => {
    console.log();
    box.children[0].textContent = quotes[i].author;
    box.children[1].textContent = quotes[i].text;
    i++;
  });
}
