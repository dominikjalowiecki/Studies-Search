import { Flex, Box, Heading, Text } from '@chakra-ui/react';
import Filters from '../components/Filters';
import PostsListing from '../components/Posts';
import { useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const useCustomSearchParams = (param = {}) => {
  const [search, setSearch] = useSearchParams();
  const navigate = useNavigate();

  const searchAsObject = useMemo(() => Object.fromEntries(search), [search]);

  const transformedSearch = useMemo(
    () =>
      Object.keys(param).reduce(
        (acc, key) => ({
          ...acc,
          [key]: param[key](acc[key]),
        }),
        searchAsObject
      ),
    [searchAsObject]
  );

  const transformedSetSearch = (params, isInitial = false) => {
    if (
      !Object.keys(transformedSearch).every(
        (key) =>
          params[key] === transformedSearch[key] ||
          (transformedSearch[key] === '' && params[key] === undefined)
      ) ||
      isInitial
    ) {
      if (isInitial)
        params.page =
          transformedSearch.page !== 1 ? transformedSearch.page : '';
      else params.page = !!params.page && params.page !== 1 ? params.page : '';

      const transformedParams = Object.keys(params).reduce((acc, key) => {
        if (params[key] !== '')
          return {
            ...acc,
            [key]: params[key],
          };

        return { ...acc };
      }, {});

      if (Object.keys(transformedParams).length !== 0)
        setSearch(transformedParams, { replace: true });
      else navigate({ search: '' }, { replace: true });
    }
  };

  const setPage = (page) => {
    transformedSetSearch({
      ...transformedSearch,
      page: page > 0 ? page : 1,
    });
  };

  return [transformedSearch, transformedSetSearch, setPage];
};

const PARAMS_ENUM = {
  StringParam: (string = '') => string,
  BooleanParam: (string = '') => string === 'true',
  PageParam: (string = '') => {
    const number = Number(string);

    if (!isNaN(number) && number > 0) return number;
    return 1;
  },
};

export default function Posts({ searchParamsValidated }) {
  const [search, setSearch, setPage] = useCustomSearchParams({
    faculty: PARAMS_ENUM.StringParam,
    school: PARAMS_ENUM.StringParam,
    city: PARAMS_ENUM.StringParam,
    course: PARAMS_ENUM.StringParam,
    page: PARAMS_ENUM.PageParam,
  });

  return (
    <Box>
      <Flex direction='column'>
        <Box bgGradient='linear(to-r, teal.600, teal.400)' height='250px'>
          <Box mx='auto' px='5' mt='50px' color='white'>
            <Heading>Future belongs to you!</Heading>
            <Text>Find your career path.</Text>
          </Box>
        </Box>
        <Filters
          setSearch={setSearch}
          search={search}
          searchParamsValidated={searchParamsValidated}
          mt='-75px'
        />
        <PostsListing
          filters={search}
          searchParamsValidated={searchParamsValidated}
          setPage={setPage}
        />
      </Flex>
    </Box>
  );
}
