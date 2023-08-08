// Импортируем библиотеки и функции для работы с API
import Notiflix from 'notiflix';
import { fetchBreeds, fetchCatByBreed } from './cat-api.js';
import SlimSelect from 'slim-select';

// Получаем ссылки на необходимые элементы DOM
const breedSelect = document.querySelector('.breed-select');
const loader = document.querySelector('.loader');
const catInfo = document.querySelector('.cat-info');
const error = document.querySelector('.error');

// Асинхронная функция для заполнения списка пород котов
async function populateBreedSelect() {
  try {
    // Показываем индикатор загрузки при запросе списка пород
    Notiflix.Loading.standard('Loading data, please wait...');

    // Получаем список пород с помощью функции fetchBreeds
    const breeds = await fetchBreeds();
    
    // Создаем разметку для опций с помощью метода map, используя значения из полученных пород
    const optionsMarkup = breeds
      .map((breed) => `<option value="${breed.id}">${breed.name}</option>`)
      .join('');

    // Заполняем селект сгенерированной разметкой опций
    breedSelect.innerHTML = optionsMarkup;

    // Инициализируем SlimSelect после заполнения опций в селекте
    const slimSelect = new SlimSelect({
      select: '#breed-select',
      placeholder: 'Choose a breed',
    });

    // Показываем селект и скрываем индикатор загрузки
    breedSelect.style.display = 'block';
    hideLoader();

    // Скрываем индикатор загрузки после успешного получения списка пород
    Notiflix.Loading.remove();
  } catch (error) {
    // Если возникла ошибка при получении данных, скрываем селект и индикатор загрузки, показываем сообщение об ошибке
    breedSelect.style.display = 'none';
    hideLoader();
    showError();

    // Показываем сообщение об ошибке с помощью Notiflix
    Notiflix.Notify.failure('Oops! Something went wrong! Try reloading the page!');

    // Скрываем индикатор загрузки в случае ошибки
    Notiflix.Loading.remove();
  }
}

async function fetchAndDisplayCatInfo(breedId) {
  try {
    // Показываем индикатор загрузки при запросе информации о коте
    showLoader();

    // Получаем данные о коте по выбранной породе с помощью функции fetchCatByBreed
    const catData = await fetchCatByBreed(breedId);

    // Если массив данных о коте пустой, очищаем розметку и выводим сообщение
    if (catData.length === 0) {
      clearCatInfo();
      showError();
      return;
    }

    // Формируем разметку для отображения информации о коте
    const catMarkup = `
      <img src="${catData.url}" alt="Кот" class="cat-image" />
      <div class="cat-details">
        <p class="cat-name">${catData.breeds[0].name}</p>
        <p class="cat-description">${catData.breeds[0].description}</p>
        <p class="cat-temperament">Temperament: ${catData.breeds[0].temperament}</p>
      </div>
    `;

    // Показываем информацию о коте и скрываем сообщение об ошибке
    catInfo.innerHTML = catMarkup;
    showCatInfo();
    hideError();
  } catch (error) {
    // Если возникла ошибка при получении данных о коте, показываем сообщение об ошибке
    hideCatInfo();
    showError();

    // Показываем сообщение об ошибке с помощью Notiflix
    Notiflix.Notify.failure('Oops! Something went wrong! Try reloading the page!');
  } finally {
    hideLoader();
  }
}

// Вспомогательная функция для очистки информации о коте
function clearCatInfo() {
  catInfo.innerHTML = '';
}

// Вспомогательная функция для отображения информации о коте
function showCatInfo() {
  catInfo.style.display = 'block';
}

// Вспомогательная функция для скрытия информации о коте
function hideCatInfo() {
  catInfo.style.display = 'none';
}

// Вспомогательная функция для отображения сообщения об ошибке
function showError() {
  error.style.display = 'block';
}

// Вспомогательная функция для скрытия сообщения об ошибке
function hideError() {
  error.style.display = 'none';
}

// Вспомогательная функция для отображения индикатора загрузки
function showLoader() {
  loader.style.display = 'block';
}

// Вспомогательная функция для скрытия индикатора загрузки
function hideLoader() {
  loader.style.display = 'none';
}

// Изначально скрываем информацию о коте и сообщение об ошибке
hideCatInfo();
hideError();

// Заполняем выпадающий список с помощью функции populateBreedSelect
populateBreedSelect();

// Добавляем обработчик события на изменение значения селекта
breedSelect.addEventListener('change', () => {
  const selectedBreedId = breedSelect.value;
  // При изменении значения селекта вызываем функцию fetchAndDisplayCatInfo для получения и отображения информации о коте
  fetchAndDisplayCatInfo(selectedBreedId);
});
