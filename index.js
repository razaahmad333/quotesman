let page = 1
let query = ""
let author = ""

const prevBtn = document.querySelector(" #previous")
const nextBtn = document.querySelector(" #next ")

const first = document.querySelector(" #first ")
const second = document.querySelector(" #second ")
const third = document.querySelector(" #third ")

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
  updatePagination()
}

nextBtn.onclick = () => {
  if (page === 100) {
    return
  }
  page++
  updatePagination()
}

[first, second, third].forEach((element) => {
  element.onclick = () => {
    page = parseInt(element.textContent)
    updatePagination()
  }
})

fetchQuotes()

function updatePagination() {
  if (page === 1) {
    prevBtn.parentElement.classList.add("disabled")
  }

  if (page > 1) {
    prevBtn.parentElement.classList.remove("disabled")
  }

  first.parentElement.classList.remove("active")
  second.parentElement.classList.remove("active")

  if (page > 1) {
    first.textContent = page - 1
    second.textContent = page
    third.textContent = page + 1
    second.parentElement.classList.add("active")
  } else {
    first.textContent = page
    second.textContent = page + 1
    third.textContent = page + 2
    first.parentElement.classList.add("active")
  }

  if (page > 100) {
    nextBtn.parentElement.classList.add("disabled")
  }
  fetchQuotes()
}

function fetchQuotes() {
  let url = `https://api.quotable.io/quotes/random?page=${page}&limit=20`
  if (query) {
    url = `https://api.quotable.io/search/quotes?query=${query}`
  }
  if (author) {
    url = `https://api.quotable.io/quotes?author=${author}`
  }

  fetch(url)
    .then((response) => {
      return response.json()
    })
    .then((jsondata) => {
      const quotes = jsondata.results || jsondata
      updateCardsWithQuotes(quotes)
    })
    .catch((error) => {
      console.log(error)
    })
}

function updateCardsWithQuotes(quotes) {
  const quoteContainer = document.querySelector(".quoteContainer")
  quoteContainer.innerHTML = ""
  quotes.forEach((quote) => {
    const template = `
      <div class="col-sm-12 mb-4 col-md-4">
        <div class="card text-black bg-white" style="height:180px;">
          <div class="card-header">${quote.author || "Unknown"}</div>
          <div class="card-body">
            <p class="card-text" title=${quote.content} >${quote.content.slice(0, 150)}</p>
          </div>
        </div>
      </div>
 `
    quoteContainer.innerHTML += template
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
        authorDropdown.classList.remove("show")
        fetchQuotes()
      }
    }
  })
  authorDropdown.classList.add("show")
}