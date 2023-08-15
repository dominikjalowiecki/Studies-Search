import { useParams, Navigate } from 'react-router-dom';
import { useState, useCallback, useRef, Suspense } from 'react';
import {
  Flex,
  Spinner,
  Box,
  Heading,
  Text,
  Link as ChakraLink,
  Button,
  Textarea,
  useDisclosure,
  VStack,
  Wrap,
  WrapItem,
  Grid,
  GridItem,
  FormHelperText,
  FormControl,
  Tag,
} from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import PostService from '../services/PostService.js';
import { DateTime } from 'luxon';
import Comments from '../components/Comments';
import React, { useMemo, useEffect } from 'react';
import { AuthConsumer } from '../utils/auth';
import PostPDF from '../pdf/PostPDF';
import { BlobProvider } from '@react-pdf/renderer';
import PostImages from '../components/PostImages';
import theme from '../themes/theme';

const EditPostModal = React.lazy(() => import('../components/EditPostModal'));

export default function Post() {
  const { postId } = useParams();

  const id = postId.substring(postId.lastIndexOf('-') + 1);

  const { data, error, isLoading, mutate } = PostService.GetPost(id);

  const [comments, setComments] = useState(null);

  useEffect(() => {
    if (data?.comments) setComments(data.comments);
  }, [data]);

  const { authed, authFetch, user, is_moderator } = AuthConsumer();

  const commentContentElement = useRef();

  const post = useMemo(() => <PostPDF post={data} />, [data]);

  const [submit, setSubmit] = useState(false);

  const commentFormSubmit = useCallback(
    () => (event) => {
      event.preventDefault();

      const data = {
        entry: id,
        content: commentContentElement.current?.value,
      };

      setSubmit(true);

      authFetch(
        '/comments/',
        {
          method: 'POST',
          body: JSON.stringify(data),
        },
        [400]
      )
        .then((result) => {
          commentContentElement.current.value = '';

          setComments([
            {
              username: user.username,
              membership: user.membership,
              content: data.content,
              modification_date: DateTime.now().toISO(),
              is_created: true,
            },
            ...comments,
          ]);
        })
        .finally(() => {
          setSubmit(false);
        });
    },
    [user, comments]
  );

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Box mt='10'>
        {!error ? (
          !isLoading ? (
            <Flex justify='center'>
              <Suspense>
                <EditPostModal
                  isOpen={isOpen}
                  onClose={onClose}
                  post={data}
                  mutate={mutate}
                />
              </Suspense>
              <Box width={theme.config.defaultContainerSize}>
                <Grid
                  templateColumns={{ base: '1 1fr', md: 'repeat(2, 1fr)' }}
                  templateRows={'2'}
                  gap={3}
                >
                  <GridItem colStart='1' rowStart='1' overflowX='auto'>
                    <PostImages images={data.images} />
                  </GridItem>
                  <GridItem colStart='1' rowStart='2' overflow='hidden'>
                    <VStack align={'flex-start'} flexWrap='wrap'>
                      <Heading>{data.name}</Heading>
                      <Wrap>
                        {is_moderator && (
                          <WrapItem>
                            <Button colorScheme='red' onClick={onOpen}>
                              Edit Faculty
                            </Button>
                          </WrapItem>
                        )}
                        <WrapItem>
                          <BlobProvider document={post}>
                            {({ url, blob, loading }) => {
                              return (
                                <Button
                                  href={url}
                                  isLoading={loading}
                                  loadingText='PDF loading'
                                  target='_blank'
                                  as={ChakraLink}
                                >
                                  View PDF
                                </Button>
                              );
                            }}
                          </BlobProvider>
                        </WrapItem>
                      </Wrap>
                      <Text>Description: {data.description}</Text>
                      <Text>City: {data.city}</Text>
                      <Text>School: {data.school}</Text>
                      <Text>
                        Courses:{' '}
                        {data.courses.map(
                          (el, idx, arr) =>
                            el + (idx < arr.length - 1 ? ', ' : '')
                        )}
                      </Text>
                      <Text>
                        Modificated by:{' '}
                        <Tag>{data.modificated_by.username}</Tag> -{' '}
                        {data.modificated_by.membership}
                      </Text>
                      <Text>
                        Modification date:{' '}
                        {DateTime.fromISO(
                          data.modification_date
                        ).toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS)}
                      </Text>
                      <ChakraLink href={data.hyperlink} isExternal>
                        Link to page <ExternalLinkIcon mx='2px' />
                      </ChakraLink>
                    </VStack>
                  </GridItem>
                </Grid>
              </Box>
            </Flex>
          ) : (
            <Flex justify='center'>
              <Spinner size='xl' />
            </Flex>
          )
        ) : (
          <Navigate to='/404' replace />
        )}
      </Box>
      <Box mt='10'>
        <Heading size='md'>Comments</Heading>
        <Grid
          templateColumns={{ base: '1 1fr', md: 'repeat(2, 1fr)' }}
          gap={3}
          mt={5}
        >
          {authed && (
            <GridItem>
              <form method='POST' onSubmit={commentFormSubmit()}>
                <VStack align={'flex-start'}>
                  <FormControl>
                    <Textarea
                      name='content'
                      ref={commentContentElement}
                      maxLength='250'
                      placeholder='Write your comment...'
                      required
                    />
                    <FormHelperText>Maximum 250 characters.</FormHelperText>
                  </FormControl>
                  <Button type='submit' disabled={submit} isLoading={submit}>
                    Submit
                  </Button>
                </VStack>
              </form>
            </GridItem>
          )}
          <GridItem colSpan={authed ? 1 : 2}>
            <Comments comments={comments} />
          </GridItem>
        </Grid>
      </Box>
    </>
  );
}
