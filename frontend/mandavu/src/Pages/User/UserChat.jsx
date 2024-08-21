import ChatLayout from "../../Components/Common/ChatLayout";

import Navb from "../../Components/User/Navb";
import Sidebar from "../../Components/User/Sidebar";


export default function UserChat(){
    return(
        <> 
          <Navb/>
          <Sidebar/>
          <ChatLayout/>
        </>
    )
}