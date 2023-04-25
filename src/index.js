import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { imagesTemplate } from './template.js';
import { getImages } from './api.js';
import { refs, clearGallery } from './dom-refs.js';
// import { onOpenModal, onCloseModal } from './modal.js';

const PER_PAGE = 40;
let page = 1;
let searchQuery = '';
let displayedImagesCount = 0;
let total = 0;

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
  try {
    if (displayedImagesCount >= total && displayedImagesCount > 1) {
      console.log(displayedImagesCount);
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
      return;
    }
    const images = await getImages(query, page, PER_PAGE);
    const { hits, totalHits } = images;
    total = totalHits;

    if (hits.length === 0 || displayedImagesCount >= totalHits) {
      console.log(displayedImagesCount >= totalHits);
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    if (page === 1) {
      clearGallery();
    }

    appendImagesMarkup(imagesTemplate(hits));

    initModal('.gallery');

    displayedImagesCount += total;
  } catch (error) {
    console.log(error);
  }
}

function initModal(gallery) {
  const lightbox = new SimpleLightbox(`${gallery} a`, {});
}

function appendImagesMarkup(markup) {
  refs.gallery.insertAdjacentHTML('beforeend', markup);
  initModal('.gallery');
}

window.addEventListener('scroll', () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (clientHeight + scrollTop >= scrollHeight - 5) {
    page += 1;
    fetchAndRenderImages(searchQuery, page);
  }
});
