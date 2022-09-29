import { MenuItem } from "@mui/material";
import DangerousIcon from '@mui/icons-material/Dangerous';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import React from "react";
import { UserDto } from "api/dto/user.dto";
import { ChooseSentenceTimePopup } from "./ChooseSentenceTimePopup";

enum Sentence {
    none = -1,
    ban = 0,
    mute = 1
}

export const BanMuteButton = ({user}: {user: UserDto}) => {

    const [open, setOpen] = React.useState<boolean>(false);
    const [sentence, setSentence] = React.useState<Sentence>(Sentence.none);
    const [time, setTime] = React.useState<number>(-1);

    const handleBan = () => {
        setSentence(Sentence.ban);
        setOpen(true);
    };

    const handleMute = () => {
        setSentence(Sentence.mute);
        setOpen(true);
    };

    const handleSentence = () => {
        setOpen(false);
        setSentence(Sentence.none);
        setTime(-1);
    }

    return (
        <>
        <MenuItem onClick={handleBan}><DangerousIcon/><p style={{ marginLeft: "15px" }} >Ban user</p></MenuItem>
        <MenuItem onClick={handleMute}><VolumeOffIcon/><p style={{ marginLeft: "15px" }} >Mute user</p></MenuItem>
        <ChooseSentenceTimePopup 
            open={open}
            setOpen={setOpen}
            sentence={sentence}
            handleSentence={handleSentence}
            userName={user.name}
            setTime={setTime}
        />
        </>
    )
}