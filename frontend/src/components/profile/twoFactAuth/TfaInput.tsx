import { FormControl, FormHelperText } from '@mui/material';
import * as React from 'react';
import AuthCode from 'react-auth-code-input';
import "./styles.css";


export default function TfaInput({setResult, error, AuthInputRef}: any) {


const handleOnChange = (res: string) => {
    setResult(res);
};

  return (
    <>
    <FormControl sx={{ m: 3 }} error={true} variant="standard">
    <AuthCode
        allowedCharacters='numeric'
        onChange={handleOnChange}
        containerClassName="container"
        inputClassName="input"
        ref={AuthInputRef}
    />
        {error? <FormHelperText>Code invalid</FormHelperText>: ''}
    </FormControl>
    </>
  )
}