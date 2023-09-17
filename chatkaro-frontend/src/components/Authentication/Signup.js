import { VStack, useToast, FormControl, Input, FormLabel, FormHelperText, Button, InputRightElement, InputGroup } from '@chakra-ui/react'
import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Signup = () => {
    //states
    const [name, setname] = useState('')
    const [email, setemail] = useState('')
    const [password, setpassword] = useState('')
    const [cpass, setcpass] = useState('')
    const [pic, setpic] = useState()
    const [show1, setshow1] = useState(false)
    const [show2, setshow2] = useState(false)
    const [loading, setloading] = useState(false)
    const toast = useToast()
    const navigate=useNavigate()
    const host='http://localhost:1111';
    //functions
    const handleClickpass = () => setshow1(!show1)
    const handleClickcpass = () => setshow2(!show2)
    
    const postDetails = (pics) => {
        setloading(true)
        if (pics === undefined) {
            toast({
                title: 'Please select an Image!1',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            })
            return;
        }
        if (pics.type === "image/jpeg" || pics.type === "image/png" || pics.type === 'image/jpg') {
            const data = new FormData();
            data.append("file", pics)
            data.append("upload_preset", "chatkaro")
            data.append("cloud_name", "dyef8wpm6")
            axios
                .post('https://api.cloudinary.com/v1_1/dyef8wpm6/image/upload', data)
                .then((res) => {
                    console.log(res);
                    setpic(res.data.url.toString())
                    setloading(false)
                    toast({
                        title: 'Image Uploaded Successfully!',
                        status: 'success',
                        duration: 5000,
                        isClosable: true,
                        position: 'bottom'
                    })
                })
                .catch((err) => {
                    console.log(err);
                    setloading(false)
                })
        }
        else {
            toast({
                title: 'Please select an Image!',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            })
            setloading(false)
            return;
        }
    }
    const submithandler = async () => {
        setloading(true);
        if(!name || !email || !password || !cpass){
            toast({
                title:"please Fill all the Fields",
                status:'warning',
                duration:'5000',
                isClosable:true,
                position:'bottom'
            })
            setloading(false)
            return;
        }
        if(password!==cpass){
            toast({
                title:"Check Your password again",
                status:'warning',
                duration:'5000',
                isClosable:true,
                position:'bottom'
            })
            setloading(false)
            return;
        }
        try {
            const config={
                headers:{
                    'Content-type':'application/json',
                }
            };
            const {data}=await axios.post(
                `${host}/api/user`,
                {name,email,password,pic},config
            );
            toast({
                title:"Registration Successfully",
                status:'success',
                duration:'5000',
                isClosable:true,
                position:'bottom'
            })
            localStorage.setItem('userInfo',JSON.stringify(data))
            setloading(false)
            navigate('./chats')
        } catch (error) {
            setloading(false)
            toast({
                title:"Registration Error",
                description:error.response.data.message,
                status:'error',
                duration:'5000',
                isClosable:true,
                position:'bottom'
            })
        }

    }
    return (
        <VStack spacing={'5px'}>
            <FormControl id='name'>
                <FormLabel>Name</FormLabel>
                <Input type='text' placeholder='Enter your name'
                    value={name}
                    onChange={(e) => setname(e.target.value)} />
            </FormControl>
            <FormControl>
                <FormLabel>Email address</FormLabel>
                <Input type='email' placeholder='Enter your Email' value={email} onChange={(e) => setemail(e.target.value)} />
                <FormHelperText>We'll never share your email.</FormHelperText>
            </FormControl>
            <FormControl>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input type={show1 ? 'text' : 'password'} value={password} placeholder='Enter your password' onChange={(e) => setpassword(e.target.value)} />
                    <InputRightElement width={'4.5rem'}>
                        <Button h={'1.75rem'} size={'sm'} onClick={handleClickpass}>
                            {show1 ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                    <Input type={show2 ? 'text' : 'password'} value={cpass} placeholder='Enter your password Again' onChange={(e) => setcpass(e.target.value)} />
                    <InputRightElement width={'4.5rem'}>
                        <Button h={'1.75rem'} size={'sm'} onClick={handleClickcpass}>
                            {show2 ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id='pic'>
                <FormLabel>Profile picture</FormLabel>
                <Input type='file' p={1.5} accept='image/*' onChange={(e) => postDetails(e.target.files[0])} />
            </FormControl>
            <Button isLoading={loading} onClick={submithandler} width={'100%'} my={'3'}>SignUp</Button>
        </VStack>
    )
}

export default Signup