import * as React from 'react';
import { UserDto } from '../../../api/dto/user.dto';

interface ProfileNameProps {
  user: UserDto | null
  setUser: any
  visitor: boolean
}

export default function ProfileName({
  user,
  setUser,
  visitor

}: ProfileNameProps) {

  return (
    <>
    {user?.name}
    </>
  );
}