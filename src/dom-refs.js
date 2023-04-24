export const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  input: document.querySelector('.search-form input'),
};

export function clearGallery() {
  refs.gallery.innerHTML = '';
}
