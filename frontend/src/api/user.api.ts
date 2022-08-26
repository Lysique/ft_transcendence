import { UserDto } from "./dto/user.dto";

export class UserAPI {
  
  public static async isLoggedIn(): Promise<{loggedIn: boolean}> {
    const resp = await fetch(`http://${process.env.REACT_APP_BACKEND_HOST}:${process.env.REACT_APP_BACKEND_PORT}/auth/isLogged`, {
      credentials: "include",
      method: "GET"
    });
    
    return (resp.ok? resp.json() : {loggedIn: false});
  }
  
  public static async logout() {
    await fetch(`http://${process.env.REACT_APP_BACKEND_HOST}:${process.env.REACT_APP_BACKEND_PORT}/auth/logout`, {
      method: "DELETE", 
      credentials: "include",
    })
  }
  
  public static async getUserProfile(): Promise<UserDto | null> {
    const resp = await fetch(`http://${process.env.REACT_APP_BACKEND_HOST}:${process.env.REACT_APP_BACKEND_PORT}/users/profile`, {
        credentials: "include",
        method: "GET"
      });
      
      return (resp.ok? resp.json() : null);
    }

  public static async getVisitorProfile(id: string): Promise<UserDto | null> {
    const resp = await fetch(`http://${process.env.REACT_APP_BACKEND_HOST}:${process.env.REACT_APP_BACKEND_PORT}/users/profile/${id}`, {
        credentials: "include",
        method: "GET"
      });
      
      return (resp.ok? resp.json() : null);
    }

    public static async addAvatar(formData: FormData) {
      await fetch(`http://${process.env.REACT_APP_BACKEND_HOST}:${process.env.REACT_APP_BACKEND_PORT}/users/avatar`, {
        credentials: "include",
        method: "POST",
        body: formData
    })
    
  }

  public static async getAllAvatars() {
    const resp = await fetch(`http://${process.env.REACT_APP_BACKEND_HOST}:${process.env.REACT_APP_BACKEND_PORT}/users/avatars`, {
      credentials: "include",
      method: "GET"
    });

    return (resp.ok? resp.json() : null);
  }

  public static async removeAvatar(id: number) {
    await fetch(`http://${process.env.REACT_APP_BACKEND_HOST}:${process.env.REACT_APP_BACKEND_PORT}/users/avatar/${id}`, {
        credentials: "include",
        method: "DELETE"
    })
  }

  public static async updateAvatar(id: number) {
    const resp = await fetch(`http://${process.env.REACT_APP_BACKEND_HOST}:${process.env.REACT_APP_BACKEND_PORT}/users/avatar/${id}`, {
      credentials: "include",
      method: "POST"
    });

    return (resp.ok? resp.json() : null);
  }

  public static async updateName(name: string): Promise<UserDto | null> {
    const resp = await fetch(`http://${process.env.REACT_APP_BACKEND_HOST}:${process.env.REACT_APP_BACKEND_PORT}/users/updateName`, {
      credentials: "include",
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ name: name})
    });
    
    return (resp.ok? resp.json() : null);
  }

  public static async disableTfa(): Promise<UserDto | null> {
    const resp = await fetch(`http://${process.env.REACT_APP_BACKEND_HOST}:${process.env.REACT_APP_BACKEND_PORT}/users/turnOffTfa`, {
      credentials: "include",
      method: "POST",
    });
    
    return (resp.ok? resp.json() : null);
  }

  public static async generateQrCode(): Promise<Blob | null> {
    const resp = await fetch(`http://${process.env.REACT_APP_BACKEND_HOST}:${process.env.REACT_APP_BACKEND_PORT}/auth/2fa/generate`, {
      credentials: "include",
      method: "GET",
    });

    return (resp.ok? resp.blob() : null);
  }

  public static async validateTfa(code: string) {
    const resp = await fetch(`http://${process.env.REACT_APP_BACKEND_HOST}:${process.env.REACT_APP_BACKEND_PORT}/auth/2fa/validate`, {
      credentials: "include",
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ code: code})
    });
    return (resp.ok? resp.json() : null);
  }
}