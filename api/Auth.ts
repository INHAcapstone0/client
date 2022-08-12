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
    console.log(1);
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
    console.log(1);
  }
}

async function signUp(
  email: string,
  name: string,
  password: number,
  success: (data: AxiosResponse) => void,
) {
  try {
    const response = await axios.post(`http://10.0.2.2:8002/auth/check/name`, {
      params: {email: email, name: name, password: password},
    });
    success(response);
  } catch (err) {
    console.log(1);
  }
}

export {emailCheck, nickNameCheck, signUp};
