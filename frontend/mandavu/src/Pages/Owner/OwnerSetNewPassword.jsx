import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import OwnerSetNewPasswordCmp from "../../Components/Owner/OwnerSetNewPasswordCmp";

function useQuery() {
    return new URLSearchParams(useLocation().search);
  }


export default function OwnerSetNewPassword() {
    
  const query = useQuery();
  const uidb64 = query.get("uidb64");
  const token = query.get("token");

  useEffect(() => {
    // Perform any additional validation if needed before showing the form
  }, [uidb64, token]);

    return(
        <>

         <OwnerSetNewPasswordCmp uidb64={uidb64} token={token}/>
        </>
    )
}