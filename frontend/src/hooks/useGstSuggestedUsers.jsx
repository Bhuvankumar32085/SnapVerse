import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { setSuggestedUsers } from "@/redux/authSlice";


function useGatSuggestedUsers() {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        const res = await axios.get("https://snapverse-lcwk.onrender.com/api/v1/user/suggested", {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setSuggestedUsers(res.data.users));
        }
      } catch (error) {
        console.log(error);
        toast.error("get suggested user error");
      }
    };
    fetchSuggestedUsers();
  }, []);
}

export default useGatSuggestedUsers;
