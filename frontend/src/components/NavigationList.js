import { AuthConsumer } from '../utils/auth';
import { Link as RouterLink } from 'react-router-dom';
import React, { useCallback, useState } from 'react';
import { Link, Button, List, ListItem, Spinner } from '@chakra-ui/react';

export default function NavigationList({ isVertical, closeMenu }) {
  const { authed, is_user_loading, logout } = AuthConsumer();

  const [submit, setSubmit] = useState(false);

  const handleLogout = () => {
    setSubmit(true);
    logout().finally(() => {
      setSubmit(false);
    });
  };

  const menuClick = useCallback((e) => {
    if (
      e.target.classList.contains('chakra-link') ||
      e.target.classList.contains('chakra-button')
    )
      closeMenu();
  });

  return (
    <List
      display='flex'
      flexDirection={isVertical ? 'column' : 'row'}
      justifyContent={'center'}
      alignItems={isVertical ? 'start' : 'center'}
      onClick={menuClick}
      gap={3}
    >
      <ListItem>
        <Link as={RouterLink} to='/'>
          Main page
        </Link>
      </ListItem>
      <ListItem>
        <Link as={RouterLink} to='/faculties'>
          Offer
        </Link>
      </ListItem>
      {is_user_loading === true ? (
        <ListItem>
          <Spinner />
        </ListItem>
      ) : (
        authed && (
          <ListItem>
            <Link as={RouterLink} to='/profile'>
              Profile
            </Link>{' '}
          </ListItem>
        )
      )}
      {authed === false ? (
        <>
          <ListItem>
            <Button
              as={RouterLink}
              isLoading={is_user_loading}
              loadingText='Logging'
              to='/login'
              colorScheme='teal'
            >
              Login
            </Button>
          </ListItem>
          <ListItem>
            <Button
              as={RouterLink}
              loadingText='Register'
              to='/register'
              colorScheme='teal'
            >
              Register
            </Button>
          </ListItem>
        </>
      ) : (
        <ListItem>
          <Button
            onClick={handleLogout}
            disabled={submit}
            isLoading={submit}
            colorScheme='teal'
          >
            Logout
          </Button>
        </ListItem>
      )}
    </List>
  );
}
