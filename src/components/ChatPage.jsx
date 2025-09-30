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

const ChatPage = () => {
  const [textMessage, setTextMessage] = useState("");
  const { user, suggestedUsers, selectedUser } = useSelector(
    (store) => store.auth
  );
  const { onlineUsers, messages } = useSelector((store) => store.chat);
  const dispatch = useDispatch();

  const sendMessageHandler = async (receiverId) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/message/send/${receiverId}`,
        { textMessage },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setMessages([...messages, res.data.newMessage]));
        setTextMessage("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    return () => {
      dispatch(setSelectedUser(null));
    };
  }, []);

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden md:ml-60">
      {/* Left Sidebar — User List */}
      <aside
        className={`${
          selectedUser ? "hidden md:block" : "block"
        } md:w-1/3 lg:w-1/4 bg-white border-r border-gray-300 h-full`}
      >
        <div className="px-4 pt-4 border-b flex z-20 mt-10 md:mt-2 ml-10 md:ml-0">
          <h1 className="font-bold mb-2 px-3 text-xl">{user?.username}</h1>
          <hr className="mb-2 border-gray-300" />{" "}
        </div>
        <div className="overflow-y-auto h-[calc(100vh-64px)] md:ml-0 ml-10">
          {" "}
          {suggestedUsers.map((suggestedUser) => {
            const isOnline = onlineUsers.includes(suggestedUser?._id);
            return (
              <div
                onClick={() => dispatch(setSelectedUser(suggestedUser))}
                className="flex gap-3 items-center p-3 hover:bg-gray-50 cursor-pointer"
              >
                <Avatar className="w-14 h-14">
                  <AvatarImage src={suggestedUser?.profilePicture} />
                  <AvatarFallback>DP</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium">{suggestedUser?.username}</span>
                  <span
                    className={`text-xs font-bold ${
                      isOnline ? "text-green-600" : "text-red-400"
                    } `}
                  >
                    {isOnline ? "online" : "offline"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </aside>


      {/* Right Chat window  */}
      <main
        className={`flex-1 flex flex-col bg-gray-50 z-10 ${
          selectedUser ? "block" : "hidden md:flex"
        }`}
      >
        {selectedUser ? (
          <>
            {/* chat header */}
            <div className="flex gap-3 items-center px-3 py-2 border-b border-gray-300  top-0 bg-white z-10">
              <button
                className="md:hidden text-gray-800 text-4xl"
                onClick={() => dispatch(setSelectedUser(null))}
              >
                ←
              </button>
              <Avatar>
                <AvatarImage src={selectedUser?.profilePicture} alt="profile" />
                <AvatarFallback>DP</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span>{selectedUser?.username}</span>
              </div>
            </div>

            {/* message section */}
            <div className="flex-1 p-3 overflow-y-auto z-10">
              <Messages selectedUser={selectedUser} />
            </div>
            <div className="flex items-center p-2 md:mx-10 border-t sticky border-t-gray-300 bottom-2 bg-[#1f1f1f] rounded-full z-10">
              <Input
                value={textMessage}
                onChange={(e) => setTextMessage(e.target.value)}
                type="text"
                className="flex-1 mr-2 focus-visible:ring-transparent bg-transparent relative rounded-full caret-white text-white"
                placeholder="Messages..."
              />
              <Button 
              onClick={() => sendMessageHandler(selectedUser?._id)}
              disabled={!textMessage.trim()} 
              className="absolute right-4 bg-transparent rounded-full border hover:border-blue-500">
                Send
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center mx-auto h-screen">
            <MessageCircleCode className="w-32 h-32 my-4" />
            <h1 className="font-medium">Your messages</h1>
            <span>Send a message to start a chat.</span>
          </div>
        )}
      </main>
    </div>
  );
};

export default ChatPage;
