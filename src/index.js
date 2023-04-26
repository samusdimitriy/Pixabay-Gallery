import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { imagesTemplate } from './template.js';
import { getImages } from './api.js';
import { refs, clearGallery } from './dom-refs.js';

const PER_PAGE = 40;
let page = 1;
let searchQuery = '';
let displayedImagesCount = 0;
let total = 0;
let isLoading = false;

refs.form.addEventListener('submit', onSearch);

function onSearch(e) {
  e.preventDefault();

  searchQuery = e.currentTarget.elements.searchQuery.value.trim();

  if (!searchQuery) {
    Notiflix.Notify.failure('Please enter a search word.');
    return;
  }

  clearGallery();
  page = 1;

  fetchAndRenderImages(searchQuery, page);
}

async function fetchAndRenderImages(query, page) {
  if (isLoading) return;
  isLoading = true;

  try {
    const images = await getImages(query, page, PER_PAGE);
    const { hits, totalHits } = images;
    total = totalHits;

    if (hits.length === 0) {
      if (displayedImagesCount === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      }
      isLoading = false;
      return;
    }

    if (page === 1) {
      clearGallery();
    }

    appendImagesMarkup(imagesTemplate(hits));

    initModal('.gallery');

    displayedImagesCount += hits.length;
  } catch (error) {
    console.log(error);
    isLoading = false;
  }

  isLoading = false;
}

function initModal(galleryContainer) {
  const lightbox = new SimpleLightbox(`${galleryContainer} a`);
}

function appendImagesMarkup(markup) {
  refs.gallery.insertAdjacentHTML('beforeend', markup);
}

let previousScrollTop = 0;

window.addEventListener('scroll', () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

  if (clientHeight + scrollTop >= scrollHeight - 5) {
    if (displayedImagesCount >= total) {
      if (scrollTop > previousScrollTop) {
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      }
    } else {
      page += 1;
      fetchAndRenderImages(searchQuery, page);
    }
  }

  previousScrollTop = scrollTop;
});
