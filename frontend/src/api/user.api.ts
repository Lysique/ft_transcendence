import { UserDto } from "./dto/user.dto";

export class UserAPI {
    
    public static async getUserProfile(): Promise<UserDto | null> {
        return fetch(`http://${process.env.REACT_APP_BACKEND_HOST}:${process.env.REACT_APP_BACKEND_PORT}/auth/profile`, {
            credentials: "include",
        }).then((response) => {
            if (response.ok) {
              return response.json();
            }
            throw new Error('Something went wrong');
          })
          .then((responseJson) => {
            return responseJson;
          })
          .catch((error) => {
            return null;
        });
    }

    public static async logout() {
        await fetch(`http://${process.env.REACT_APP_BACKEND_HOST}:${process.env.REACT_APP_BACKEND_PORT}/auth/logout`, {
            method: "GET", 
            credentials: "include",
        })
    }

    public static async addAvatar(formData: FormData) {
      await fetch (`http://${process.env.REACT_APP_BACKEND_HOST}:${process.env.REACT_APP_BACKEND_PORT}/users/avatar`, {
        method: "POST", 
        credentials: "include",
        body: formData,
      })
    }
}