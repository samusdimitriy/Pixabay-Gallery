import axios from 'axios';

const API_KEY = '35686876-5d6c301705e2d3bbb33c976fd';
axios.defaults.baseURL = 'https://pixabay.com/api';

export class ApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async getImages() {
    const params = new URLSearchParams({
      key: API_KEY,
      q: this.searchQuery,
      page: this.page,
      image_type: 'photo',
      orientaion: 'horizontal',
      per_page: 40,
    });

    try {
      const {
        data: { hits, totalHits },
      } = await axios.get('/', { params });

      return { hits, totalHits };
    } catch (error) {
      console.error(error.message);
    }
  }

  enlargementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }

  get query() {
    return this.searchQuery;
  }
}
