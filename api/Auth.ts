import axios, {AxiosResponse} from 'axios';
import {REACT_APP_API_URL} from '@env';

async function emailCheck(
  email: string,
  success: (data: AxiosResponse) => void,
) {
  try {
    console.log(REACT_APP_API_URL);
    const response = await axios.get(
      `http://146.56.188.32:8002/auth/check/email`,
      {
        params: {email: email},
      },
    );
    success(response);
  } catch (err) {
    console.log(err);
  }
}

async function nickNameCheck(
  name: string,
  success: (data: AxiosResponse) => void,
) {
  try {
    console.log(1);
    const response = await axios.get(
      `http://146.56.188.32:8002/auth/check/name`,
      {
        params: {name: name},
      },
    );
    success(response);
  } catch (err) {
    console.log(err);
  }
}

async function signUp(
  email: string,
  name: string,
  password: string,
  success: (data: AxiosResponse) => void,
) {
  try {
    const response = await axios.post(
      `http://146.56.188.32:8002/auth/register`,
      {
        email: email,
        name: name,
        password: password,
      },
    );
    console.log(response);
    success(response);
  } catch (err: any) {
    console.log(err.response.data.msg);
  }
}

async function signIn(
  email: string,
  password: string,
  success: (data: AxiosResponse) => void,
) {
  try {
    const response = await axios.post(`http://146.56.188.32:8002/auth/login`, {
      email: email,
      password: password,
    });
    success(response);
  } catch (err: any) {
    console.log(err);
  }
}
export {emailCheck, nickNameCheck, signUp, signIn};
