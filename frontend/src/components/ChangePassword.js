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
  FormHelperText,
} from '@chakra-ui/react';
import { useRef, useState, useEffect, useCallback } from 'react';
import useSWRImmutable from 'swr/immutable';
import { AuthConsumer } from '../utils/auth';
import FormErrors from '../components/FormErrors';

export default function ChangePassword({ toast }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialState = {
    current_password: '',
    new_password: '',
    formErrors: { current_password: '', new_password: '', '': '' },
    currentPasswordValid: false,
    newPasswordValid: false,
    formValid: false,
  };
  const [formData, setFormData] = useState(initialState);

  const closeDrawer = () => {
    setFormData(initialState);
    onClose();
  };

  const btnRef = useRef();

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
          setFormData((f) => ({
            ...f,
            membership: member.name,
            username: user.username,
          }));
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
    let currentPasswordValid = formData.currentPasswordValid;
    let newPasswordValid = formData.newPasswordValid;

    switch (fieldName) {
      case 'current_password':
        currentPasswordValid = value.length >= 8;
        fieldValidationErrors.current_password = currentPasswordValid
          ? ''
          : 'Current password is too short';
        break;
      case 'new_password':
        newPasswordValid = value.length >= 8;
        fieldValidationErrors.new_password = newPasswordValid
          ? ''
          : 'New password is too short';
        break;
      default:
        break;
    }

    setFormData((f) => ({
      ...f,
      [fieldName]: value,
      formErrors: fieldValidationErrors,
      currentPasswordValid: currentPasswordValid,
      newPasswordValid: newPasswordValid,
      formValid: currentPasswordValid && newPasswordValid,
    }));
  }

  const [submit, setSubmit] = useState(false);

  const changePasswordFormSubmit = useCallback((data) => {
    const formRequestErrors = {};

    setFormData((f) => ({
      ...f,
      formErrors: formRequestErrors,
      formValid: true,
    }));

    setSubmit(true);

    authFetch(
      '/users/set_password/',
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
      [400]
    )
      .then(() => {
        closeDrawer();

        toast({
          title: 'Password has been changed!',
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

        setFormData((f) => ({
          ...f,
          formErrors: formRequestErrors,
          formValid: false,
        }));
      })
      .finally(() => {
        setSubmit(false);
      });
  }, []);

  return (
    <>
      <Button ref={btnRef} colorScheme='teal' onClick={onOpen}>
        Change Password
      </Button>
      <Drawer
        isOpen={isOpen}
        placement='right'
        onClose={closeDrawer}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Change Password</DrawerHeader>

          <form
            method='POST'
            onSubmit={(event) => {
              event.preventDefault();
              changePasswordFormSubmit({
                current_password: formData.current_password,
                new_password: formData.new_password,
              });
            }}
          >
            <DrawerBody>
              <VStack gap={3}>
                <FormControl
                  isInvalid={formData.formErrors['current_password']}
                  isRequired
                >
                  <FormLabel>Current Password</FormLabel>
                  <Input
                    type='password'
                    name='current_password'
                    maxLength='100'
                    value={formData.current_password}
                    onChange={handleUserInput}
                    placeholder='Current Password'
                  />
                  <FormErrorMessage>
                    {formData.formErrors['current_password']}
                  </FormErrorMessage>
                </FormControl>
                <FormControl
                  isInvalid={formData.formErrors['new_password']}
                  isRequired
                >
                  <FormLabel>New Password</FormLabel>
                  <Input
                    type='password'
                    name='new_password'
                    maxLength='100'
                    value={formData.new_password}
                    onChange={handleUserInput}
                    placeholder='New Password'
                  />
                  <FormErrorMessage>
                    {formData.formErrors['new_password']}
                  </FormErrorMessage>
                  <FormHelperText>Minimum 8 characters.</FormHelperText>
                </FormControl>
                <FormErrors formErrors={formData.formErrors} />
              </VStack>
            </DrawerBody>
            <DrawerFooter>
              <Button mr={3} onClick={closeDrawer}>
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
