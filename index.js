let page = 1
let maxPage = 100
let query = ""
let author = ""
const gradients = [
  "linear-gradient(45deg, #4E80D6, #66A9FF)",
  "linear-gradient(45deg, #8054D6, #BF66FF)",
  "linear-gradient(45deg, #50A364, #7BCD91)",
  "linear-gradient(45deg, #FF6767, #FFB845)",
  "linear-gradient(45deg, #FFD766, #F05A6D)",
  "linear-gradient(45deg, #F567A6, #FFB845)",
  "linear-gradient(45deg, #FFA83D, #FFB845)",
  "linear-gradient(45deg, #45D6C5, #82FFB4)",
  "linear-gradient(45deg, #213B64, #2B587A)",
  "linear-gradient(45deg, #502B64, #764A95)",
  "linear-gradient(135deg, #FF6B6B 0%, #FFC3A0)",
]

let gradientIndex = -1


const prevBtn = document.querySelector(" #previous")
const nextBtn = document.querySelector(" #next ")

const first = document.querySelector(" #first ")
const second = document.querySelector(" #second ")
const third = document.querySelector(" #third ")

fetchQuotes()
populateChooseThemeContainer()

document.querySelector("#query").onkeyup = (event) => {
  query = event.target.value

}
document.querySelector("#search").onclick = () => {
  fetchQuotes()
}


prevBtn.onclick = () => {
  if (page === 1) {
    return
  }
  page--
  fetchQuotes()
}

nextBtn.onclick = () => {
  if (page === maxPage) {
    return
  }
  page++
  fetchQuotes()
}

[first, second, third].forEach((element) => {
  element.onclick = () => {
    page = parseInt(element.textContent)
    if (page > maxPage) {
      page = maxPage
    }
    fetchQuotes()
  }
})

setTimeout(() => {
  document.querySelector(".alert").remove()
}, 3000)


function updatePagination() {
  const paginationItems = [prevBtn, nextBtn, first, second, third]

  paginationItems.forEach(item => {
    item.parentElement.classList.remove("active", "disabled")
  })

  if (page === 1) {
    prevBtn.parentElement.classList.add("disabled")
  }
  if (page === maxPage) {
    nextBtn.parentElement.classList.add("disabled")
  }

  let [firstPage, secondPage, thirdPage] = [page, page + 1, page + 2]

  if (page > 1) {
    [firstPage, secondPage, thirdPage] = [page - 1, page, page + 1]
  }

  first.textContent = firstPage
  second.textContent = secondPage
  third.textContent = thirdPage;

  [first, second, third].forEach((el, index) => {
    if (parseInt(el.textContent) > maxPage) {
      el.parentElement.classList.add("disabled")
    }
    if (page === firstPage + index) {
      el.parentElement.classList.add("active")
    }
  })

}

function disabledPagination() {
  const paginationItems = [prevBtn, nextBtn, first, second, third]
  paginationItems.forEach(item => {
    item.parentElement.classList.add("disabled")
  })
}

function enablePagination() {
  const paginationItems = [prevBtn, nextBtn, first, second, third]
  paginationItems.forEach(item => {
    item.parentElement.classList.remove("disabled")
  })
}


function fetchQuotes() {

  let url = `https://api.quotable.io/quotes/random?page=${page}&limit=20`
  if (author) {
    url = `https://api.quotable.io/quotes?author=${author}&page=${page}`
  }
  if (query) {
    url = `https://api.quotable.io/search/quotes?query=${query}`
  }

  disabledPagination()

  fetch(url)
    .then((response) => {
      return response.json()
    })
    .then((jsondata) => {
      enablePagination()
      const quotes = jsondata.results || jsondata
      maxPage = jsondata.totalPages || 100
      updateCardsWithQuotes(quotes)
      updatePagination()
    })
    .catch((error) => {
      console.log(error)
    })
}

function getRandomGradient() {
  const randomIndex = Math.floor(Math.random() * gradients.length)
  return gradients[randomIndex]
}


