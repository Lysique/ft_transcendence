import { useContext, useEffect, useState } from "react";
import { WebsocketContext } from "../contexts/WebsocketContext";

export const Websocket = () => {
  const [value, setValue] = useState("");
  const socket = useContext(WebsocketContext);

  type MessagePayload = {
	content: string;
	msg: string;
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected");
    });
    socket.on("onMessage", (data: MessagePayload) => {
      console.log("onMessage event received");
      console.log(data);
    });
    return () => {
      console.log("unregistering Events...");
      socket.off("connect");
      socket.off("onMessage");
    };
  }, []);

  const onSubmit = () => {
    socket.emit("events", value);
	setValue('');
  };
  const launchGame = () => {
    socket.emit("createGame");
  };

  return (
    <div>
      <div>
        <h1>Websocket Component</h1>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button onClick={onSubmit}>Submit</button>
        <button onClick={launchGame}>Launch game</button>
      </div>
    </div>
  );
};
