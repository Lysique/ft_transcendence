import { Button, ListItem, ListItemAvatar, ListItemText } from "@mui/material"
import { UserDto } from "api/dto/user.dto"
import { AvatarNoStatus } from "./AvatarNoStatus"
import { ChatAvatar } from "./ChatAvatar"

interface UserChatOpenButtonProps {
    displayedUser: UserDto
    handleOpenContact: (event: React.MouseEvent<HTMLElement>) => void
    displayStatus: boolean
  }

export const UserChatOpenButton = ({
    displayedUser,
    handleOpenContact,
    displayStatus

} : UserChatOpenButtonProps ) => {
    
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
              {displayStatus?
                <ChatAvatar 
                  user={displayedUser}
                />
                :
                <AvatarNoStatus 
                  user={displayedUser}
                />
              }
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