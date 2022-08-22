import { UserDto } from "./dto/user.dto";

export class UserAPI {
    
    public static async getUserProfile(): Promise<UserDto | null> {
        return fetch(`http://${process.env.REACT_APP_BACKEND_HOST}:${process.env.REACT_APP_BACKEND_PORT}/users/profile`, {
            credentials: "include",
            method: "GET"
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
            method: "DELETE", 
            credentials: "include",
        })
    }

    public static async addAvatar(formData: FormData) {
      return fetch(`http://${process.env.REACT_APP_BACKEND_HOST}:${process.env.REACT_APP_BACKEND_PORT}/users/avatar`, {
        credentials: "include",
        method: "POST",
        body: formData
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

    public static async getCurrentAvatar(): Promise<string | null> {
      return fetch(`http://${process.env.REACT_APP_BACKEND_HOST}:${process.env.REACT_APP_BACKEND_PORT}/users/avatar`, {
        credentials: "include",
        method: "GET"
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

  public static async getAllAvatars() {
    return fetch(`http://${process.env.REACT_APP_BACKEND_HOST}:${process.env.REACT_APP_BACKEND_PORT}/users/avatars`, {
      credentials: "include",
      method: "GET"
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

  public static async removeAvatar(id: number) {
    await fetch(`http://${process.env.REACT_APP_BACKEND_HOST}:${process.env.REACT_APP_BACKEND_PORT}/users/avatar/${id}`, {
        credentials: "include",
        method: "DELETE"
    })
  }

  public static async updateAvatar(id: number) {
    return fetch(`http://${process.env.REACT_APP_BACKEND_HOST}:${process.env.REACT_APP_BACKEND_PORT}/users/avatar/${id}`, {
      credentials: "include",
      method: "POST"
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

  public static async updateName(name: string) {
    return fetch(`http://${process.env.REACT_APP_BACKEND_HOST}:${process.env.REACT_APP_BACKEND_PORT}/users/name`, {
      credentials: "include",
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name})
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
}