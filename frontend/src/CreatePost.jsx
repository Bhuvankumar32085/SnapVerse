import { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar";
import { Button } from "./components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "./components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { readFileAsDataUrl } from "./lib/utils";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "./redux/postSlice";

export const CreatePost = ({ open, setOpen }) => {
  const imageref = useRef();
  const [file, setFile] = useState("");
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreviewset] = useState("");
  const [loading, setLoading] = useState(false);
  const {user}=useSelector(store=>store.auth)
  const dispatch=useDispatch()
  const {posts}=useSelector(store=>store.post)

  const fileChangeHandler = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const dataUrl = await readFileAsDataUrl(file);
      setImagePreviewset(dataUrl);
    }
  };

  const createPostHandler = async () => {
    setLoading(true);
    const formdata = new FormData();
    if (imagePreview) formdata.append("image", file);
    formdata.append("caption", caption);

    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/post/addpost`,
        formdata,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(setPost([res.data.post,...posts]))
        toast.success(res.data.message);
        setLoading(false);
        setOpen(false)
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.response.data.message);
    }
  };

  return (
    <div>
      <Dialog open={open}>
        <DialogContent onInteractOutside={() => setOpen(false)}>
          <DialogHeader className="font-semibold text-2xl text-center">
            Create New Post
          </DialogHeader>
          <div className="flex gap-3 items-center">
            <Avatar>
              <AvatarImage src={user?.profilePicture} alt="img" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-semibold text-xm">{user?.username}</h1>
              <span className="text-gray-600 text-xm">Bio here</span>
            </div>
          </div>
          <Textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="focus-visible:ring-transparent border-none"
            placeholder="Write a caption..."
          />
          {imagePreview && (
            <div className="w-full h-64 flex items-center justify-center">
              <img
                className="object-cover h-full w-full rounded-md"
                src={imagePreview}
              />
            </div>
          )}
          <input
            type="file"
            className="hidden"
            ref={imageref}
            onChange={fileChangeHandler}
          />
          <Button
            onClick={() => imageref.current.click()}
            className="w-fit mx-auto bg-[#0094f6bd] hover:bg-[#0095F6]"
          >
            Select from computer
          </Button>
          {imagePreview &&
            (loading ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button
                onClick={createPostHandler}
                type="submit"
                className="w-full"
              >
                Post
              </Button>
            ))}
        </DialogContent>
      </Dialog>
    </div>
  );
};
