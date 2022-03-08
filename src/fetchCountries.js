export default function fetchCountries(name) {
  const BASE_URL = 'https://restcountries.com/v3.1/name/';
  const properties = `?fields=name,capital,population,flags,languages`;

  return fetch(`${BASE_URL}${name}${properties}`).then(response => {
    if (response.status === 404) {
      return Notify.failure('Oops, there is no country with that name');
    }
    return response.json();
  });
}
