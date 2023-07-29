import {
  Container,
  chakra,
  shouldForwardProp,
  VStack,
  Text,
  Box,
  Flex,
  useColorModeValue,
  Center,
  Spinner,
  Circle,
} from '@chakra-ui/react';
import { ChatIcon } from '@chakra-ui/icons';
import { motion, isValidMotionProp } from 'framer-motion';

const ChakraBox = chakra(motion.div, {
  shouldForwardProp: (prop) =>
    isValidMotionProp(prop) || shouldForwardProp(prop),
});

export default function Animation() {
  const chatBgColor = useColorModeValue('white', 'gray.800');

  return (
    <Container display='flex' alignItems='center' justifyContent='center'>
      <ChakraBox
        animate={{
          scale: [1, 1.05, 1.05, 1, 1],
        }}
        transition={{
          duration: 3,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatType: 'mirror',
        }}
        display='flex'
        justifyContent='center'
        alignItems='center'
      >
        <Box
          h='148px'
          p='3'
          bg={chatBgColor}
          rounded='md'
          overflowY='scroll'
          sx={{
            scrollbarWidth: 'auto',
            scrollbarColor: '#319795 #edf2f7',
            '--my-color': '#000',

            '::-webkit-scrollbar': {
              width: '8px',
            },
            '::-webkit-scrollbar-track': {
              background: '#edf2f7',
            },
            '::-webkit-scrollbar-thumb': {
              backgroundColor: '#319795',
            },
          }}
        >
          <VStack
            bg='teal.100'
            p={2}
            boxShadow='base'
            rounded='md'
            align='left'
            color='black'
            width='300px'
            pr={5}
            position='relative'
          >
            <Circle
              size='6'
              bg='teal.500'
              color='white'
              position='absolute'
              bottom='8px'
              right='8px'
            >
              <ChatIcon boxSize={3} />
            </Circle>
            <Text>I highly recommend this faculty!</Text>
            <Flex>
              <Box>
                <Text fontWeight='bold'>jonathan32</Text>
                <Text fontSize='sm'>Graduate</Text>
                <Text fontSize='sm'>21.07.2023, 14:30:00</Text>
              </Box>
            </Flex>
          </VStack>
          <Center height='50px' mt='8'>
            <Spinner size='xl' />
          </Center>
        </Box>
      </ChakraBox>
    </Container>
  );
}
