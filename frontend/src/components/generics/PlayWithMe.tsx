import ConfirmationPopup from "components/utils/ConfirmationPopup";
import PwMPopUp from "components/utils/PwMPopUp";
import { WebsocketContext } from "contexts/WebsocketContext";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function PlayWithMe() {
  const socket = useContext(WebsocketContext);

  const [inviterName, setInviterName] = useState<string>("");
  const [inviterId, setInviterId] = useState<number>(0);
  const [openInvitation, setOpenInvitation] = useState<boolean>(false);
  const [validation, setValidation] = useState<boolean>(false);
  const [answered, setAnswered] = useState<boolean>(false);

  useEffect(() => {
    socket.on("wantToPlay", ({ name, id }: { name: string; id: number }) => {
      setInviterName(name);
      setInviterId(id);
      setOpenInvitation(true);
    });
    return () => {
      socket.off("wantToPlay");
    };
  }, [socket]);

  useEffect(() => {
    socket.on("closeInvite", () => {
      setOpenInvitation(false);
    });
    return () => {
      socket.off("closeInvite");
    };
  }, [socket]);

  useEffect(() => {
    if (answered === true) {
      socket.emit("answerToInvite", { answer: validation, inviterId: inviterId });
      setValidation(false);
      setAnswered(false);
    }
  }, [validation, inviterId, socket, answered]);

  const [openRefused, setOpenRefused] = useState<boolean>(false);

  useEffect(() => {
    socket.on("inviteRefused", ({ userName }) => {
      console.log(userName);
      //TODO: popup to tell inviter that userName declined his request to play
      setOpenRefused(true);
    });
    return () => {
      socket.off("inviteRefused");
    };
  }, [socket]);

  const navigate = useNavigate();
  useEffect(() => {
    socket.on("gameReady", () => {
      navigate("/game");
    });
    return () => {
      socket.off("gameReady");
    };
  });

  return (
    <div>
      <PwMPopUp
        open={openInvitation}
        setOpen={setOpenInvitation}
        setValidation={setValidation}
        setAnswered={setAnswered}
        title={"Wanna play with me?"}
        message={`${inviterName} wants to play a little game with you, up for the challenge?`}
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
