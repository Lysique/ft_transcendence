import { Button, ListItem, ListItemAvatar, ListItemText } from "@mui/material"
import { UserDto } from "api/dto/user.dto"
import { ChatAvatar } from "./ChatAvatar"

interface UserChatButtonProps {
    displayedUser: UserDto
    handleOpenContact: (event: React.MouseEvent<HTMLElement>) => void
  }

export const UserChatButton = ({
    displayedUser,
    handleOpenContact

} : UserChatButtonProps ) => {
    
    return (
        <Button
        id="basic-button"
        aria-label="account of current user"
        aria-controls="contact-appbar"
        aria-haspopup="true"
        sx={{ textTransform: 'none' }}
        onClick={handleOpenContact}
      >
        
        <ListItem key={displayedUser.id}>
            <ListItemAvatar >
                <ChatAvatar 
                  user={displayedUser}
                />
            </ListItemAvatar>
            <ListItemText primary={
              displayedUser.name.length > 8?
              displayedUser.name.substring(8) + '...'
              :
              displayedUser.name
              } 
              sx={{ ml:2 }}
            />
        </ListItem>

        </Button>
    )
}