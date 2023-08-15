import { useState, useEffect } from 'react';
import useSWR, { preload } from 'swr';
import useSWRImmutable from 'swr/immutable';

const PostService = {
  GetPosts: (filters, searchParamsValidated, setPage) => {
    const fetchUrl = `/faculties/?faculty=${filters.faculty}&school=${filters.school}&city=${filters.city}&course=${filters.course}&page=${filters.page}`;

    const fetcher = (url) => {
      return fetch(url, {}, [404])
        .then((response) => {
          return response.json();
        })
        .catch((error) => {
          if (error?.response?.status === 404) setPage(1);
        });
    };

    const { data } = useSWR(
      searchParamsValidated.current ? fetchUrl : null,
      fetcher,
      {
        // fallbackData: null,
        // revalidateIfStale: false,
        // revalidateOnFocus: false,
        // revalidateOnReconnect: false,
        // revalidateOnMount: true
      }
    );

    preload(
      `/faculties/?faculty=${filters.faculty}&school=${filters.school}&city=${
        filters.city
      }&course=${filters.course}&page=${filters.page + 1}`,
      (url) => {
        return fetch(url, {}, [404]).then((response) => response.json());
      }
    );

    return data;
  },
  GetPost: (id) => {
    const { data, error, isLoading, isValidating, mutate } = useSWRImmutable(
      `/faculties/${id}/`,
      (url) => {
        return fetch(url, {}, [404]).then((response) => response.json());
      },
      {
        onSuccess: (data) => {
          window.history.replaceState(
            null,
            '',
            process.env.REACT_APP_BASENAME +
              '/faculties/' +
              encodeURIComponent(
                data.name.toLowerCase().split(' ').join('-') + `-${id}`
              )
          );
        },
      }
    );

    return {
      data,
      error,
      isLoading,
      isValidating,
      mutate,
    };
  },
  GetFilters: (setSearch, search, searchParamsValidated) => {
    const [data, setData] = useState({
      schools: [],
      cities: [],
      courses: [],
    });

    useEffect(() => {
      fetch('/filters/')
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          const predicate = (a, b) => a.name.localeCompare(b.name);
          data.schools.sort(predicate);
          data.cities.sort(predicate);
          data.courses.sort(predicate);

          const params = {};

          params.faculty = search.faculty;

          if (data.schools.some((el) => el.name === search.school))
            params.school = search.school;

          if (data.cities.some((el) => el.name === search.city))
            params.city = search.city;

          if (data.courses.some((el) => el.name === search.course))
            params.course = search.course;

          searchParamsValidated.current = true;

          setSearch(params, true);

          setData({
            schools: data.schools,
            cities: data.cities,
            courses: data.courses,
          });
        });
    }, []);

    return data;
  },
};

export default PostService;
