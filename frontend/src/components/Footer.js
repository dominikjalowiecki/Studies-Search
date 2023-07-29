import { Box, Flex, Link, useColorModeValue } from '@chakra-ui/react';

export default function Footer() {
  const borderColor = useColorModeValue('gray.300', 'whiteAlpha.200');

  return (
    <Box>
      <Box h='64px' mt='10' />
      <Flex
        as='footer'
        py='5'
        px='3'
        justify='center'
        position='absolute'
        bottom='0'
        w='100%'
        borderTop='1px'
        borderColor={borderColor}
      >
        <Link href='https://github.com/dominikjalowiecki'>
          Created by Dominik Jałowiecki © 2023
        </Link>
      </Flex>
    </Box>
  );
}
