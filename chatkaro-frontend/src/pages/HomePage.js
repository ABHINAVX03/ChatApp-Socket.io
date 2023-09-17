import { Container, Box, Text,Tab,TabPanel,Tabs,TabPanels,TabList } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import Signup from '../components/Authentication/Signup'
import Login from '../components/Authentication/Login'
import { useNavigate } from 'react-router-dom'

const Homepage = () => {

  const navigate=useNavigate()

  useEffect(()=>{
    const user=JSON.parse(localStorage.getItem('userInfo'))

    if(user) {
      navigate('/')
    }
  },[navigate])

  
  return (
    <Container maxW='x1' centerContent>
      <Box d='flex' justifyContent='center' p={3} bg={'blue.400'} w='30%' m='40px 0 15px 0' borderRadius='lg' borderWidth='1px'>
        <Text fontSize='2xl' fontFamily='Work sans' align={'center'} color='black'>ChatKaro</Text>
      </Box>
      <Box bg={'blue.400'} w={'30%'} p={4} borderRadius="lg" borderWidth={'1px'} fontSize={'2xl'} color={'black'}>
        <Tabs variant='soft-rounded'>
          <TabList mb={'1em'}>
            <Tab width={'50%'}>Login</Tab>
            <Tab width={'50%'}>Signup</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login/>
            </TabPanel>
            <TabPanel>
              <Signup/>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  )
}

export default Homepage