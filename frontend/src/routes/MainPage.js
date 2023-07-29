import {
  Box,
  Button,
  Heading,
  Text,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  Grid,
  GridItem,
  Center,
  Alert,
  AlertIcon,
  Link as ChakraLink,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import Animation from '../components/Animation';

const MainPage = () => (
  <>
    <Box
      align='left'
      py={10}
      px={8}
      bgGradient='linear(to-l, teal.600, teal.500)'
      borderBottomRadius={6}
    >
      <Grid templateColumns={{ base: '1 1fr', md: 'repeat(2, 1fr)' }} gap={8}>
        <GridItem>
          <Heading color='white'>Studies Search</Heading>
          <Text color='white' mt={5} fontSize='xl'>
            Search and comment offer of universities and schools.
          </Text>
          <Button as={Link} mt={5} to='/faculties' size={'lg'}>
            View Offer
          </Button>
        </GridItem>
        <GridItem display={['none', 'none', 'block']}>
          <Center h='100%' justify='start'>
            <Animation />
          </Center>
        </GridItem>
      </Grid>
    </Box>
    <Box mt={5}>
      <Alert status='info' colorScheme='teal' borderRadius={'md'}>
        <AlertIcon />
        <Text>
          Join community now!{' '}
          <ChakraLink as={Link} color='teal.500' to='/register'>
            Create your account.
          </ChakraLink>
        </Text>
      </Alert>
    </Box>
    <Box mt={10}>
      <Heading as='h3' size='md'>
        Application Features
      </Heading>
      <Tabs variant='enclosed' mt={5} colorScheme='teal' shadow={'base'}>
        <TabList>
          <Tab>Filtering</Tab>
          <Tab>Commenting</Tab>
          <Tab>PDF</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <p>Use extended set of filters to search for dreamed school.</p>
          </TabPanel>
          <TabPanel>
            <p>Read people's opinions or leave your own thoughts.</p>
          </TabPanel>
          <TabPanel>
            <p>Download PDF version of faculty page with all details.</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  </>
);

export default MainPage;
