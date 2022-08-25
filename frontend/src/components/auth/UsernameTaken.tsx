import * as React from 'react';
import { UserAPI } from '../../api/user.api';
import { SetUserContext } from '../../App';
import { UpdateUserName } from '../profile/profileName/UpdateUserName';

export default function UsernameTaken() {

    const setUser = React.useContext(SetUserContext);

    const [open, setOpen] = React.useState(true);

    const handleClose = async () => {
        setOpen(false);
    };

    const handleCancel = async () => {
        await UserAPI.logout();
        setUser(null);
        setOpen(false);
    };

    return (
    <>
        <UpdateUserName
            open={open}
            handleClose={handleClose}
            handleCancel={handleCancel}
            message={'A little filou has taken your intra username! :shokedface: Please choose an other one.'}
        />

    </>
    );
}