import {
  Heading,
  HStack,
  Stack,
  Button,
  Input,
  Select,
  FormControl,
  FormLabel,
  useDisclosure,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { useState, useEffect, useMemo } from 'react';
import PostService from '../services/PostService.js';
import theme from '../themes/theme';

export default function Filters({
  setSearch,
  search,
  searchParamsValidated,
  ...props
}) {
  const initialInputValues = useMemo(
    () => ({
      faculty: '',
      school: '',
      city: '',
      course: '',
    }),
    []
  );

  const [inputValues, setInputValues] = useState(initialInputValues);

  const {
    isOpen: hasFilterChanged,
    onClose: onFiltersApplied,
    onOpen: onFiltersChanged,
  } = useDisclosure();

  const filters = PostService.GetFilters(
    setSearch,
    search,
    searchParamsValidated
  );

  useEffect(() => {
    setInputValues({
      faculty: search.faculty,
      school: search.school,
      city: search.city,
      course: search.course,
    });

    onFiltersApplied();
  }, [search.faculty, search.school, search.city, search.course]);

  const filterAction = () => {
    setSearch(inputValues);
  };

  const handleFilterForm = (e) => {
    e.preventDefault();

    onFiltersApplied();

    filterAction();
  };

  const handleClearButton = (e) => {
    setInputValues(initialInputValues);

    onFiltersApplied();

    setSearch({ page: search.page });
  };

  const onInputValuesChanged = (name, value) => {
    setInputValues({
      ...inputValues,
      [name]: value,
    });
  };

  return (
    <Stack
      px='5'
      bgColor='teal.500'
      mx='auto'
      width='100%'
      maxWidth={theme.config.defaultContainerSize}
      py='5'
      borderRadius='6'
      {...props}
    >
      <Heading as='h5' fontSize='20' color='whiteAlpha.900'>
        Filters
      </Heading>
      <form onSubmit={handleFilterForm}>
        <Stack
          align='flex-end'
          direction={{ base: 'column', md: 'row' }}
          spacing={3}
        >
          <FormControl>
            <FormLabel color='whiteAlpha.900'>Name</FormLabel>
            <Input
              value={inputValues.faculty}
              onChange={({ target: { value } }) => {
                onFiltersChanged();
                onInputValuesChanged('faculty', value);
              }}
              type='text'
              bgColor='gray.100'
              placeholder='Faculty Name'
              maxLength='100'
              color={'teal.600'}
              _placeholder={{ color: 'teal.600', opacity: 0.6 }}
            />
          </FormControl>
          <FormControl>
            <FormLabel color='whiteAlpha.900'>School</FormLabel>
            <Select
              value={inputValues.school}
              onChange={({ target: { value } }) => {
                onFiltersChanged();
                onInputValuesChanged('school', value);
              }}
              placeholder='None'
              bgColor='gray.100'
              color={'teal.600'}
            >
              {filters.schools.map((school) => (
                <option key={school.name} value={school.name}>
                  {school.name}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel color='whiteAlpha.900'>City</FormLabel>
            <Select
              value={inputValues.city}
              onChange={({ target: { value } }) => {
                onFiltersChanged();
                onInputValuesChanged('city', value);
              }}
              placeholder='None'
              bgColor='gray.100'
              color={'teal.600'}
              m={['sm', 'md', 'lg', 'xl']}
            >
              {filters.cities.map((city) => (
                <option key={city.name} value={city.name}>
                  {city.name}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel color='whiteAlpha.900'>Course</FormLabel>
            <Select
              value={inputValues.course}
              onChange={({ target: { value } }) => {
                onFiltersChanged();
                onInputValuesChanged('course', value);
              }}
              placeholder='None'
              bgColor='gray.100'
              color={'teal.600'}
            >
              {filters.courses.map((course) => (
                <option key={course.name} value={course.name}>
                  {course.name}
                </option>
              ))}
            </Select>
          </FormControl>
          <HStack spacing={3}>
            <Button
              type='submit'
              size='md'
              colorScheme={hasFilterChanged ? 'red' : 'gray'}
              leftIcon={<SearchIcon />}
            >
              Search
            </Button>
            <Button onClick={handleClearButton}>Clear</Button>
          </HStack>
        </Stack>
      </form>
    </Stack>
  );
}
