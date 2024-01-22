
import axios from 'axios'


const api_key = import.meta.env.VITE_API_KEY



const baseUrl = 'https://api.openweathermap.org/data/2.5'


const getCurrentWeather = (latitude, longitude) => {
    return axios.get(`${baseUrl}/weather?lat=${latitude}&lon=${longitude}&appid=${api_key}`).then(response => response.data)
}


export default { getCurrentWeather }