import SimpleLightbox from 'simplelightbox';

export function onOpenModal(e) {
  if (e.target.nodeName !== 'IMG') {
    return;
  }

  SimpleLightbox.open({
    items: [e.target.dataset.source],
  });
}

export function onCloseModal(e) {
  if (e.target.nodeName !== 'IMG') {
    return;
  }

  SimpleLightbox.close();
}
