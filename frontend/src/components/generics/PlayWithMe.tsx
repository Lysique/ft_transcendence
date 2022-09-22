import ConfirmationPopup from "components/utils/ConfirmationPopup";
import PwMPopUp from "components/utils/PwMPopUp";
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
  const [answered, setAnswered] = useState<boolean>(false);

  useEffect(() => {
    if (answered === true) {
      socket.emit("answerToInvite", { answer: validation, id: userId });
      setValidation(false);
      setAnswered(false);
    }
  }, [validation, userId, socket, answered]);

  useEffect(() => {
    socket.on("closeInvite", () => {
      setOpen(false);
    });
    return () => {
      socket.off("closeInvite");
    };
  }, [socket]);

  const [openRefused, setOpenRefused] = useState<boolean>(false);

  useEffect(() => {
    socket.on("inviteRefused", ({ userName }) => {
      console.log(userName);
      setOpenRefused(true);
    });
    return () => {
      socket.off("inviteRefused");
    };
  }, [socket]);

  return (
    <div>
      <PwMPopUp
        open={open}
        setOpen={setOpen}
        setValidation={setValidation}
        setAnswered={setAnswered}
        title={"Wanna play with me?"}
        message={`${inviter} wants to play a little game with you, up for the challenge?`}
      />
      <ConfirmationPopup
        open={openRefused}
        setOpen={setOpenRefused}
        message={"Your invite was declined!"}
      />
    </div>
  );
}

export default PlayWithMe;
