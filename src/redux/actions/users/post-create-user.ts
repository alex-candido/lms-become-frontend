import { api } from '@/lib/api';

interface IUserDataProps {
  name: string;
  email: string;
  password: string;
  username: string;
}

export const createUser = async ({
 ...props
}: IUserDataProps): Promise<any> => {
  try {
    const url = `/auth/register`;
    return await api.post(url, props);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }
  }
};
