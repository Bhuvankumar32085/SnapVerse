import React, { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { setAuthUser } from "@/redux/authSlice";

function EditProfile() {
  const imageRef = useRef();
  const { user } = useSelector((store) => store.auth);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [input, setInput] = useState({
    profilePicture: user?.profilePicture,
    bio: user?.bio,
    gender: user?.gender,
  });

  console.log(user);
  console.log(imageRef);

  const fileEventhandler = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setInput({ ...input, profilePicture: file });
    }
  };

  const editProfileHandler = async () => {
    console.log(input);
    const formData = new FormData();
    formData.append("bio", input.bio);
    formData.append("gender", input.gender);
    if (input.profilePicture) {
      formData.append("profilePicture", input.profilePicture);
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `https://snapverse-lcwk.onrender.com/api/v1/user/profile/edit`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        let updatedUserData = {
          ...user,
          bio: res.data.user?.bio,
          profilePicture: res.data.user?.profilePicture,
          gender: res.data.user?.gender,
        };
        dispatch(setAuthUser(updatedUserData));
        toast.success(res.data.message);
        navigate(`/profile/${user?._id}`);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const selectChangeHandler = async (value) => {
    setInput({ ...input, gender: value });
  };

  return (
    <div className="flex max-w-2xl mx-auto pl-10">
      <section className="flex flex-col gap-6 w-full">
        <h1 className="font-bold text-xl">Edit Profile</h1>
        <div className="flex gap-3 items-center bg-gray-100 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={user?.profilePicture} />
              <AvatarFallback>{user?.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-semibold text-sm">{user?.username}</h1>
              <span className="text-gray-600 text-sm">
                {user?.bio || "bio here..."}
              </span>
            </div>
          </div>
          <input
            type="file"
            className="hidden"
            ref={imageRef}
            onChange={fileEventhandler}
          />
          <Button
            onClick={() => imageRef?.current.click()}
            className="bg-[#0095F6] h-8 hover:bg-[#0094f6cc]"
          >
            Change photo
          </Button>
        </div>
        <div>
          <h1 className="font-bold text-sl mb-2">Bio</h1>
          <Textarea
            value={input.bio}
            onChange={(e) => setInput({ ...input, bio: e.target.value })}
            name="bio"
            className="focus-visible:ring-transparent"
          />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-bold text-sl mb-2">Gender</h1>
            <Select
              defaultValue={input?.gender}
              onValueChange={selectChangeHandler}
            >
              <SelectTrigger className="w-[108px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
            {loading ? (
              <Button
                disabled
                className="bg-[#0095F6] h-8 hover:bg-[#0094f6cc] mt-6"
              >
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Plese wait
              </Button>
            ) : (
              <Button
                onClick={editProfileHandler}
                className="bg-[#0095F6] h-8 hover:bg-[#0094f6cc] mt-6"
              >
                Submit
              </Button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default EditProfile;
