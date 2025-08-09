"use client";
import { Button, Calendar } from "@heroui/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
const Page = () => {
  const router = useRouter(); 
  
  // auto router to create-spl
  useEffect(() => {
    router.push("/create-spl");
  }, []);
  return (
    <div>
    </div>
  );
}
export default Page;
