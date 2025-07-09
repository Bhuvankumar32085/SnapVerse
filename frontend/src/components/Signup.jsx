import React, { useEffect, useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "sonner";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useSelector } from "react-redux";

export default function Signup() {
   const { user } = useSelector((store) => store.auth);
  const [loading, setLoading] = useState(false);
  const navigater = useNavigate();
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
  });

  const changeHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log(input);
      const res = await axios.post(
        `https://snapverse-lcwk.onrender.com/api/v1/user/register`,
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        setInput({
          username: "",
          email: "",
          password: "",
        });
        navigater("/verify-email");
      }
    } catch (error) {
      console.log(error);
      toast.error("Signup error");
    } finally {
      setLoading(false);
    }
  };

useEffect(()=>{
    if(user){
      navigater('/')
    }
  },[])

  return (
    <div className="flex items-center w-screen h-screen justify-center">
      <form
        onSubmit={submitHandler}
        className="shadow-lg flex flex-col gap-5 p-8 "
      >
        <div className="my-4">
          <h1 className="text-center font-bold text-xl">LOGO</h1>
          <p className="text-sm text-center my-3">
            Signup to see photos & videos from your friends
          </p>
        </div>
        <div>
          <Label>Username</Label>
          <Input
            type="text"
            name="username"
            className="focus-visible:ring-transparent my-2"
            value={input.username}
            onChange={changeHandler}
          />
          <Label>Email</Label>
          <Input
            type="text"
            name="email"
            className="focus-visible:ring-transparent my-2"
            value={input.email}
            onChange={changeHandler}
          />
          <Label>Password</Label>
          <Input
            type="password"
            name="password"
            className="focus-visible:ring-transparent my-2"
            value={input.password}
            onChange={changeHandler}
          />
        </div>

        {loading ? (
          <Button disabled className="w-full">
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Signing up...
            </span>
          </Button>
        ) : (
          <Button  className="w-full">
            Signup
          </Button>
          
        )}
        <span>Already have an account? <Link className="text-blue-500" to='/login'>Login</Link></span>
      </form>
    </div>
  );
}
