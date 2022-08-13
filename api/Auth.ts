import axios, {AxiosResponse} from 'axios';

async function emailCheck(
  email: string,
  success: (data: AxiosResponse) => void,
) {
  try {
    const response = await axios.get(`http://10.0.2.2:8002/auth/check/email`, {
      params: {email: email},
    });
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
    const response = await axios.get(`http://10.0.2.2:8002/auth/check/name`, {
      params: {name: name},
    });
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
    const response = await axios.post(`http://10.0.2.2:8002/auth/register`, {
      email: email,
      name: name,
      password: password,
    });
    success(response);
  } catch (err) {
    console.log(err);
  }
}

async function signIn(
  email: string,
  password: string,
  success: (data: AxiosResponse) => void,
) {
  try {
    const response = await axios.post(`http://10.0.2.2:8002/auth/login`, {
      email: email,
      password: password,
    });
    success(response);
  } catch (err: any) {
    console.log(err);
  }
}
export {emailCheck, nickNameCheck, signUp, signIn};
