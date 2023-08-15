import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Button,
  Input,
  VStack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Select,
  FormHelperText,
} from '@chakra-ui/react';
import { useRef, useState, useEffect } from 'react';
import useSWRImmutable from 'swr/immutable';
import { useSWRConfig } from 'swr';

import { AuthConsumer } from '../utils/auth';

import FormErrors from '../components/FormErrors';

export default function UpdateUser({ toast }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();

  const { mutate } = useSWRConfig();

  const [formData, setFormData] = useState({
    username: '',
    membership: 0,
    formErrors: { username: '', '': '' },
    usernameValid: false,
    formValid: false,
  });

  const { data: memberships } = useSWRImmutable('/membership/', (url) => {
    return fetch(url, {}).then((response) => {
      return response.json();
    });
  });

  const { user, authFetch } = AuthConsumer();

  useEffect(() => {
    if (memberships)
      memberships.forEach((member) => {
        if (member.name === user.membership)
          setFormData({
            ...formData,
            membership: member.name,
            username: user.username,
          });
      });
  }, [user, memberships]);

  function handleUserInput(e) {
    e.preventDefault();
    const name = e.target.name;
    const value = e.target.value;
    validateField(name, value);
  }

  function validateField(fieldName, value) {
    let fieldValidationErrors = formData.formErrors;
    let usernameValid = formData.usernameValid;

    switch (fieldName) {
      case 'username':
        usernameValid = /^[\w.@+-]{1,150}$/.test(value);
        fieldValidationErrors.username = usernameValid
          ? ''
          : 'Username is invalid';
        break;
      default:
        usernameValid = /^[\w.@+-]{1,150}$/.test(formData.username);
        fieldValidationErrors.username = usernameValid
          ? ''
          : 'Username is invalid';
        break;
    }

    setFormData({
      ...formData,
      [fieldName]: value,
      formErrors: fieldValidationErrors,
      usernameValid: usernameValid,
      formValid: usernameValid,
    });
  }

  const [submit, setSubmit] = useState(false);

  const updateUserFormSubmit = (data) => {
    let formRequestErrors = formData.formErrors;
    formRequestErrors[0] = '';
    setFormData({
      ...formData,
      formErrors: formRequestErrors,
      formValid: true,
    });

    setSubmit(true);

    authFetch(
      '/users/me/',
      {
        method: 'PUT',
        body: JSON.stringify(data),
      },
      [400]
    )
      .then(() => {
        mutate('/users/me/');
        onClose();
        toast({
          title: 'User has been updated!',
          status: 'success',
          duration: 9000,
          isClosable: true,
        });
      })
      .catch((error) => {
        if (error == false) return;

        formRequestErrors[''] = error.message;

        Object.keys(error.errors).forEach((key) => {
          formRequestErrors[key] = error.errors[key];
        });

        setFormData({
          ...formData,
          formErrors: formRequestErrors,
          formValid: false,
        });
      })
      .finally(() => {
        setSubmit(false);
      });
  };

  return (
    <>
      <Button ref={btnRef} colorScheme='teal' onClick={onOpen}>
        Update User
      </Button>
      <Drawer
        isOpen={isOpen}
        placement='right'
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Update User</DrawerHeader>

          <form
            method='POST'
            onSubmit={(event) => {
              event.preventDefault();
              updateUserFormSubmit({
                username: formData.username,
                membership: formData.membership,
              });
            }}
          >
            <DrawerBody>
              <VStack gap={3}>
                <FormControl isInvalid={formData.formErrors['username']}>
                  <FormLabel>Username</FormLabel>
                  <Input
                    type='text'
                    name='username'
                    maxLength='150'
                    value={formData.username}
                    onChange={handleUserInput}
                  />
                  <FormErrorMessage>
                    {formData.formErrors['username']}
                  </FormErrorMessage>
                  <FormHelperText>
                    Can contain word characters, '.', '@', '+' or '-'.
                  </FormHelperText>
                </FormControl>
                <FormControl>
                  <FormLabel>Membership</FormLabel>
                  <Select
                    name='membership'
                    placeholder='None'
                    value={formData.membership}
                    onChange={handleUserInput}
                    required
                  >
                    {memberships &&
                      memberships.map((el) => (
                        <option key={el.id} value={el.name}>
                          {el.name}
                        </option>
                      ))}
                  </Select>
                </FormControl>
                <FormErrors formErrors={formData.formErrors} />
              </VStack>
            </DrawerBody>
            <DrawerFooter>
              <Button mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button
                type='submit'
                size='md'
                px='10'
                disabled={!formData.formValid || submit}
                colorScheme='teal'
                isLoading={submit}
              >
                Save
              </Button>
            </DrawerFooter>
          </form>
        </DrawerContent>
      </Drawer>
    </>
  );
}
