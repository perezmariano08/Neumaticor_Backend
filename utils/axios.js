import axios from 'axios';

// Crea una instancia de axios con configuraciones predeterminadas
const api = axios.create({
    baseURL: '/api', // URL base para todas las solicitudes a la API
    timeout: 30000,  // Tiempo de espera para solicitudes en milisegundos (aumentado a 30 segundos)
    headers: {
        'Content-Type': 'application/json',
    },
});


export default api;
