import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, FullgetSender } from "./../config/ChatLogic";
import ProfileModal from "./../components/Authentication/ProfileModel";
import UpdateGroupChatModal from "./../components/Authentication/after_login/UpdateGroupChatModal";
import axios from "axios";
import ScrollableChats from "./ScrollableChats";
import { io } from "socket.io-client";
import Lottie from 'lottie-react'
import animation from './../animations/Typing.json'

//const ENDPOINT = "http://localhost:1111/";
const socket = io("http://localhost:1111");
let SelectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [message, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const [socketConnected, setsocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setisTyping] = useState(false);

  const { user, SelectedChat, setSelectedChat,notification,setnotification } = ChatState();
  const toast = useToast();

  const fetchMessages = async () => {
    if (!SelectedChat) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      setLoading(true);
      const { data } = await axios.get(
        `http://localhost:1111/api/message/${SelectedChat._id} `,
        config
      );
      console.log(message);
      setMessages(data);
      setLoading(false);

      socket.emit("join chat", SelectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the messages!",
        status: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

 
  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !SelectedChatCompare ||
        SelectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if(!notification.includes(newMessageRecieved)){
          setnotification([newMessageRecieved,...notification])
          setFetchAgain(!fetchAgain)
        }
      } 
      else {
        setMessages([...message, newMessageRecieved]);
      }
    });
  }, []);

  useEffect(() => {
    fetchMessages();
    SelectedChatCompare = SelectedChat;
  }, [SelectedChat]);


  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage) {
      socket.emit('stop typing',SelectedChat._id)
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setMessages("");
        setNewMessage("");
        const { data } = await axios.post(
          "http://localhost:1111/api/message",
          {
            content: newMessage,
            chatId: SelectedChat._id,
          },
          config
        );
        console.log(data);
        socket.emit("new message", data);
        setMessages([...message, data]);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  useEffect(() => {
    // Listen for server events
    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("message", (data) => {
      console.log("Received message from server:", data);
    });

    // Send events to the server
    socket.emit("chatMessage", "Hello, server!");

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    socket.on("typing", () => {
      setisTyping(true);
    });
    socket.on("stop typing", () => setisTyping(false));
  });

  const typinghandler = (e) => {
    setNewMessage(e.target.value);
    if (!typing) {
      setTyping(true);
      socket.emit("typing", SelectedChat._id);
    }
    let lastTypinTime = new Date().getTime();
    var timerlength = 3000;
    setTimeout(() => {
      var timeNoww = new Date().getTime();
      var timeDiff = timeNoww - lastTypinTime;

      if (timeDiff >= timerlength && typing) {
        socket.emit("stop typing", SelectedChat._id);
        setTyping(false);
      }
    }, timerlength);
  };

  return (
    <>
      {SelectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            fontFamily={"Work sans"}
            display={"flex"}
            justifyContent={{ base: "space-around" }}
            alignItems={"center"}
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!SelectedChat.isGroupChat ? (
              <Box display={"flex"}>
                {getSender(user, SelectedChat.users)}
                <Box pl={600}>
                  <ProfileModal
                    user={FullgetSender(user, SelectedChat.users)}
                  />
                </Box>
              </Box>
            ) : (
              <Box display={"flex"}>
                {SelectedChat.chatName.toUpperCase()}
                <Box pl={600}>
                  <UpdateGroupChatModal
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                    fetchMessages={fetchMessages}
                  />
                </Box>
              </Box>
            )}
          </Text>
          <Box
            display={"flex"}
            justifyContent={"flex-end"}
            flexDir={"column"}
            p={3}
            bg={"#E8E8E8"}
            w={"100%"}
            h={"100%"}
            borderRadius={"lg"}
            overflowY={"hidden"}
          >
            {loading ? (
              <Spinner
                size={"xl"}
                w={20}
                h={20}
                alignSelf={"center"}
                margin={"auto"}
              />
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  overflowY: "scroll",
                  scrollbarWidth: "none",
                }}
              >
                <ScrollableChats message={message} />
              </div>
            )}
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              {isTyping ? <div><Lottie width={70} loop={true} autoplay={true} animationData={animation} rendererSettings={{preserveAspectRatio:'xMidYMid slice'}} style={{marginBottom:15,marginLeft:0}}/></div> : <></>}
              <Input
                variant={"filled"}
                placeholder="Enter a message.."
                onChange={typinghandler}
                bg={"#E0E0E0"}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          h={"100%"}
        >
          <Text fontSize={"3xl"} pb={3} fontFamily={"Work sans"}>
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
