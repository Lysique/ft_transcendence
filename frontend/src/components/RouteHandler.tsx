import { UserDto } from "../api/dto/user.dto"
import { Homepage } from "../route/Homepage"
import { Profile } from "../route/Profile"
import { SetName } from "./auth/SetName"

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
    if (user && user.name == null) {
        return (
            <SetName setUser={setUser} />
        )
    }

    // Profile
    if (route === 'Profile') {
        return (
            <Profile
            user={user}
            setUser={setUser}
            visitor={false}
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