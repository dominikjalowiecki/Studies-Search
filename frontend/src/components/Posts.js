import {
  Flex,
  Spinner,
  Box,
  Text,
  Button,
  Grid,
  GridItem,
  useDisclosure,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import PostService from '../services/PostService.js';
import Pagination from './Pagination';
import { AuthConsumer } from '../utils/auth';
import React, { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import PostsListing from './PostsListing';
import theme from '../themes/theme';

const CreatePostModal = React.lazy(() => import('./CreatePostModal'));

function FallbackComponent({ error, resetErrorBoundary }) {
  return (
    <Flex justify='center' align={'center'} w='100%' direction='column'>
      <Text>Something went wrong:</Text>
      <Text as='pre'>{error.message}</Text>
      {/* <Button mt={2} mb={5} onClick={resetErrorBoundary}>
        Try again
      </Button> */}
    </Flex>
  );
}

export default function Posts({ filters, searchParamsValidated, setPage }) {
  const {
    isOpen: isLoading,
    onOpen: setLoading,
    onClose: setLoaded,
  } = useDisclosure();

  const fetchData = PostService.GetPosts(
    filters,
    searchParamsValidated,
    setPage
  );
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (fetchData === undefined) {
      setLoading();
    } else {
      setData({
        ...fetchData,
      });
      setLoaded();
    }
  }, [fetchData]);

  const { is_moderator } = AuthConsumer();

  return (
    <Flex justify='center' w='100%'>
      <Suspense>
        <CreatePostModal isOpen={isOpen} onClose={onClose} />
      </Suspense>
      <Box width={theme.config.defaultContainerSize}>
        <Grid templateColumns='repeat(2, 1fr)' my='8'>
          <GridItem>
            <Flex align='center' h='100%'>
              <Button
                onClick={onOpen}
                colorScheme='red'
                display={is_moderator ? 'block' : 'none'}
              >
                Add Faculty
              </Button>
            </Flex>
          </GridItem>
          <GridItem>
            <Flex align='center' justify='flex-end' h='100%'>
              {isLoading || !!!data ? (
                <Spinner />
              ) : (
                <Text>Results found: {data?.count}</Text>
              )}
            </Flex>
          </GridItem>
        </Grid>
        {!!data ? (
          <Box position='relative'>
            <Flex
              display={isLoading ? 'flex' : 'none'}
              position='absolute'
              width='100%'
              height='100%'
              bg='blackAlpha.300'
              zIndex='2'
              justify='center'
              align='center'
            >
              <Spinner
                thickness='4px'
                speed='0.65s'
                emptyColor='gray.300'
                color='teal.500'
                size='xl'
              />
            </Flex>
            <ErrorBoundary
              FallbackComponent={FallbackComponent}
              // onReset={() => {
              //   setData(null);
              // }}
              resetKeys={[data]}
            >
              <PostsListing data={data} />
            </ErrorBoundary>
            <Flex width='100%' justify='center' my='5'>
              <Pagination
                setPage={setPage}
                currentPage={filters.page}
                pagesCount={data.total_pages}
              />
            </Flex>
          </Box>
        ) : (
          <Flex justify='center' my='10'>
            <Spinner />
          </Flex>
        )}
      </Box>
    </Flex>
  );
}
