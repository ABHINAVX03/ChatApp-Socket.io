const asynchandler = require('express-async-handler')
const Chat = require('../models/chatModel')
const User = require('../models/userModel')

const accessChat = asynchandler(async (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        console.log("UserId param not with requrest");
        return res.sendStatus(400);
    }

    var isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } }
        ]
    }).populate("users", "-password").populate("latestMessage")

    isChat = await User.populate(isChat, {
        path: 'latestMessage.sender',
        select: 'name pic email'
    })
    if (isChat.length > 0) {
        res.send(isChat[0])
    }
    else {
        var chatdata = {
            chatname: 'sender',
            isGroupChat: false,
            users: [req.useer_id, userId]
        }
    }
    try {
        const createdChat = await Chat.create(chatdata)
        const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
            'users',
            '-password'
        )
        res.status(200).send(FullChat)
    } catch (error) {
        res.sendStatus(400)
        throw new Error(error.message)
    }
})

const fetchChats = asynchandler(async (req, res) => {
    try {
        Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
            .populate('users', '-password')
            .populate('groupAdmin', '-password')
            .populate('latestMessage')
            .sort({ updatedAt: -1 })
            .then(async (results) => {
                results = await User.populate(results, {
                    path: 'latestMessage.sender',
                    select: 'name pic email'
                })
                res.status(200).send(results);
            })
    } catch (error) {
        res.sendStatus(400)
        throw new Error(error.message)
    }
})

const createGroupChat = asynchandler(async (req, res) => {
    if (!req.body.users || !req.body.name) {
        return res.status(400).json({ message: "Please fill in all the fields" });
    }

    var users = JSON.parse(req.body.users);

    if (users.length < 2) {
        return res.status(400).json({ message: "More than 2 users are required to form a group chat" });
    }
    users.push(req.user);

    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user,
        });

        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate('users', '-password')
            .populate('groupAdmin', '-password');

        res.status(200).json(fullGroupChat);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

const renameGroup = asynchandler(async (req, res) => {
    const { chatId, chatName } = req.body

    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        {
            chatName,
        },
        {
            new: true,
        }
    )
        .populate('users', '-password')
        .populate('groupAdmin', '-password')

    if (!updatedChat) {
        res.send(404)
        throw new Error("Chat Not Found")
    }
    else {
        res.json(updatedChat)
    }
})

const addToGroup = asynchandler(async (req, res) => {
    const { chatId, userId } = req.body

    const added = await Chat.findByIdAndUpdate(chatId, {
        $push: { users: userId },
    },
        { new: true }
    )
    .populate('users','-password')
    .populate('groupAdmin','-password')

    if(!added){
        res.status(404)
        throw new Error('chat Not Found')
    }
    else{
        res.json(added)
    }
})

const removeFromGroup = asynchandler(async (req, res) => {
    const { chatId, userId } = req.body

    const removed = await Chat.findByIdAndUpdate(chatId, {
        $pull: { users: userId },
    },
        { new: true }
    )
    .populate('users','-password')
    .populate('groupAdmin','-password')

    if(!removed){
        res.status(404)
        throw new Error('chat Not Found')
    }
    else{
        res.json(removed)
    }
})

module.exports = { accessChat, fetchChats, createGroupChat, renameGroup, addToGroup,removeFromGroup }