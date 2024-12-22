import { Children, createContext, useContext, useState } from "react";
import ChatNotificationCmp from "../../Components/Common/ChatNotificationCmp";


const NotificationContext = createContext();


export const useNotification = ()=> useContext(NotificationContext)

 const NotificationProvider = ({children}) => {
    const [notifications, setNotifications] = useState([])

    const addNotification = (notification) => {
        setNotifications((prev) => [...prev, notification]);
    };

    const removeNotification = (id) => {
        setNotifications((prev)=> prev.filter((n) => n.id !==id));
    };

    return(

        <NotificationContext.Provider value={{ addNotification}}>

         {children}
          {notifications.map((notification)=> (
                    <ChatNotificationCmp
                    key={notification.id}
                    username={notification.username}
                    content={notification.content}
                    onClose={()=> removeNotification(notification.id)}
                    
                    />

          ))}


        </NotificationContext.Provider>
    )
}


export default NotificationProvider;