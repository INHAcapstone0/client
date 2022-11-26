/* eslint-disable no-param-reassign */
import axios from 'axios';
import {useDispatch, useSelector} from 'react-redux';
import EncryptedStorage from 'react-native-encrypted-storage';

const axiosInstance = axios.create({});

axiosInstance.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    const {
      config,
      response: {status},
    } = error;
    // console.log('error.response.status', error.response.status);
    // console.log('config', config);
    if (status === 401) {
      const accessToken = await EncryptedStorage.getItem('accessToken');
      const refreshToken = await EncryptedStorage.getItem('refreshToken');
      console.log('refreshToken', refreshToken);
      console.log('accessToken', accessToken);

      try {
        const {data} = await axios.get(
          `http://146.56.190.78/users/auth/refresh`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Refresh: `${refreshToken}`,
            },
          },
        );

        console.log('data', data);

        const originalRequest = config;
        const newAccessToken = data.data.accessToken;
        const newRefreshToken = data.data.refreshToken;
        console.log('config', config);
        console.log('newAccessToken : ', data.data.accessToken);
        console.log('newRefreshToken : ', data.data.refreshToken);

        EncryptedStorage.setItem('accessToken', newAccessToken);
        EncryptedStorage.setItem('refreshToken', newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return axios(originalRequest);
      } catch (err) {
        console.log('interceptors');
        console.log(err);
      }
    }
    // console.log(error);
    return Promise.reject(error);
  },
);

export default axiosInstance;
