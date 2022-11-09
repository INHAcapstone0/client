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
    // console.log('error', error);
    const {
      config,
      response: {status},
    } = error;
    // console.log('error.response.status', error.response.status);
    // console.log('config', config);
    if (status === 401) {
      const refreshToken = EncryptedStorage.getItem('accessToken');
      const accessToken = EncryptedStorage.getItem('refreshToken');
      console.log('refreshToken', refreshToken);
      console.log('accessToken', accessToken);

      const {data} = await axios.post(
        `http://146.56.190.78/users/auth/refresh`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Refresh: `${refreshToken}`,
          },
        },
      );

      console.log('refresh response data', data);
      const originalRequest = config;
      const newAccessToken = data.data.accessToken;
      const newRefreshToken = data.data.refreshToken;

      console.log('newAccessToken : ', newAccessToken);
      console.log('newRefreshToken : ', newRefreshToken);

      EncryptedStorage.setItem('accessToken', newAccessToken);
      EncryptedStorage.setItem('refreshToken', newRefreshToken);

      // originalRequest.headers.authorization_access = newAccessToken;
      originalRequest.headers.Authorization = newAccessToken;

      return axiosInstance(originalRequest);
    }
    // console.log(error);
    return Promise.reject(error);
  },
);

export default axiosInstance;