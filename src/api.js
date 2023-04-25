const API_KEY = '35686876-5d6c301705e2d3bbb33c976fd';
const BASE_URL = 'https://pixabay.com/api/';

export async function getImages(query, page, perPage) {
  const url = `${BASE_URL}?image_type=photo&orientation=horizontal&q=${query}&page=${page}&per_page=${perPage}&key=${API_KEY}`;

  const response = await fetch(url);
  const data = await response.json();
  console.log(data);

  if (!response.ok) {
    throw new Error(data.message || 'Unable to get images');
  }

  return data;
}
