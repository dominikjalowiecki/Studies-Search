import {
  Flex,
  Text,
  Heading,
  useColorModeValue,
  Image,
  Grid,
  GridItem,
  LinkBox,
  LinkOverlay,
  VStack,
  Wrap,
  WrapItem,
  Tag,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useEffect } from 'react';
import img from '../assets/images/default-thumbnail.jpeg';

export default function PostsListing({ data }) {
  const borderColor = useColorModeValue('gray.300', 'whiteAlpha.200');

  useEffect(() => {
    if (data.count === 0) throw new Error('No faculties found...');
  }, [data]);

  return (
    <Grid
      templateColumns={{
        sm: 'repeat(1, 1fr)',
        md: 'repeat(2, 1fr)',
        lg: 'repeat(3, 1fr)',
      }}
      gap={3}
    >
      {data.count !== 0 ? (
        data.results.map((post) => (
          <GridItem key={post.id}>
            <LinkBox
              borderRadius='md'
              border='1px'
              borderColor={borderColor}
              w='100%'
              minH='450px'
              overflow='hidden'
            >
              <Flex
                h='200px'
                justify='center'
                align='center'
                bgColor='gray.900'
                overflow='hidden'
              >
                <Image
                  src={
                    post.first_image
                      ? post.first_image.indexOf('&export=download') !== -1
                        ? post.first_image.substring(
                            0,
                            post.first_image.indexOf('&export=download')
                          )
                        : post.first_image
                      : img
                  }
                  fallbackSrc={img}
                  width='100%'
                  loading='lazy'
                />
              </Flex>
              <Flex direction='column' align='center' px='3' py='5'>
                <LinkOverlay
                  as={RouterLink}
                  to={`${encodeURIComponent(
                    post.name.toLowerCase().split(' ').join('-') + `-${post.id}`
                  )}`}
                />
                <VStack textAlign='center'>
                  <Heading as='h3' size='md'>
                    {post.name}
                  </Heading>
                  <Text>{post.description_preview}</Text>
                  <Text fontSize='sm'>
                    City: <b>{post.city}</b>
                  </Text>
                  <Text fontSize='sm'>
                    School: <b>{post.school}</b>
                  </Text>
                  <Wrap justify='center'>
                    {post.courses.map((course, idx) => (
                      <WrapItem key={idx}>
                        <Tag
                          as={RouterLink}
                          replace
                          _hover={{ backgroundColor: 'teal.400' }}
                          transition='background-color 0.1s ease-in'
                          to={`/faculties?course=${course}`}
                        >
                          {course}
                        </Tag>
                      </WrapItem>
                    ))}
                  </Wrap>
                </VStack>
              </Flex>
            </LinkBox>
          </GridItem>
        ))
      ) : (
        <Text>Not found following applied criteria...</Text>
      )}
    </Grid>
  );
}
