import {
  Button,
  VStack,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  useToast,
  InputRightElement,
  InputGroup,
  Box,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import FormErrors from '../components/FormErrors';
import { AuthConsumer } from '../utils/auth';
import { useLocation, Link } from 'react-router-dom';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    formErrors: { email: '', password: '', '': '' },
    emailValid: false,
    passwordValid: false,
    formValid: false,
  });

  const toast = useToast();

  const { login, errors, clear_errors } = AuthConsumer();

  const { state } = useLocation();
  useEffect(() => {
    if (state?.registered) {
      toast({
        title: "You've been registered!",
        description: 'Check your email for account activation link.',
        status: 'info',
        duration: 9000,
        isClosable: true,
      });
    } else if (state?.activated) {
      toast({
        title: 'You account has been activated!',
        status: 'success',
        duration: 9000,
        isClosable: true,
      });
    } else if (state?.resetPassword) {
      toast({
        title: 'Password reset link has been sent to your email.',
        status: 'info',
        duration: 9000,
        isClosable: true,
      });
    } else if (state?.passwordChanged) {
      toast({
        title: 'Password has been changed!',
        status: 'success',
        duration: 9000,
        isClosable: true,
      });
    }
  }, []);

  useEffect(() => {
    let formRequestErrors = formData.formErrors;

    if (Object.keys(errors).length > 0) {
      Object.keys(errors).forEach((key) => {
        formRequestErrors[key] = errors[key];
      });

      setFormData({
        ...formData,
        formErrors: formRequestErrors,
        formValid: false,
      });
    }
  }, [errors]);

  function handleUserInput(e) {
    e.preventDefault();
    const name = e.target.name;
    const value = e.target.value;
    validateField(name, value);
  }

  function validateField(fieldName, value) {
    let fieldValidationErrors = formData.formErrors;
    let emailValid = formData.emailValid;
    let passwordValid = formData.passwordValid;

    switch (fieldName) {
      case 'email':
        emailValid = /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i.test(value);
        fieldValidationErrors.email = emailValid ? '' : 'Email is invalid';
        break;
      case 'password':
        passwordValid = value.length >= 8;
        fieldValidationErrors.password = passwordValid
          ? ''
          : 'Password is too short';
        break;
      default:
        break;
    }

    setFormData({
      ...formData,
      [fieldName]: value,
      formErrors: fieldValidationErrors,
      emailValid: emailValid,
      passwordValid: passwordValid,
      formValid: emailValid && passwordValid,
    });
  }

  const [submit, setSubmit] = useState(false);

  const loginFormSubmit = ({ email, password }) => {
    clear_errors();
    setSubmit(true);
    login({ email, password }).finally(() => {
      setSubmit(false);
    });
  };

  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  return (
    <Box width={['100%', '100%', '400px']}>
      <form
        method='POST'
        onSubmit={(event) => {
          event.preventDefault();
          loginFormSubmit({
            email: formData.email,
            password: formData.password,
          });
        }}
      >
        <VStack gap={3}>
          <FormControl isInvalid={formData.formErrors['email']} isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type='email'
              name='email'
              maxLength='100'
              value={formData.email}
              onChange={handleUserInput}
              required
              placeholder='Email'
            />
            <FormErrorMessage>{formData.formErrors['email']}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={formData.formErrors['password']} isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup size='md'>
              <Input
                name='password'
                maxLength='100'
                value={formData.password}
                type={show ? 'text' : 'password'}
                onChange={handleUserInput}
                placeholder='Password'
              />
              <InputRightElement width='4.5rem'>
                <Button h='1.75rem' size='sm' onClick={handleClick}>
                  {show ? 'Hide' : 'Show'}
                </Button>
              </InputRightElement>
            </InputGroup>
            <FormErrorMessage>
              {formData.formErrors['password']}
            </FormErrorMessage>
          </FormControl>
          <FormErrors formErrors={formData.formErrors} />
          <FormControl>
            <Wrap>
              <WrapItem>
                <Button
                  type='submit'
                  size='md'
                  px='10'
                  disabled={!formData.formValid || submit}
                  isLoading={submit}
                >
                  Login
                </Button>
              </WrapItem>
              <WrapItem>
                <Button
                  as={Link}
                  colorScheme='gray'
                  to='/forgot-password'
                  variant='ghost'
                >
                  Forgot password
                </Button>
              </WrapItem>
            </Wrap>
          </FormControl>
        </VStack>
      </form>
    </Box>
  );
}
