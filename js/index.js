// Gallery

import axios from '../node_modules/axios/dist/esm/axios.js';

import SimpleLightbox  from '../simplelightbox/simple-lightbox.esm.js';

const body = document.querySelector("body");

const gallery = document.querySelector("div.gallery");

const searchForm = document.querySelector(".search-form");

const searchInput = document.querySelector(".input");

const searchButton = document.querySelector("button");

const buttonElement = document.querySelector(".learn-more");

let count = 1;

const refs =
{
    form: document.querySelector('.search-form'),

    input: document.querySelector('input'),

    gallery: document.querySelector('.gallery'),

    btnLoadMore: document.querySelector('.load-more'),
};
refs.btnLoadMore.style.display = 'none';

refs.form.addEventListener('submit', onSearch);

refs.btnLoadMore.addEventListener('click', onBtnLoadMore);

function onSearch (evt)
{
    evt.preventDefault();

    count = 1;

    refs.gallery.innerHTML = '';

    const name = refs.input.value.trim();

    if (name !== '')
    {
        pixabay(name);
    }
    else
    {
        refs.btnLoadMore.style.display = 'none';

        return body.setAttribute("body", Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.'));
    }
}
function onBtnLoadMore()
{
    const name = refs.input.value.trim();
  
    count += 1;
  
    pixabay(name, count);
}
async function pixabay (name, count)
{
    // https://jsonplaceholder.typicode.com/photos;
    
    const API_URL = 'https://pixabay.com/api/';
    
    const options =
    {
        params:
        {
            key: '33717102-715c10c4f2cae8a60768f134f', q: name,
            
            image_type: 'photo', orientation: 'horizontal',
            
            safesearch: 'true', page: count, per_page: 40
        }
    };
    try
    {
        const response = await axios.get(API_URL, options);

        notification(response.data.hits.length, response.data.total);

        createMarkup(response.data);
    }
    catch (error)
    {
        console.log(error);
    }
}
const simpleLightBox = new SimpleLightbox('.gallery a',
{
    captionsData: 'alt',

    captionDelay: 250,
});
function createMarkup (data)
{
    const markup = data.hits.map(item =>
    {
        `<a class="photo-link" href="${item.largeImageURL}">` +
            '<div class="photo-card">' +
                '<div class="photo">' +
                    `<img src="${item.webformatURL}" alt="${item.tags}" loading="lazy"/>` +
                '</div>' +
                '<div class="info">' +
                    '<p class="info-item">' +
                        `<b>Likes</b>${item.likes}` +
                    '</p>' +
                    '<p class="info-item">' +
                        `<b>Views</b>${item.views}` +
                    '</p>' +
                    '<p class="info-item">' +
                        `<b>Comments</b>${item.comments}` +
                    '</p>' +
                    '<p class="info-item">' +
                        `<b>Downloads</b>${item.downloads}` +
                    '</p>' +
                '</div>' +
            '</div>' +
        '</a>'

    }).join('');

    //simpleLightBox.refresh();
}
function notification (total_length, hits)
{
    if (total_length === 0)
    {
        body.setAttribute("body", Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again!"));

        console.log("\nSorry, there are no images matching your search query. Please try again!");
    
        return;
    }
    else if (count === 1)
    {
        refs.btnLoadMore.style.display = 'flex';

        body.setAttribute("body", Notiflix.Notify.success(`Hooray! We found ${hits} images.`));

        console.log("\nHooray! We found " + hits + " images.");
    }
    else if (total_length < 40)
    {
        refs.btnLoadMore.style.display = 'none';

        body.setAttribute("body", Notiflix.Notify.warning("We're sorry, but you've reached the end of search results!"));

        console.log("\nWe're sorry, but you've reached the end of search results!");
    }
}