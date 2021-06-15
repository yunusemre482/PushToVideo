import axios from 'react-native-axios';

const url='http://192.168.2.2:4000';

const api = axios.create({
  baseURL: url,
});

export default api;