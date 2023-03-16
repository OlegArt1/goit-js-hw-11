
import axios from 'axios';

import Notiflix from 'notiflix';

import SimpleLightbox from 'simplelightbox';

import 'simplelightbox/dist/simple-lightbox.min.css';

const refs =
{
  form: document.querySelector('.search-form'),

  input: document.querySelector('input'),

  gallery: document.querySelector('.gallery'),

  btnLoadMore: document.querySelector('.load-more'),
};

let count = 1;

refs.btnLoadMore.style.display = 'none';
refs.form.addEventListener('submit', onSearch);
refs.btnLoadMore.addEventListener('click', onBtnLoadMore);

function onSearch(evt) {
  evt.preventDefault();

  count = 1;
  refs.gallery.inif (name !== '')
  nerHTML = '';

  const name = refs.input.value.trim();

  {
    pixabay(name);

  } else {
    refs.btnLoadMore.style.display = 'none';

    // вивести повідомлення про те, що НЕ знайдено жодного зображення
    return Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
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
    const API_URL = 'https://pixabay.com/api/';

    const options =
    {
        params:
        {
            key: '33717102-715c10c4f2cae8a60768f134f',
            q: name,
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: 'true',
            page: page,
            per_page: 40
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

    refs.gallery.insertAdjacentHTML('beforeend', markup);

    simpleLightBox.refresh();
}
const simpleLightBox = new SimpleLightbox('.gallery a',
{
    captionsData: 'alt',

    captionDelay: 250,
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