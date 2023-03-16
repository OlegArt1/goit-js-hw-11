// Search gallery

import axios from 'axios';

import { SimpleLightbox } from '../simplelightbox/dist/simple-lightbox.js';

import '../simplelightbox/dist/simple-lightbox-min.css';

const gallery = document.querySelector('.gallery');

const formElement = document.querySelector('.search-form');

const inputElement =  document.querySelector('input');

const buttonElement = document.querySelector('.load-more');

let count = 1;

buttonElement.style.display = 'none';

formElement.addEventListener('submit', (e) =>
{
    e.preventDefault();

    count = 1;
    
    gallery.innerHTML = '';
   
    const name = inputElement.value.trim();

    if (name !== "")
    {
        pixabay(name);
    }
    else
    {
        buttonElement.style.display = 'none';

        console.log("\nSorry, there are no images matching your search query. Please try again!");

        return Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again!');
    }
});
refs.btnLoadMore.addEventListener('click', () =>
{
    const name = inputElement.value.trim();
  
    count += 1;
  
    pixabay(name, count);
});
async function pixabay (name, count)
{
    const url = 'https://pixabay.com/api/';

    const options =
    {
        params:
        {
            key: '33717102-715c10c4f2cae8a60768f134f', q: name,
            
            image_type: 'photo', orientation: 'horizontal', safesearch: 'true',
            
            page: page, per_page: 40
        }
    };
    try
    {
        const response = await axios.get(url, options);

        notification(response.data.hits.length, response.data.hits);

        createMarkup(response.data);
    } 
    catch (error)
    {
        console.log("\n Error: " + error.name + " - " + error.message);
    }
}
function createMarkup (data)
{
    const markup = data.hits.map(item =>
    {
        `<a class="photo-link" href="${item.largeImageURL}">` +
            '<div class="photo-card">' +
                '<div class="photo">' +
                    '<img src="${item.webformatURL}" alt="${item.tags}" loading="lazy"/>' +
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

    }).sort().join('');

    gallery.insertAdjacentHTML('beforeend', markup);

    simpleLightBox.refresh();
}
const simpleLightBox = new SimpleLightbox('.gallery a',
{
    captionsData: 'alt',

    captionDelay: 250
});
function notification (total_length, hits)
{
    if (total_length === 0)
    {
        Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again!");

        console.log("\nSorry, there are no images matching your search query. Please try again!");
    
        return;
    }
    else if (count === 1)
    {
        refs.btnLoadMore.style.display = 'flex';

        Notiflix.Notify.success(`Hooray! We found ${hits} images.`);

        console.log("\nHooray! We found " + hits + " images.");
    }
    else if (total_length < 40)
    {
        refs.btnLoadMore.style.display = 'none';

        Notiflix.Notify.warning("We're sorry, but you've reached the end of search results!");

        console.log("\nWe're sorry, but you've reached the end of search results!");
    }
}