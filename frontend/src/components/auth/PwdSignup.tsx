import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material"
import { UserAPI } from "api/user.api"
import { SetUserContext } from "App"
import React from "react"

interface PwdSignupProps {
    open: boolean
    setOpen: Function
    setLoggedIn: Function
}

export const PwdSignup = ({
    open, 
    setOpen,
    setLoggedIn
    
}: PwdSignupProps) => {

    const [error, setError] = React.useState<string>('');
    const [errorPwd, setErrorPwd] = React.useState<string>('');
    const [pwd, setPwd] = React.useState<string>('');
    const [name, setName] = React.useState<string>('');
    const setUser: Function = React.useContext(SetUserContext);


    const createAccount = async() => {
        const resp = await UserAPI.pwdSignup(name, pwd);
        if (resp) {
            setLoggedIn(true);
            setUser(resp);
        }
        setOpen(false);
        setName('');
        setPwd('');
        setError('');
        setErrorPwd('');
    }

    const onSignup = () => {
        if (name === '') {
            setError('Please enter a room name')
        }
        else if (name.length > 15) {
            setError('Name too long (15 char max)')
        }
        else if (pwd.length < 5) {
            setErrorPwd('Password to short (5 char min)')
        }
        else if (pwd.length > 30) {
            setErrorPwd('Password to long (30 char max)')
        }
        else {
            createAccount();
        }
    }

    return (

    <div>
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Signup
        </DialogTitle>
        <DialogContent>

        <TextField
            error={error === '' ? false : true}
            id="outlined-name"
            label="Username"
            helperText={error}
            value={name}
            onChange={(e: any) => { setName(e.target.value) }}
            sx ={{ ml:3, mr:3 }}
            />

            <TextField
            error={errorPwd === '' ? false : true}
            id="outlined-name"
            label="password"
            helperText={errorPwd}
            value={pwd}
            onChange={(e: any) => { setPwd(e.target.value) }}
            sx ={{ ml:3, mr:3 }}
            />

        </DialogContent>
        <DialogActions>
            <Button onClick={onSignup} >
                signup 
            </Button>
            <Button onClick={() => setOpen(false)} >
                cancel 
            </Button>
        </DialogActions>
      </Dialog>
    </div>

    );
}