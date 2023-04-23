export const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.getElementById('gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
  input: document.querySelector('.search-form input'),
};

export function clearGallery() {
  refs.gallery.innerHTML = '';
}

export function toggleLoadMoreBtn(isVisible) {
  if (isVisible) {
    refs.loadMoreBtn.classList.remove('is-hidden');
  } else {
    refs.loadMoreBtn.classList.add('is-hidden');
  }
}

export function showEndOfResults() {
  toggleLoadMoreBtn(false);
  Notiflix.Notify.info(
    "We're sorry, but you've reached the end of search results."
  );
}
