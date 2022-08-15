import { UserDto } from "./dto/user.dto";

export class UserAPI {
    public static async getUserProfile(): Promise<UserDto> {
        const resp = await fetch("http://localhost:3000/auth/profile", {
            method: "GET"
        })
        const data = await resp.json();
        return data;
    }

    public static async login() {
        const resp = await fetch("http://localhost:3000/auth/login", {
            method: "GET",
        })
        const data = await resp.json();
        return data;
    }

    public static async logout() {
        const resp = await fetch("http://localhost:3000/auth/logout", {
            method: "GET"
        })
        const data = await resp.json();
        return data;
    }

    public static async getAll(): Promise<UserDto[]> {
        const resp = await fetch("http://localhost:3000/users", {
            method: "GET"
        })
        const data = await resp.json();
        return data;
    }
}