import React,{useState} from 'react';
import { ChatState } from '../Context/ChatProvider';
import { Box } from '@chakra-ui/react';
import SideDrawer from '../components/Authentication/after_login/SideDrawer';
import Mychats from '../components/Authentication/after_login/Mychats';
import ChatBox from '../components/Authentication/after_login/ChatBox';

const ChatPage = () => {
    
    const {user}=ChatState()
    const [fetchAgain,setFetchAgain]=useState(false)
    const mystyle={
        display:'flex',
        justifyContent:'space-between',
        width:'100%',
        height:'91.5vh',
        padding:'10px'
    }
    return (
        <div style={{width:'100%'}}>
            {user && <SideDrawer/>}        
            <Box style={mystyle}>
                {user && <Mychats fetchAgain={fetchAgain} />}
                {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
            </Box>
        </div>
    );
}

export default ChatPage;
