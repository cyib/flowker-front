import axios from 'axios';
import environment from '../Environments/environment';

const http = axios.create({
  baseURL: environment.baseURL,
  headers: {
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Expires': '0',
  }
});


export default http;