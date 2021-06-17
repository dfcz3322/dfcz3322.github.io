'use strict';

const spinner = document.querySelector(".spin");
const navbarmenu = document.querySelector('.menu');
const scrollToTop = document.querySelector('.scroll-to-top');
const categoriesList = document.querySelector('[data-role="categories-list"]');``
const input = document.querySelector('.navbarsearch');
const searchButton = document.querySelector('[data-icon="search-button"]');
const searchDropdown = document.querySelector('[data-role="searchDropdown"]');

function getArticles(category) {
    fetch(
        `https://content.guardianapis.com/search?q=${category}&show-tags=all&page-size=20&show-fields=all&order-by=newest&api-key=0cc1c5bc-7fe4-47bc-80cc-f17c13be193c`,
        {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(response => {
            renderArticleTiles(response.response.results);
            spinner.style.display = "none";
        });
}

function renderArticleTiles(articlesData) {
    const articlesContainer = document.querySelector('[data-role="articles-container"]');
    const bannerContainer = document.querySelector('[data-role="banner-container"]');
    
    articlesContainer.innerHTML = "";
    bannerContainer.innerHTML = "";

    const firstArticle = articlesData.shift();

    const bannerMarkup = `
            <div class="banner__text" onclick="localStorage.setItem('lastImg', '${firstArticle.fields.thumbnail}');localStorage.setItem('lastTitle', '${firstArticle.fields.headline}');window.location.href = window.location.href.replace('index', 'article')">
                <div>
                    <h1 class="banner__title" data-title="search-title" data-img-src="${firstArticle.fields.thumbnail}">${firstArticle.fields.headline}</h1>
                    <p class="banner__description">${firstArticle.fields.trailText}</p>
                </div>
                <div class="flex-row banner-between">
                    <p class="date">${new Date(firstArticle.fields.firstPublicationDate).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <p class="read-more">Read more</p>
                </div>
            </div>
            <div class="banner-img">
                <img src="${firstArticle.fields.thumbnail}">
            </div>`

    bannerContainer.innerHTML += bannerMarkup;

    articlesData.forEach((article) => {
        const articleMarkup =
            `<div class="box" onclick="localStorage.setItem('lastImg', '${article.fields.thumbnail}');localStorage.setItem('lastTitle', '${article.fields.headline}');window.location.href = window.location.href.replace('index', 'article')">
                <div class="prompt-img">
                    <img src="${article.fields.thumbnail}">
                </div>
                <h1 class="box__title" data-title="search-title" data-img-src="${article.fields.thumbnail}">${article.fields.headline}</h1>
                <p class="box__description">${article.fields.trailText}</p>
                <div class="flex-row box-between">
                    <p class="date">${new Date(article.fields.firstPublicationDate).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <p class="read-more">Read more</p>
                </div>
            </div>`

        articlesContainer.innerHTML += articleMarkup;
    });
}


navbarmenu.addEventListener("click", (event) => {
    event.target.classList.toggle('opened');
    event.target.setAttribute('aria-expanded', event.target.classList.contains('opened'));
    categoriesList.classList.toggle("hidden-menu");
});

categoriesList.addEventListener("click", (event) => {
    if (!event.target.dataset.category) {
        return;
    }

    getArticles(event.target.dataset.category);
});


window.onload = () => {
    if (window.location.href.includes("index")) {
        scrollToTop.addEventListener("click", () => {
            window.scroll({
                top: 0,
                behavior: 'smooth'
            })
        });
        getArticles("trending");
    } 
    if (window.location.href.includes("article")) {
        const image = document.querySelector('[data-role="major-img"]');
        const title = document.querySelector('[data-role="title"]');
        image.src = localStorage.getItem('lastImg');
        title.innerText = localStorage.getItem('lastTitle');
    }
}

function onSearch() {
    const titles = document.querySelectorAll('[data-title="search-title"]');
    const filteredTitles = Array.from(titles)
        .filter(title => {
            return title.innerText.toLowerCase().includes(input.value.toLowerCase());
        })
        .map(title => ({ title: title.innerText, imgSrc: title.dataset.imgSrc }));
    
    searchDropdown.innerHTML = "";

    if (filteredTitles.length && input.value.length >= 2) {
        filteredTitles.forEach((item) => {
            const titleMarkup = 
            `<div class="search-item" onclick="localStorage.setItem('lastImg', '${item.imgSrc}');localStorage.setItem('lastTitle', '${item.title}');window.location.href = window.location.href.replace('index', 'article')">
                <p>${item.title}</p>
            </div>`
            searchDropdown.innerHTML += titleMarkup;
        });

        searchDropdown.style.display = "block";
    } else {
        searchDropdown.style.display = "none";
    }
}

window.onscroll = () => {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        scrollToTop.style.display = "block";
    } else {
        scrollToTop.style.display = "none";
    }
};

searchButton.addEventListener('click', () => {
    onSearch();
 });
 
 document.addEventListener('keypress', (event) => {
     if (event.key === 'Enter' && input === document.activeElement) {
         onSearch();
     }
 });

 input.addEventListener("input", (event => {
    if (!event.target.value) {
        searchDropdown.style.display = "none";
    }
}));