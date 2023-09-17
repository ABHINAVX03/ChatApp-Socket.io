import React, { useEffect, useState } from "react";
import { ChatState } from "../../../Context/ChatProvider";
import { useToast, Box, Button, Stack, Text } from "@chakra-ui/react";
import axios from "axios";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "../../ChatLoading";
import { getSender } from "../../../config/ChatLogic";
import GroupChatModel from "./GroupChatModel";

const Mychats = ({fetchAgain}) => {
  const [loggedUser, setLoogedUser] = useState();
  const { user, SelectedChat, setSelectedChat, chats, setChats } = ChatState();
  const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        "http://localhost:1111/api/chat",
        config
      );
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.message || "Failed to Load Chats",
        status: "error",
        isClosable: true,
        duration: 5000,
        position: "bottom-left",
      });
    }
  };
  useEffect(() => {
    setLoogedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);
  return (
    <Box
      display={{ flex: SelectedChat ? "none" : "flex", md: "flex" }}
      flexDir={"column"}
      alignItems={"center"}
      p={3}
      bg={"white"}
      w={{ base: "100%", md: "30%" }}
      borderRadius={"lg"}
      borderWidth={"1px"}
    >
      <Box
        p={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily={"Work sans"}
        display={"flex"}
        w={"100%"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        My Chats
        <GroupChatModel>
          <Button
            display={"flex"}
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModel>
      </Box>

      <Box
        p={3}
        bg={"#F8F8F8"}
        maxHeight={'85%'}
        w={'100%'}
        borderRadius={"lg"}
        overflowY={'scroll'}
      >
        {chats ? (
          <Stack overflowY={"scroll"}>
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor={"pointer"}
                bg={SelectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={SelectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius={"lg"}
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default Mychats;
