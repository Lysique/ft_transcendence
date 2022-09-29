import * as React from 'react';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import { UserDto } from 'api/dto/user.dto';
import { RoomDto } from 'api/chat.api';
import { UserContext } from 'App';
import { UserChatOpenButton } from './UserChatOpenButton';
import { ChatButtonList } from './ChatButtonList';

interface ContactsProps {
  users: UserDto[] | null
  room: RoomDto | null
}

export const Contacts = ({
  users,
  room
}: ContactsProps ) => {

  const user: UserDto | null = React.useContext(UserContext);
  const [friends, setFriends] = React.useState<UserDto[]>([]);
  const [otherUsers, setOtherUsers] = React.useState<UserDto[]>([]);

  React.useEffect(() => {
    if (user && user.friends) {
      setFriends(user.friends);
    }
    setOtherUsers(users? users : [])
  }, [user, users]);

  const [openContact, setOpenContact] = React.useState<null | HTMLElement>(null);

  const handleOpenContact = (event: React.MouseEvent<HTMLElement>) => {
    setOpenContact(event.currentTarget);
  };
    
  const handleCloseContact = () => {
    setOpenContact(null);
  };

  const [openFriend, setOpenFriend] = React.useState<null | HTMLElement>(null);

  const handleOpenFriend = (event: React.MouseEvent<HTMLElement>) => {
    setOpenFriend(event.currentTarget);
  };
    
  const handleCloseFriend = () => {
    setOpenFriend(null);
  };
  

  return (
    <List key='contact-list'
      sx={{
        bgcolor: 'background.paper',
        overflow: 'auto',
        height: '90vh',
        '& ul': { padding: 0 },
      }}
      subheader={<li />}
      >
        <li key={`friends`}>
          <ul >
          <ListSubheader style={{textAlign:'center'}}>{`Friends`}</ListSubheader>

            {friends.map((displayedUser) => (

            <div key={displayedUser.id}>

            <UserChatOpenButton 
              displayedUser={displayedUser}
              handleOpenContact={handleOpenFriend}
            />

            <ChatButtonList 
              open={openFriend}
              handleClose={handleCloseFriend}
              displayedUser={displayedUser}
              room={null}
            />

            </div>

            ))}

          </ul>
        </li>

        <li key={`members`}>
          <ul >
            <ListSubheader style={{textAlign:'center'}}>{`Members`}</ListSubheader>

            {otherUsers.map((displayedUser) => (

            displayedUser.id !== user?.id &&

            <div key={displayedUser.id}>

            <UserChatOpenButton 
              displayedUser={displayedUser}
              handleOpenContact={handleOpenContact}
            />

            <ChatButtonList 
              open={openContact}
              handleClose={handleCloseContact}
              displayedUser={displayedUser}
              room={room}
            />

            </div>

            ))}

          </ul>
        </li>
    </List>
  );
}