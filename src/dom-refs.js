export const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.getElementById('gallery'),
  input: document.querySelector('.search-form input'),
};

export function clearGallery() {
  refs.gallery.innerHTML = '';
}
