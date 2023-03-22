// Gallery

import axios from '../axios/axios.js';

import { SimpleLightbox }  from '../simplelightbox/simple-lightbox.esm.js';

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

    gallery.innerHTML = "";

    const target_value = inputSearch.value.trim();

    if (target_value !== '')
    {
        pixabay(target_value);
    }
    else
    {
        buttonElement.style.display = 'none';

        return body.setAttribute("body", Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again!"));
    }
});
buttonElement.addEventListener('click', () =>
{
    const target_name = inputSearch.value.trim();
  
    count++;
  
    pixabay(target_name, count);
});
function renderGalleryList(data)
{
    const markup_list = data.hits.map((card) =>
    {
        return "<div class='photo-card'>" +
                   `<a class="photo-link" href="${card.largeImageURL}">` +
                       `<img class='photo-image' src="${card.webformatURL}" loading='lazy' alt="${card.tags}"/>` +
                    "</a>" +
                    "<div class='info'>" +
                        "<p class='info-item'>" +
                            "<b>Likes:&nbsp;&nbsp;</b>" +
                            `${card.likes};` +
                        "</p>" +
                        "<p class='info-item'>" +
                            "<b>Views:&nbsp;&nbsp;</b>" +
                            `${card.views};` +
                        "</p>" +
                        "<p class='info-item'>" +
                            "<b>Comments:&nbsp;&nbsp;</b>" +
                            `${card.comments};` +
                        "</p>" +
                        "<p class='info-item'>" +
                            "<b>Downloads:&nbsp;&nbsp;</b>" +
                            `${card.downloads};` +
                        "</p>" +
                    "</div>" +
                "</div>";

    }).join("");
    
    gallery.innerHTML = markup_list;

    // simpleLightBox.refresh();
}
const simpleLightBox = new SimpleLightbox('.gallery a',
{
    captionsData: 'alt',

    captionDelay: 250
});
async function pixabay (name, count)
{
    const url = 'https://pixabay.com/api/';

    const options =
    {
        params:
        {
            key: '33717102-715c10c4f2cae8a60768f134f',
            
            q: name, image_type: 'photo', orientation: 'horizontal',
            
            safesearch: 'true', page: count, per_page: 40
        }
    };
    try
    {
        const response = await axios.get(url, options);

        notification(response.data.hits.length, response.data.total);

        renderGalleryList(response.data);
    }
    catch (error)
    {
        body.setAttribute("body", Notiflix.Notify.failure("Error name - " + error.name + ";" + " Error message - " + error.message + ";"));

        console.log("\nError name - " + error.name + ";" + " Error message - " + error.message + ";");
    }
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