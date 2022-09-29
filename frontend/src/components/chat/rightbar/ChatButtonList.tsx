import Menu from '@mui/material/Menu';
import { ChatButtonGlobalOption } from './ChatButtonGlobalOptions';
import { ChatButtonAdminOption } from './ChatButtonAdminOptions';
import { UserDto } from 'api/dto/user.dto';
import { RoomDto } from 'api/chat.api';

interface ChatButtonListProps {
    displayedUser: UserDto
    room: RoomDto | null
    open: null | HTMLElement
    handleClose: () => void
}

export const ChatButtonList = ({
    displayedUser,
    room,
    open,
    handleClose,

}: ChatButtonListProps ) => {

    return (
      <Menu
        id="contact-appbar"
        anchorEl={open}
        anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        open={Boolean(open)}
        onClose={handleClose}
      >
      
      <ChatButtonGlobalOption
        chosenUser={displayedUser}
        handleClose={handleClose}
      />

      <ChatButtonAdminOption 
          chosenUser={displayedUser}
          handleClose={handleClose}
          room={room}
      />
      
      </Menu>
    )
}