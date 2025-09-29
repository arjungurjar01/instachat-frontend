import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
} from "lucide-react";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";
import CreatePost from "./CreatePost";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";

const LeftSidebar = () => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const { likeNotification } = useSelector(
    (store) => store.realTimeNotification
  );
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const logoutHandler = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/logout`,
        { withCredentials: true }
      );
      if (res.data.success) {
        dispatch(setAuthUser(null));
        dispatch(setSelectedPost(null));
        dispatch(setPosts([]));
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const sidebarHandler = (textType) => {
    if (textType === "Logout") {
      logoutHandler();
    } else if (textType === "Create") {
      setOpen(true);
    } else if (textType === "Profile") {
      navigate(`/profile/${user?._id}`);
    } else if (textType === "Home") {
      navigate("/");
    } else if (textType === "Messages") {
      navigate("/chat");
    }
  };

  const sidebarItems = [
    { icon: <Home />, text: "Home" },
    { icon: <Search />, text: "Search" },
    { icon: <TrendingUp />, text: "Explore" },
    { icon: <MessageCircle />, text: "Messages" },
    { icon: <Heart />, text: "Notifications" },
    { icon: <PlusSquare />, text: "Create" },
    {
      icon: (
        <Avatar className="w-6 h-6">
          <AvatarImage src={user?.profilePicture} alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
    // { icon: <LogOut />, text: "Logout" },
  ];
  return (
    <div className="fixed bottom-0  md:top-0 z-10 md:left-0 px-4 md:border-r md:border-gray-300 w-[16%] h-screen">
      <div className="flex flex-row md:flex-col">
       {/* mobile screen */}
        <div className="fixed flex top-0 left-0 md:top-4 md:left-4 px-4 pt-4 md:flex-col justify-between items-center w-full bg-white rounded-b-lg p-2 md:hidden">
          <h1 className="md:top-auto md:my-8 md:pl-3 font-bold text-xl bg-blue-5">
            INSTACHAT
          </h1>
          <div onClick={() => sidebarHandler("Logout")}  className="flex items-center gap-1 text-red-600 border border-red-600 cursor-pointer px-2 py-1 rounded-md text-sm md:pl-3">
            {" "}
            <LogOut /> <span>Logout</span>{" "}
          </div>
        </div>
        
        {/* large screen */}
        <div className="hidden md:flex flex-col justify-between fixed top-2 left-4 xl:ml-10 h-full w-40 p-4">
          <h1 className="font-bold text-xl">INSTACHAT</h1>
          <div onClick={() => sidebarHandler("Logout")} className="flex items-center gap-1 text-red-600 border border-red-600 hover:bg-red-600 hover:text-white cursor-pointer px-2 py-1 rounded-md">
            <LogOut />
            <span>Logout</span>
          </div>
        </div>

        <div className="flex fixed bottom-0 left-0 md:static md:flex-col md:mt-16 w-[94%] m-4 rounded-lg  text-white md:text-black bg-[#1f1f1f] md:bg-white">
          {sidebarItems.map((item, index) => {
            return (
              <div
                onClick={() => sidebarHandler(item.text)}
                key={index}
                className="flex items-center mx-auto md:gap-3 relative md:hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3"
              >
                {item.icon}
                <span className="hidden md:block">{item.text}</span>
                {item.text === "Notifications" &&
                  likeNotification.length > 0 && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          size="icon"
                          className="rounded-full h-5 w-5 bg-red-600 hover:bg-red-600 absolute bottom-6 left-6"
                        >
                          {likeNotification.length}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <div>
                          {likeNotification.length === 0 ? (
                            <p>No new notification</p>
                          ) : (
                            likeNotification.map((notification) => {
                              return (
                                <div
                                  key={notification.userId}
                                  className="flex items-center gap-2 my-2"
                                >
                                  <Avatar>
                                    <AvatarImage
                                      src={
                                        notification.userDetails?.profilePicture
                                      }
                                    />
                                    <AvatarFallback>DP</AvatarFallback>
                                  </Avatar>
                                  <p className="text-sm">
                                    <span className="font-bold">
                                      {notification.userDetails?.username}
                                    </span>{" "}
                                    liked your post
                                  </p>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
              </div>
            );
          })}
        </div>
      </div>

      <CreatePost open={open} setOpen={setOpen} />
    </div>
  );
};

export default LeftSidebar;
