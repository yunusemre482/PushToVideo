import axios from 'react-native-axios';

let url = "'http://192.168.2.2:8080/users'"

const api = axios.create({
  baseURL: url,
});

export default api;
