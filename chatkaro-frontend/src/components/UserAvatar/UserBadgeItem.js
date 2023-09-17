import { CloseIcon } from '@chakra-ui/icons'
import { Box } from '@chakra-ui/react'
import React from 'react'

const UserBadgeItem = ({user,handleFunction}) => {
  return (
    <Box
        px={2}
        py={1}
        borderRadius={'lg'}
        m={1}
        mb={2}
        fontSize={12}
        bg={'black'}
        color={'white'}
        cursor={'pointer'}
        onClick={handleFunction}
    >
        {user.name}
        <CloseIcon pl={1}/>
    </Box>

  )
}

export default UserBadgeItem