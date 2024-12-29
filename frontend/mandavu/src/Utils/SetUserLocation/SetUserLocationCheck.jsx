

import { useSelector } from "react-redux";
import SetUserLocationModal from "./SetUserLocationModal";


const UserLocationCheck = ({ children }) => {
    const userLocation = useSelector((state) => state.user.userLocation);

    // Render modal if userLocation is not set, otherwise render children
    if (!userLocation) {
        return <SetUserLocationModal />;
    }

    return <>{children}</>;
};


export default UserLocationCheck;