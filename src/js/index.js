
import Notiflix from 'notiflix';
import { fetchBreeds, fetchCatByBreed } from './cat-api.js';

const breedSelect = document.querySelector('.breed-select');
const loader = document.querySelector('.loader');
const catInfo = document.querySelector('.cat-info');
const error = document.querySelector('.error');

async function populateBreedSelect() {
  try {
    const breeds = await fetchBreeds();
    breeds.forEach((breed) => {
      const option = document.createElement('option');
      option.value = breed.id;
      option.textContent = breed.name;
      breedSelect.appendChild(option);
    });
    breedSelect.style.display = 'block';
    loader.style.display = 'none';
  } catch (error) {
    breedSelect.style.display = 'none';
    loader.style.display = 'none';
    error.style.display = 'block';
  }
}

async function fetchAndDisplayCatInfo(breedId) {
  try {
    const catData = await fetchCatByBreed(breedId);
    catInfo.innerHTML = `
      <img src="${catData.url}" alt="Кот" class="cat-image" />
      <div class="cat-details">
        <p class="cat-name">${catData.breeds[0].name}</p>
        <p class="cat-description">${catData.breeds[0].description}</p>
        <p class="cat-temperament">Темперамент: ${catData.breeds[0].temperament}</p>
      </div>
    `;
    catInfo.style.display = 'block';
    error.style.display = 'none';
  } catch (error) {
    catInfo.style.display = 'none';
    error.style.display = 'block';
  }
}

populateBreedSelect();

breedSelect.addEventListener('change', () => {
  const selectedBreedId = breedSelect.value;
  fetchAndDisplayCatInfo(selectedBreedId);
});
