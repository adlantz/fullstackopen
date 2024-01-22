import { useState, useEffect } from 'react'
import countryService from './services/countries'
import weatherService from './services/weather'


const SearchField = ({ countryFilter, handleCountryFilterChange }) => {
  return (
    <div>
      find countries <input value={countryFilter} onChange={handleCountryFilterChange} />
    </div>
  )
}





const SearchResult = ({ countryFilter, countries, setCountryFilter, weather, setWeather }) => {

  if (!countries) {
    return null
  }

  const filteredCountries = countries.filter(country => country['name']['common'].toLowerCase().includes(countryFilter.toLowerCase()))

  if (filteredCountries.length === 1) {
    const countryData = filteredCountries[0]

    return (
      <>
        <h1>{countryData['name']['common']}</h1>
        <div>capital {countryData['capital'][0]}</div>
        <div>area {countryData['area']}</div>
        <h2>Languages</h2>
        <ul>
          {Object.values(countryData['languages']).map(langStr => <li key={langStr}>{langStr}</li>)}
        </ul>
        <img src={countryData['flags']['png']} alt={countryData['flags']['alt']} width={200} />
        <h1>Weather</h1>
        <CountryWeather countryFilter={countryFilter} countryLatLng={countryData['latlng']} weather={weather} setWeather={setWeather} />
      </>
    )
  }

  if (filteredCountries.length === 0) {
    return <div>No matches found.</div>
  }

  if (filteredCountries.length > 10) {
    return <div>Too many matches, specify another filter</div>
  }





  return (
    <ul>
      {
        filteredCountries.map(
          country => {
            return (
              <li key={country['name']['common']}>
                {country['name']['common']} <button onClick={() => setCountryFilter(country['name']['common'])}>show</button>
              </li>
            )
          }
        )
      }
    </ul>
  )
}



const CountryWeather = ({ countryFilter, countryLatLng, weather, setWeather }) => {

  if (!!weather && countryFilter in weather) {
    return (
      <>
        <div>Temperature {weather[countryFilter]['main']['temp'] - 273.15}</div>
        <img src={`https://openweathermap.org/img/wn/${weather[countryFilter]['weather'][0]['icon']}@2x.png`} alt='icon' />
        <div>Wind {weather[countryFilter]['wind']['speed']}</div>
      </>

    )
  }

  const [latitude, longitude] = countryLatLng

  weatherService.getCurrentWeather(latitude, longitude).then(weatherData => setWeather({ [countryFilter]: weatherData }))
  return <div>Loading weather...</div>






}

const App = () => {

  const [countryFilter, setCountryFilter] = useState('')
  const [countries, setCountries] = useState(null)
  const [weather, setWeather] = useState(null)

  const handleCountryFilterChange = (event) => {
    setCountryFilter(event.target.value)
  }


  useEffect(() => {
    countryService.getAll().then(initialCountries => {
      setCountries(initialCountries)
    })
  }, [])




  return (
    <>
      <SearchField countryFilter={countryFilter} handleCountryFilterChange={handleCountryFilterChange} />
      <SearchResult countryFilter={countryFilter} countries={countries} setCountryFilter={setCountryFilter} weather={weather} setWeather={setWeather} />
    </>
  )
}

export default App
