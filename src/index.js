import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import InfiniteScroll from 'infinite-scroll';
import { imagesTemplate } from './template.js';
import { getImages } from './api.js';
import { refs, clearGallery } from './dom-refs.js';
import { onOpenModal } from './modal.js';

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

refs.loadMoreBtn.addEventListener('click', onLoadMore);

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
    refs.loadMoreBtn.classList.remove('is-hidden');
    refs.loadMoreBtn.disabled = false;

    if (page === 1) {
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    }

    if (page > 1) {
      const { height: cardHeight } =
        refs.gallery.firstElementChild.getBoundingClientRect();
      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    }

    initModal();
  } catch (error) {
    console.log(error);
  }
}

function onLoadMore() {
  fetchAndRenderImages(searchQuery, page);
}

function appendImagesMarkup(markup) {
  refs.gallery.insertAdjacentHTML('beforeend', markup);
}

const lightbox = new SimpleLightbox('.photo-card a');
refs.gallery.addEventListener('click', onOpenModal);

function onOpenModal(e) {
  e.preventDefault();
  if (e.target.nodeName !== 'IMG') {
    return;
  }
  lightbox.open(e.target.dataset.source);
}

const infScroll = new InfiniteScroll(refs.gallery, {
  responseType: 'text',
  history: false,
  path: function () {
    return `https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=${searchQuery}&page=${this.pageIndex}&per_page=${PER_PAGE}&key=23401698-135e50ce95e5557a31c167a52`;
  },
  append: '.photo-card',
  status: '.infinite-scroll-status',
});

infScroll.on('load', function (response) {
  const data = JSON.parse(response);
  appendImagesMarkup(imagesTemplate(data.hits));
  this.pageIndex++;
});

infScroll.on('error', function (error) {
  console.log(`Error: ${error}`);
});

infScroll.on('last', function () {
  refs.loadMoreBtn.classList.add('is-hidden');
  Notiflix.Notify.info(
    "We're sorry, but you've reached the end of search results."
  );
});
