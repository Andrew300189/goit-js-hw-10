import axios from 'axios';

const API_KEY = 'live_7tei2nqce6ALMVJ73WZIoUzd4Fv3VN7LJovaUmdqQ85ok6WVozOfa3coc6ARxbKS';
axios.defaults.headers.common['x-api-key'] = API_KEY;

export async function fetchBreeds() {
  const response = await axios.get('https://api.thecatapi.com/v1/breeds');
  return response.data;
}

export async function fetchCatByBreed(breedId) {
  const response = await axios.get(
    `https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`
  );
  return response.data[0];
}
