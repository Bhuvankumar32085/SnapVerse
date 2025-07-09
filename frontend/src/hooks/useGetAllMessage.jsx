import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { setMessages } from "@/redux/chatSlice";

function useGatAllMessage() {
  const { selecteduser } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  console.log(selecteduser)
  useEffect(() => {
    const fetchAllMessage = async () => {
      try {
        const res = await axios.get(
          `https://snapverse-lcwk.onrender.com/api/v1/message/all/${selecteduser?._id}`,
          {
            withCredentials: true,
          }
        );
        if (res.data.success) {
          dispatch(setMessages(res.data.messages));
        }
      } catch (error) {
        console.log(error);
        toast.error("Get Message Error");
      }
    };
    fetchAllMessage();
  }, [selecteduser]);
}

export default useGatAllMessage;
