import { Flex, Text, Slide, CloseButton, Box } from '@chakra-ui/react';
import { ServiceStatusConsumer } from '../utils/serviceStatus';

export default function UnavailableAlert() {
  const { isServiceUnavailable, setServiceUnavailability } =
    ServiceStatusConsumer();

  return (
    <Box zIndex={3} position='relative'>
      <Slide direction='bottom' in={isServiceUnavailable}>
        <Flex
          margin='auto'
          bgColor='red.500'
          pos='relative'
          maxW='350'
          color='white'
          py='3'
          px='3'
          rounded='md'
          boxShadow='lg'
          justify='center'
          align='center'
          mb='20'
        >
          <Text align='center' mr='5'>
            Service unavailable. Try again later...
          </Text>
          <CloseButton
            pos='absolute'
            mr='2'
            right='0'
            onClick={() => setServiceUnavailability((current) => !current)}
          />
        </Flex>
      </Slide>
    </Box>
  );
}
