// 

import { data } from "./data.js";

const gallery = document.querySelector("div.gallery");

const searchForm = document.querySelector(".search-form");

const searchInput = document.querySelector(".input");

const searchButton = document.querySelector("button");

const buttonElement = document.querySelector(".learn-more");

let count = 1;

searchInput.addEventListener("input", (e) =>
{
    e.preventDefault();

    count = 1;

    gallery.innerHTML = "";

    const target_value = searchInput.value.trim();

    console.log(target_value);

    if (target_value !== '')
    {
        pixabay(name);
    }
    else
    {
        buttonElement.style.display = 'none';

        return Notiflix.Notify.failure("Sorry, t'here are no images matching your search query. Please try again.");
    }
});
function renderGalleryList (data)
{
    const markup_list = data.hits.map((card) =>
    {
        return "<div class='photo-card'>" +
                   `<img src="${card.largeImageURL}" loading='lazy' alt="${card.tags}"/>` +
                   "<div class='info'>" +
                       "<p class='info-item'>" +
                           `<b>Likes:${card.likes}</b>` +
                        "</p>" +
                        "<p class='info-item'>" +
                            `<b>Views:${card.views}</b>` +
                        "</p>" +
                        "<p class='info-item'>" +
                            `<b>Comments:${card.comments}</b>` +
                        "</p>" +
                        "<p class='info-item'>" +
                            `<b>Downloads:${card.downloads}</b>` +
                        "</p>" +
                    "</div>" +
                "</div>";

    }).sort().join("");
    
    gallery.innerHTML = markup_list;

    console.log(markup_list);
}
function fetchUsers()
{
    return fetch("https://pixabay.com/api/").then((response) =>
    {
        if (!response.ok)
        {
            if (response.status === 404)
            {
                console.log("\nError status - ", response.status + ";");

                return [];
            }
            throw new Error(response.status);
        }
        return response.json();
    });
}
async function pixabay (name, count)
{
    const url = 'https://pixabay.com/api/';

    const options =
    {
        params:
        {
            key: '33717102-715c10c4f2cae8a60768f134f',
            
            q: name, image_type: 'photo', orientation: 'horizontal',
            
            safesearch: 'true', page: 'page', per_page: 40
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
        console.log(error);
    }
}
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
        buttonElement.style.display = 'flex';

        Notiflix.Notify.success(`Hooray! We found ${hits} images.`);

        console.log("\nHooray! We found " + hits + " images.");
    }
    else if (total_length < 40)
    {
        buttonElement.style.display = 'none';

        Notiflix.Notify.warning("We're sorry, but you've reached the end of search results!");

        console.log("\nWe're sorry, but you've reached the end of search results!");
    }
}