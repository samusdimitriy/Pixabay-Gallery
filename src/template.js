export function imagesTemplate(hits) {
  console.log(hits);
  return hits
    .map(
      (
        {
          webformatURL,
          largeImageURL,
          tags,
          likes,
          views,
          comments,
          downloads,
        },
        index
      ) => {
        return `
          <a href="${largeImageURL}" class="photo-card" data-id="${index}">
            <img src="${webformatURL}" alt="${tags}" />
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
