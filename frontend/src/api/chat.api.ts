import { UserDto } from "./dto/user.dto";

export type RoomType = {
    roomName : string;
    owner : number;
    admin : Set<number>;
    messages: Array<string>;
    password : string;
    userSet : Set<UserDto>;
    mutedMap : Map<number,Date>;
    banMap : Map<number,Date>;//not number date
};

export class ChatAPI {
  public static async getRoomsFromUser(): Promise<{ rooms: RoomType[] } | null> {
    const resp = await fetch(
      `http://${process.env.REACT_APP_BACKEND_HOST}:${process.env.REACT_APP_BACKEND_PORT}/chat/userRooms`,
      {
        credentials: "include",
        method: "GET",
      }
    );

    return resp.ok ? resp.json() : null;
  }
}
