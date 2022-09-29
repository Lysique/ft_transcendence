import Menu from '@mui/material/Menu';
import { ChatButtonGlobalOption } from './ChatButtonGlobalOptions';
import { ChatButtonAdminOption } from './ChatButtonAdminOptions';
import { UserDto } from 'api/dto/user.dto';

interface ChatButtonListProps {
    displayedUser: UserDto
    open: null | HTMLElement
    handleClose: () => void
    adminRights: boolean
}

export const ChatButtonList = ({
    displayedUser,
    open,
    handleClose,
    adminRights

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

      { 
        adminRights &&
        <ChatButtonAdminOption 
          chosenUser={displayedUser}
          handleClose={handleClose}
        />
      }
      </Menu>
    )
}