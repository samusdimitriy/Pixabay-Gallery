export function imagesTemplate(hits) {
  return hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
          <a href="${largeImageURL}" class="photo-card">
            <img src="${webformatURL}" alt="${tags}" data-source="${largeImageURL}" />
            <div class="info">
              <p class="info-item"><b>Likes:</b> ${likes}</p>
              <p class="info-item"><b>Views:</b> ${views}</p>
              <p class="info-item"><b>Comments:</b> ${comments}</p>
              <p class="info-item"><b>Downloads:</b> ${downloads}</p>
            </div>
          </a>`;
      }
    )
    .join('');
}

function appendImagesMarkup(markup) {
  refs.gallery.insertAdjacentHTML('beforeend', markup);
  refs.loadMoreBtn.disabled = false;
}