function populateChooseThemeContainer() {
  const chooseThemeContainer = document.querySelector("#chooseThemeContainer")
  const pathName = window.location.pathname
  if (pathName === "/instagram-mode.html") {
    chooseThemeContainer.innerHTML = `
    <button class="btn col-2 ml-2 rounded mb-4" style="background:""; height:40px;" id="-1"  >
    `
    gradients.forEach((gradient, index) => {
      chooseThemeContainer.innerHTML += `
      <button class="btn col-2 ml-2 rounded mb-4" style="background:${gradient}; height:40px;" id="${index}"  >
    </button>
      `
    })

    document.querySelectorAll("#chooseThemeContainer button").forEach((button) => {
      button.onclick = () => {
        gradientIndex = parseInt(button.id)
        console.log(gradientIndex)
        document.querySelectorAll(".card").forEach((card) => {
          card.style.background = gradientIndex === -1 ? getRandomGradient() : gradients[gradientIndex]
        })
      }
    })
  }
}

function getCardTemplate(pathName, quote) {
  if (pathName === "/instagram-mode.html") {
    const windowWidth = window.innerWidth > 768 ? 360 : window.innerWidth - 50
    const gradient = gradientIndex === -1 ? getRandomGradient() : gradients[gradientIndex]
    return `
    <div class="col-sm-12 mb-4 col-md-4">
      <div class="card text-white" style="height:${windowWidth}px; background: ${gradient};">
        <div class="card-body d-flex flex-column justify-content-center align-items-center text-center">
          <p class="card-text text-white mb-4" style="font-size:1.1rem;" title=${quote.content}>${quote.content.slice(0, 350)}</p>
          <p class="h5 text-white author-head mt-4" style="text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);"> ~ ${quote.author || "Unknown"}</p>
        </div>
      </div>
    </div>
    `

  }
  return `
      <div class="col-sm-12 mb-4 col-md-4">
        <div class="card text-black bg-white" style="">
          <div class="card-header author-head btn">${quote.author || "Unknown"}</div>
          <div class="card-body">
            <p class="card-text text-muted" title=${quote.content} >${quote.content.slice(0, 350)}</p>
          </div>
            <a href="whatsapp://send?text=${quote.content}       by ${quote.author || "Unknown"}" class="btn share">Share</a>
        </div>
      </div>
`
}

function updateCardsWithQuotes(quotes) {
  const quoteContainer = document.querySelector(".quoteContainer")
  quoteContainer.innerHTML = ""
  const pathName = window.location.pathname

  quotes.forEach((quote) => {
    quoteContainer.innerHTML += getCardTemplate(pathName, quote)
  })

  document.querySelectorAll(".author-head ").forEach((header) => {
    header.onclick = () => {
      author = header.textContent
      document.querySelector("#author_search_text").value = author
      page = 1
      fetchQuotes()
    }
  })
}


const authorDropdown = document.querySelector("#author_dropdown")

document.querySelector("#author_search_text").onkeyup = (event) => {
  const author_query = event.target.value
  debouncedAuthorSearch(author_query)
}

let timer
function debouncedAuthorSearch(author_query) {
  clearTimeout(timer)
  timer = setTimeout(() => {
    handleSearchAuthors(author_query)
  }, 1000)
}

function handleSearchAuthors(author_query) {
  fetchAuthors(author_query)
}


function fetchAuthors(author_query) {
  if (!author_query) {
    author = ""
    fetchQuotes()
    return
  }
  fetch(`https://api.quotable.io/search/authors?query=${author_query}&limit=40`)
    .then((response) => {
      return response.json()
    }
    )
    .then((jsondata) => {
      const authors = jsondata.results
      updateAuthorDropdown(authors)
    })
}

function updateAuthorDropdown(authors) {
  authorDropdown.innerHTML = ""
  authors.forEach((author) => {
    const template = `<a class="dropdown-item" href="#">${author.name}</a>`
    authorDropdown.innerHTML += template
  })

  if (authors.length === 0) {
    authorDropdown.innerHTML = `<a class="dropdown-item" href="#">No results found</a>`
  }

  authorDropdown.innerHTML += `<a class="dropdown-item" href="#" id="closeDropdown">Close</a>`

  const dropdownItems = document.querySelectorAll("#author_dropdown a")
  dropdownItems.forEach((item) => {
    item.onclick = () => {
      if (item.textContent === "No results found" || item.textContent === "Close") {
        authorDropdown.classList.remove("show")
        return
      } else {
        document.querySelector("#author_search_text").value = item.textContent
        author = item.textContent
        page = 1
        authorDropdown.classList.remove("show")
        fetchQuotes()
      }
    }
  })
  authorDropdown.classList.add("show")
}