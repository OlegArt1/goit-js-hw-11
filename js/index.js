// Gallery

import axios from '../axios/axios.js';

import SimpleLightbox  from '../simplelightbox/simple-lightbox.esm.js';

const body = document.querySelector("body");

const gallery = document.querySelector(".gallery");

const form = document.querySelector(".search-form");

const inputSearch = document.querySelector(".input");

const buttonElement = document.querySelector(".load-more");

const buttonSearch = document.querySelector("button");

let count = 1;

buttonElement.style.display = 'none';

form.addEventListener('submit', (e) =>
{
    e.preventDefault();

    count = 1;

    gallery.innerHTML = '';

    const name = inputSearch.value.trim();

    if (name !== '')
    {
        pixabay(name);
    }
    else
    {
        buttonElement.style.display = 'none';

        return body.setAttribute("body", Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again!'));
    }
});
buttonElement.addEventListener('click', () =>
{
    const name = inputSearch.value.trim();
  
    count++;
  
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
            
            image_type: 'photo', orientation: 'horizontal',
            
            safesearch: 'true', page: count, per_page: 40
        }
    };
    try
    {
        const response = await axios.get(url, options);

        notification(response.data.hits.length, response.data.total);

        addListApiItems(response.data);
    }
    catch (error)
    {
        body.setAttribute("body", Notiflix.Notify.failure("Error name - " + error.name + ";" + " Error message - " + error.message + ";"));

        console.log("\nError name - " + error.name + ";" + " Error message - " + error.message + ";");
    }
}
const simpleLightBox = new SimpleLightbox('.gallery a',
{
    captionsData: 'alt',

    captionDelay: 250
});
function addListApiItems (data_api)
{
    const markup = data_api.hits.map(item =>
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

    }).join("");

    //simpleLightBox.refresh();
}
function notification (input_length, total_hits)
{
    if (input_length === 0)
    {
        body.setAttribute("body", Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again!"));

        console.log("\nSorry, there are no images matching your search query. Please try again!");
    
        return;
    }
    else if (input_length < 40)
    {
        buttonElement.style.display = 'none';

        body.setAttribute("body", Notiflix.Notify.warning("We're sorry, but you've reached the end of search results!"));

        console.log("\nWe're sorry, but you've reached the end of search results!");
    }
    else if (count === 1)
    {
        buttonElement.style.display = 'flex';
        
        buttonElement.style.alignItems = 'center';
        
        buttonElement.style.justifyContent = 'center';

        body.setAttribute("body", Notiflix.Notify.success(`Hooray! We found ${total_hits} images.`));

        console.log("\nHooray! We found " + total_hits + " images.");
    }
}