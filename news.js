'use strict';

function importinf (category) {
    fetch(
        `https://content.guardianapis.com/search?q=${category}&show-tags=all&page-size=2
        0&show-fields=all&order-by=relevance&api-key=0cc1c5bc-7fe4-47bc-80cc-f17c13b
        e193c`,
        )
        .then(response => response.json())
        .then(response => console.log(response));
        
}


let navbarmenu = document.querySelector('.menu');

navbarmenu.addEventListener("click", (event) => {
    event.target.classList.toggle('opened');
    event.target.setAttribute('aria-expanded', event.target.classList.contains('opened'));
    const categoriesList = document.querySelector('[data-role="categories-list"]');
    categoriesList.classList.toggle("hidden-menu");
});
let mybutton = document.getElementById("myBtn");

window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}
let scrollToTop = document.querySelector('#myBtn');
scrollToTop.addEventListener("click", (event) => {
    window.scroll({
        top: 0,
        behavior: 'smooth'
    })
});
