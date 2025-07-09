"use client";

import React, { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function VerifyEmail() {
  const navigate=useNavigate()
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  const handleOtpChange = (e, index) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (value) {
      const updatedOtp = [...otp];
      updatedOtp[index] = value;
      setOtp(updatedOtp);
      if (index < 5) inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const updatedOtp = [...otp];

      if (otp[index]) {
        updatedOtp[index] = "";
        setOtp(updatedOtp);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
        updatedOtp[index - 1] = "";
        setOtp(updatedOtp);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/user/verifyemail`,
        {
          email,
          otp: otp.join(""),
        }
      );

      if (res.data.success) {
        toast.success("Email verified successfully!");
        navigate('/login')
      } else {
        toast.error(res.data.message || "Invalid OTP");
      }
    } catch (error) {
      console.log(error);
      toast.error("Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg p-8 rounded-xl w-full max-w-md flex flex-col gap-5"
      >
        <div>
          <h1 className="text-center font-bold text-xl">Verify Email</h1>
          <p className="text-sm text-center mt-2 text-gray-500">
            Enter your email and 6-digit OTP
          </p>
        </div>

        <div>
          <Label>Email</Label>
          <Input
            type="email"
            placeholder="you@example.com"
            className="focus-visible:ring-transparent my-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <Label>OTP</Label>
          <div className="flex justify-between mt-2 gap-2">
            {otp.map((digit, index) => (
              <Input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength="1"
                value={otp[index]}
                onChange={(e) => handleOtpChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-12 text-center text-lg font-bold border border-gray-300 focus-visible:ring-blue-500 transition hover:scale-105"
              />
            ))}
          </div>
        </div>

        {loading ? (
          <Button disabled className="w-full">
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
               Verifying...
            </span>
          </Button>
        ) : (
          <Button className="w-full">Verify Email</Button>
        )}
      </form>
    </div>
  );
}
