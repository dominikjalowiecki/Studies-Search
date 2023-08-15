import {
  Skeleton,
  Box,
  Text,
  Flex,
  Spinner,
  Circle,
  VStack,
  keyframes,
  Center,
} from '@chakra-ui/react';
import { ChatIcon } from '@chakra-ui/icons';
import { DateTime } from 'luxon';
import { useState, useEffect, useRef } from 'react';

import config from '../config.json';

const animation = keyframes`
  from {
    box-shadow: 0;
  }

  to {
    box-shadow: 0px 0px 25px 0px rgba(255, 0, 0, 1);
  }
`;

export default function Comments({ comments }) {
  const [page, setPage] = useState(1);
  const [commentsLoading, setCommentsLoading] = useState(true);

  const [displayComments, setDisplayComments] = useState(null);
  useEffect(() => {
    if (!!comments) {
      setDisplayComments(comments.slice(0, config.COMMENTS_PAGINATION * page));
      setCommentsLoading(false);
    }
  }, [comments, page]);

  const loadComments = () => {
    if (!!comments && comments.length > page * config.COMMENTS_PAGINATION) {
      setPage((current) => ++current);
      setCommentsLoading(true);
    }
  };

  // const entranceAnimation = `${animation} alternate 3s 1s`;

  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef(null);
  const scrollArea = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        root: scrollArea.current,
        // rootMargin: '200px',
        threshold: 1.0,
      }
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [isIntersecting]);

  useEffect(() => {
    if (isIntersecting) {
      loadComments();
    }
  }, [isIntersecting]);

  return (
    <>
      <Skeleton isLoaded={!!displayComments}>
        {!displayComments && <Box height='150px'></Box>}
        <Box
          overflowY='auto'
          maxHeight='500px'
          ref={scrollArea}
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
          <VStack spacing={8} align='stretch' pr={2}>
            {!!displayComments &&
              displayComments.map((el, idx) => (
                // <WrapItem key={idx}></WrapItem>
                <VStack
                  bg='teal.100'
                  p={2}
                  pr={5}
                  boxShadow='base'
                  rounded='md'
                  align='left'
                  // animation={el?.is_created && entranceAnimation}
                  key={idx}
                  color='black'
                  minWidth='300px'
                  width='fit-content'
                  position='relative'
                  border={el?.is_created ? '2px solid' : '0'}
                  borderColor='blue.300'
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
                  <Text>{el.content}</Text>
                  <Flex>
                    <Box>
                      <Text fontWeight='bold'>{el.username}</Text>
                      <Text fontSize='sm'>{el.membership}</Text>
                      <Text fontSize='sm'>
                        {DateTime.fromISO(el.modification_date).toLocaleString(
                          DateTime.DATETIME_SHORT_WITH_SECONDS
                        )}
                      </Text>
                    </Box>
                  </Flex>
                </VStack>
              ))}
            {commentsLoading && (
              <Center>
                <Spinner size='xl' />
              </Center>
            )}
            <Box height='100px' ref={ref} />
          </VStack>
        </Box>
      </Skeleton>
    </>
  );
}
