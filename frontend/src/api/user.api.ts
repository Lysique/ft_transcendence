import { UserDto } from "./dto/user.dto";

export class UserAPI {
    
    public static async getUserProfile(): Promise<UserDto | null> {
        return fetch("http://localhost:3000/auth/profile", {
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
        await fetch("http://localhost:3000/auth/logout", {
            method: "GET", 
            credentials: "include",
        })
    }
}