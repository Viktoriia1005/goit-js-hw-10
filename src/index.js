import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import fetchCountries from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

function onInputChange() {
  const isFilled = refs.input.value.trim();
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
  if (isFilled) {
    fetchCountries(isFilled)
      .then(machFound)
      .catch(error => {
        return Notify.failure('Oops, there is no country with that name');
      });
  }

  function markup(data) {
    const markupData = data
      .map(({ flags: { svg }, name: { official } }) => {
        return `<li><img src="${svg}" alt="${official}" width="80" height="40"/>${official}</li>`;
      })
      .join('');

    if (data.length === 1) {
      const languages = Object.values(data[0].languages).join(', ');

      const markupInfo = `<ul>
      <li>Capital: ${data[0].capital}</li>
      <li>Population: ${data[0].population}</li>
      <li>Languages: ${languages}</li>
      </ul>`;

      refs.countryInfo.insertAdjacentHTML('afterbegin', markupInfo);
    }
    return refs.countryList.insertAdjacentHTML('afterbegin', markupData);
  }

  function machFound(data) {
    if (data.length > 10) {
      Notify.info('Too many matches found. Please enter a more specific name.');
      return;
    }
    markup(data);
  }
}

refs.input.addEventListener('input', debounce(onInputChange, DEBOUNCE_DELAY));
