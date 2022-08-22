import { UserDto } from "../api/dto/user.dto"
import { Homepage } from "../route/Homepage"
import { Profile } from "../route/Profile"

interface RouteProps {
    handleToggle: React.ButtonHTMLAttributes<HTMLButtonElement>["onClick"]
    user: UserDto | null
    setUser: any
    route: string
    setRoute: any
}

export const RouteHandler = ({
    handleToggle,
    user,
    setUser,
    route,
    setRoute,

    }: RouteProps) => {

    // Profile
    if (route === 'Profile') {
        return (
            <Profile
            user={user}
            setUser={setUser}
            />
        )
    }

    // Homepage
    else if (route === 'Homepage') {
        return (
            <Homepage />
        )
    }

    else {
        return (
            <h1>Path not defined</h1>
        )
    }
}