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
    socket.on("gameLaunched", (data: MessagePayload) => {
      console.log("Game launched");
      console.log(data);
    });
    return () => {
      console.log("unregistering Events...");
      socket.off("connect");
      socket.off("gameLaunched");
    };
  }, [socket]);

  const onSubmit = () => {
    socket.emit("events", value);
	setValue('');
  };
  const launchGame = () => {
    socket.emit("launchGame");
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
