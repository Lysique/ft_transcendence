import { Homepage } from "../route/Homepage"
import { Profile } from "../route/Profile"

interface RouteProps {
    handleToggle: React.ButtonHTMLAttributes<HTMLButtonElement>["onClick"]
    route: string
    setRoute: any
}

export const RouteHandler = ({
    handleToggle,
    route,
    setRoute,

    }: RouteProps) => {
    
    //  If name has not been set (already taken at login)
    // if (user && user.name == null) {
    //     return (
    //         <SetName setUser={setUser} />
    //     )
    // }

    // Profile
    if (route === 'Profile') {
        return (
            <Profile
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