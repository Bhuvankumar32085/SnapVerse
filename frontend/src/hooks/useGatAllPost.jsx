import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { setPost } from "@/redux/postSlice"; 


function useGatAllPost() {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchAllPoat = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/v1/post/all", {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setPost(res.data.posts));
        }
      } catch (error) {
        console.log(error);
        toast.error("getAllPost error");
      }
    };
    fetchAllPoat();
  }, []);
}

export default useGatAllPost;
