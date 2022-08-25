import * as React from 'react';
import AuthCode from 'react-auth-code-input';
import "./styles.css";


export default function TfaInput({setResult}: any) {

  const handleOnChange = (res: string) => {
    setResult(res);
  };

  return (
    <AuthCode allowedCharacters='numeric' onChange={handleOnChange} containerClassName="container" inputClassName="input"/>
  )
}