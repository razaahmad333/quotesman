console.log("lo mai aa gya");
let quotes;

// https://www.boredapi.com/api/activity

fetch("https://type.fit/api/quotes")
  .then((response) => {
    return response.json();
  })
  .then((jsondata) => {
    quotes = jsondata.splice(0, 20);
    // console.log(quotes[0]);
    updateCardsWithQuotes();
  })
  .catch((error) => {
    console.log(error);
  });

fetch("https://www.boredapi.com/api/activity")
  .then((res) => res.json())
  .then((data) => console.log(data));

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
