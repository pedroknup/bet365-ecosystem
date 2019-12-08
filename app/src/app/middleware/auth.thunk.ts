import { AuthApi, LoginBody } from '../../api/api';

const loginbody: LoginBody = {
  email: 'admin@admin.com',
  password: '123123'
};
export const authThunk = async () => {
  const api = new AuthApi();
  api
    .authLoginPost(loginbody)
    .then((response) => {
      console.log(response.body);
    })
    .catch((error: any) => {
      console.log(error);
    });
};
