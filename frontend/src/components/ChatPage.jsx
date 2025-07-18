import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { setSelectedUser } from "@/redux/authSlice";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { MessageCircleCode } from "lucide-react";
import Messages from "./Messages";
import axios from "axios";
import { setMessages } from "@/redux/chatSlice";

function ChatPage() {
  const [textMessage,setTextMessage]=useState('')
  const { user, suggestedUsers, selecteduser } = useSelector(
    (store) => store.auth
  );
  const {OnlineUser,messages}=useSelector(store=>store.chat)
 
  const dicpatch = useDispatch();

  const sendMessageHndler=async(reciverID)=>{
    try {
      const res=await axios.post(`https://snapverse-lcwk.onrender.com/api/v1/message/send/${reciverID}`,{textMessage},{
        headers:{
          'Content-Type':'application/json'
        },
        withCredentials:true
      })
      if(res.data.success){
        dicpatch(setMessages([...messages,res.data.newMessage]))
        setTextMessage('')
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    return ()=>{
      dicpatch(setSelectedUser(null))
    }
  },[])

  return (
    <div className="flex ml=[16%] h-screen">
      <section className="w-full md:w-1/4 my-8">
        <h1 className="font-bold mb-4 px-3 text-xl">{user?.username}</h1>
        <hr className="mb-4 border-gray-300" />
        <div className="overflow-y-auto h-[80vh]">
          {suggestedUsers.map((user) => {
            const isOnline=OnlineUser.includes(user?._id)
            return (
              <div
                key={user?._id}
                onClick={() => dicpatch(setSelectedUser(user))}
                className="flex gap-3 items-center p-3 hover:bg-gray-50 cursor-pointer"
              >
                <Avatar className="w-14 h-14">
                  <AvatarImage src={user?.profilePicture} />
                  <AvatarFallback>
                    {user?.username[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-bold">{user?.username}</span>
                  <span
                    className={`text-sm  ${
                      isOnline ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {isOnline ? "Online" : "Offline"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      {selecteduser ? (
        <section className="flex-1 border-l border-l-gray-300 flex flex-col h-full">
          <div className="flex gap-3 items-center px-3 py-2  border-b border-b-gray-300 sticky top-0 bg-white z-10">
            <Avatar>
              <AvatarImage src={selecteduser?.profilePicture} alt="profiel" />
              <AvatarFallback>
                {selecteduser?.username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span>{selecteduser?.username}</span>
            </div>
          </div>
            <Messages selecteduser={selecteduser} />
          <div className="flex items-center p-4 border-t border-t-gray-300">
            <Input
              className="flex-1 mr-2 focus-visible:ring-transparent"
              placeholder="Messages..."
              type="text"
              value={textMessage}
              onChange={(e)=>setTextMessage(e.target.value)}
            />
            <Button onClick={()=>sendMessageHndler(selecteduser?._id)}>Send</Button>
          </div>
        </section>
      ) : (
        <div className="flex flex-col items-center justify-center mx-auto">
          <MessageCircleCode className="w-32 h-32 my-4" />
          <h1 className="font-medium text-xl">Your message </h1>
          <span>Send a messages to start chat.</span>
        </div>
      )}
    </div>
  );
}

export default ChatPage;
