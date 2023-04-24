import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { imagesTemplate } from './template.js';
import { getImages } from './api.js';
import { refs, clearGallery } from './dom-refs.js';

const PER_PAGE = 40;
let page = 1;
let searchQuery = '';

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
    const images = await getImages(query, page, PER_PAGE);
    const { hits, totalHits } = images;

    if (hits.length === 0) {
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

    const displayedImagesCount = page * PER_PAGE;

    if (displayedImagesCount >= totalHits) {
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }
  } catch (error) {
    console.log(error);
  }
}

function initModal(galleryContainer) {
  const lightbox = new SimpleLightbox(`${galleryContainer} a`);

  lightbox.on('show.simplelightbox', e => {
    const id = e.relatedTarget.dataset.id;
    lightbox.currentImageIndex = id;
  });

  const overlay = document.querySelector('.sl-overlay');
  overlay.addEventListener('click', () => {
    lightbox.close();
  });
}

function appendImagesMarkup(markup) {
  refs.gallery.insertAdjacentHTML('beforeend', markup);
}

window.addEventListener('scroll', () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

  if (clientHeight + scrollTop >= scrollHeight - 5) {
    page += 1;
    fetchAndRenderImages(searchQuery, page);
  }
});
