import { VStack,FormControl, Input, FormLabel, FormHelperText, Button, InputRightElement, InputGroup, useToast} from '@chakra-ui/react'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Login = () => {
    //States
    const [email, setemail] = useState('')
    const [password, setpassword] = useState('')
    const [show, setshow] = useState(false)
    const [loading, setloading] = useState(false)
    const toast = useToast()
    const host='http://localhost:1111'
    const navigate=useNavigate()
    //functions
    const handleClick = () => setshow(!show)
    
    const submithandler = async () => {
        setloading(true);
        if(!email || !password){
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
        try {
            const config={
                headers:{
                    'Content-type':'application/json',
                }
            };
            const {data}=await axios.post(
                `${host}/api/user/login`,
                {email,password},
                config
            );
            toast({
                title:"Login Successfully",
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
                title:"Login Error",
                description: error.response.data.message || "Error During Login ",
                status:'error',
                duration:'5000',
                isClosable:true,
                position:'bottom'
            })
        }
    }
    return (
        <VStack spacing={'5px'}>
            <FormControl id='email'>
                <FormLabel>Email address</FormLabel>
                <Input type='email' placeholder='Enter your Email' value={email} onChange={(e) => setemail(e.target.value)} />
                <FormHelperText>We'll never share your email.</FormHelperText>
            </FormControl>
            <FormControl id='password'>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input type={show ? 'text' : 'password'} value={password} placeholder='Enter your password' onChange={(e) => setpassword(e.target.value)} />
                    <InputRightElement width={'4.5rem'}>
                        <Button h={'1.75rem'} size={'sm'} onClick={handleClick}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <Button width={'100%'} my={2} onClick={submithandler}>Login</Button>
            <Button width={'100%'} isLoading={loading} colorScheme='red' onClick={() => { setpassword('123456'); setemail('guest@example.com') }}>Get Guest User Credentials</Button>
        </VStack>
    )
}

export default Login