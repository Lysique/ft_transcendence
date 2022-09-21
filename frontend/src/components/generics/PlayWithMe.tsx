import ValidationPopup from "components/utils/ValidationPopup";
import { WebsocketContext } from "contexts/WebsocketContext";
import { useContext, useEffect, useState } from "react";

function PlayWithMe() {
  const socket = useContext(WebsocketContext);

  const [inviter, setInviter] = useState<string>("");
  const [userId, setUserId] = useState<number>(0);

  useEffect(() => {
    socket.on("wantToPlay", ({ name, id }: { name: string; id: number }) => {
      setInviter(name);
      setUserId(id);
      setOpen(true);
    });
    return () => {
      socket.off("wantToPlay");
    };
  }, [socket]);

  const [open, setOpen] = useState<boolean>(false);
  const [validation, setValidation] = useState<boolean>(false);

  useEffect(() => {
    if (validation === true) {
      socket.emit("answerToInvite", { answer: validation, id: userId });
      setValidation(false);
    } else {
      console.log("TO be fixed");
    }
  }, [validation, userId, socket]);

  return (
    <ValidationPopup
      open={open}
      setOpen={setOpen}
      setValidation={setValidation}
      title={"Wanna play with me?"}
      message={`${inviter} wants to play a little game with you, up for the challenge?`}
    />
  );
}

export default PlayWithMe;
