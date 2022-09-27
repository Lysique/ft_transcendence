import { UserDto } from "./dto/user.dto";

export interface RoomType {
    roomName : string;
    owner : number;
    admin : Set<number>;
    messages: Array<string>;
    userSet : Set<UserDto>;
};

export class ChatAPI {

  public static async getRoomsFromUser(): Promise<{ rooms: RoomType[] }> {
    return {rooms : []};

    const resp = await fetch(
      `http://${process.env.REACT_APP_BACKEND_HOST}:${process.env.REACT_APP_BACKEND_PORT}/chat/userRooms`,
      {
        credentials: "include",
        method: "GET",
      }
    );

    return resp.ok ? resp.json() : {rooms : []};
  }

  public static async getAllRoomNames(): Promise<{ rooms: string[] }> {
    return {rooms : []};

    const resp = await fetch(
      `http://${process.env.REACT_APP_BACKEND_HOST}:${process.env.REACT_APP_BACKEND_PORT}/chat/roomNames`,
      {
        credentials: "include",
        method: "GET",
      }
    );

    return resp.ok ? resp.json() : {rooms : []};
  }
}
