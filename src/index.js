import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import { ApiService } from './api';
import { imagesTemplate } from './template';
import { refs } from './dom-refs';
import 'simplelightbox/dist/simple-lightbox.min.css';

let lightbox = new SimpleLightbox('.gallery a', {
  captionDelay: 500,
  captionsData: 'alt',
});

const apiService = new ApiService();

refs.formEl.addEventListener('submit', onSearch);

function onSearch(e) {
  e.preventDefault();

  apiService.query = e.currentTarget.elements.searchQuery.value.trim();
  apiService.resetPage();
  clearGallery();
  if (!apiService.query) {
    return Notify.failure('Please enter a search word.');
  }
  getResults();
}

function getResults() {
  infiniteScroll.unobserve(refs.observableEl);
  renderImages();
}

export function renderImages() {
  apiService.getImages().then(({ hits, totalHits }) => {
    if (apiService.page === 1) {
      if (apiService.query === '' || !totalHits) {
        return Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
      Notify.success(`Hooray! We found ${totalHits} images.`);
    }

    imagesTemplate(hits);
    lightbox.refresh();
    infiniteScroll.observe(refs.observableEl);

    if (apiService.page === Math.ceil(totalHits / 40)) {
      infiniteScroll.unobserve(refs.observableEl);
      lightbox.refresh();
      return Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }
    apiService.enlargementPage();
  });
}

function clearGallery() {
  refs.galleryEl.innerHTML = '';
}

const options = {
  rootMargin: '400px',
  history: false,
};

const onEntry = entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && apiService.query !== '') {
      if (apiService.page === 1) return;

      renderImages();
    }
  });
};

const infiniteScroll = new IntersectionObserver(onEntry, options);
infiniteScroll.observe(refs.observableEl);
