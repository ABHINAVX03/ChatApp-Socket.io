import { ViewIcon } from "@chakra-ui/icons";
import {
  useDisclosure,
  Input,
  Button,
  Modal,
  ModalOverlay,
  ModalBody,
  ModalContent,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  IconButton,
  useToast,
  Box,
  FormControl,
  Spinner,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { ChatState } from "../../../Context/ChatProvider";
import UserBadgeItem from "./../../UserAvatar/UserBadgeItem";
import axios from "axios";
import UserListItem from "../../UserAvatar/UserListItem";

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain,fetchMessages }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [groupChatName, setgroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setsearchResult] = useState([]);
  const [loading, setloading] = useState(false);
  const [renameloading, setrenameloading] = useState(false);

  const toast = useToast();

  const { user, SelectedChat, setSelectedChat } = ChatState();

  const handleRemove = async(user1) => {
    if(SelectedChat.groupAdmin._id !== user._id && user1._id !== user._id){
      toast({
        title:'Only admins can remove Someone!',
        status:'error',
        duration:5000,
        isClosable:true,
        position:'bottom'
      })
      return;
    }
    try {
      setloading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "http://localhost:1111/api/chat/groupremove ",
        {
          chatId: SelectedChat._id,
          userId: user1._id,
        },
        config
      );
      user1._id === user._id ? setSelectedChat(): setSelectedChat(data)
      setFetchAgain(!fetchAgain);
      fetchMessages()
      setloading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } 
  };

  const handleAddUser = async (user1) => {
    if (SelectedChat.users.find((u) => u._id === user1._id)) {
      toast({
        title: "User Already on group",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    if (SelectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "Only admins can add someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    try {
      setloading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "http://localhost:1111/api/chat/groupadd",
        {
          chatId: SelectedChat._id,
          userId: user1._id,
        },
        config
      );
      setSelectedChat(data)
      setFetchAgain(!fetchAgain)
      setloading(false)
    } catch (error) {
      toast({
        title:'Error Occurred!',
        description:error.response.data.message,
        status:5000,
        isClosable:true,
        position:'bottom'
      })
      setloading(false)
    }
  };

  const handleRename = async () => {
    if (!groupChatName) return;
    try {
      setrenameloading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "http://localhost:1111/api/chat/rename",
        {
          chatId: SelectedChat._id,
          chatName: groupChatName,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setrenameloading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }

    try {
      setloading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `http://localhost:1111/api/user?search=${search}`,
        config
      );
      setloading(false);
      setsearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  return (
    <>
      <IconButton display={"flex"} icon={<ViewIcon />} onClick={onOpen} />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{SelectedChat.chatName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box width={"100%"} display={"flex"} flexWrap={"wrap"} pb={3}>
              {SelectedChat.users.map((u) => (
                <UserBadgeItem
                  key={user._id}
                  user={u}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </Box>
            <FormControl display={"flex"}>
              <Input
                placeholder="Chat name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setgroupChatName(e.target.value)}
              />
              <Button
                variant={"solid"}
                colorScheme="teal"
                ml={1}
                isLoading={renameloading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add User to Group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {loading ? (
              <Spinner size={"lg"} />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                />
              ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={() => handleRemove(user)}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
