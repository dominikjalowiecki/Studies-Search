import {
  Button,
  VStack,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Select,
  FormHelperText,
  Box,
} from '@chakra-ui/react';
import { useState } from 'react';
import FormErrors from '../components/FormErrors';
import { useNavigate } from 'react-router-dom';
import useSWRImmutable from 'swr/immutable';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    membership: 0,
    re_password: '',
    formErrors: {
      username: '',
      email: '',
      password: '',
      repassword: '',
      '': '',
    },
    usernameValid: false,
    emailValid: false,
    passwordValid: false,
    repasswordValid: false,
    formValid: false,
  });

  const navigate = useNavigate();

  const { data: memberships } = useSWRImmutable('/membership/', (url) => {
    return fetch(url, {}).then((response) => {
      return response.json();
    });
  });

  function handleUserInput(e) {
    e.preventDefault();
    const name = e.target.name;
    const value = e.target.value;
    validateField(name, value);
  }

  function validateField(fieldName, value) {
    let fieldValidationErrors = formData.formErrors;
    let usernameValid = formData.usernameValid;
    let emailValid = formData.emailValid;
    let passwordValid = formData.passwordValid;
    let repasswordValid = formData.repasswordValid;

    switch (fieldName) {
      case 'username':
        usernameValid = /^[\w.@+-]{1,150}$/.test(value);
        fieldValidationErrors.username = usernameValid
          ? ''
          : 'Username is invalid';
        break;
      case 'email':
        emailValid = /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i.test(value);
        fieldValidationErrors.email = emailValid ? '' : 'Email is invalid';
        break;
      case 'password':
        passwordValid = value.length >= 8;
        fieldValidationErrors.password = passwordValid
          ? ''
          : 'Password is too short';
        repasswordValid = value === formData.re_password;
        fieldValidationErrors.repassword = repasswordValid
          ? ''
          : "Confirm password doesn't match password";
        break;
      case 're_password':
        repasswordValid = value === formData.password;
        fieldValidationErrors.repassword = repasswordValid
          ? ''
          : "Confirm password doesn't match password";
        break;
      default:
        break;
    }

    setFormData({
      ...formData,
      [fieldName]: value,
      formErrors: fieldValidationErrors,
      usernameValid: usernameValid,
      emailValid: emailValid,
      passwordValid: passwordValid,
      repasswordValid: repasswordValid,
      formValid:
        usernameValid && emailValid && passwordValid && repasswordValid,
    });
  }

  const [submit, setSubmit] = useState(false);

  const registerFormSubmit = (data) => {
    let formRequestErrors = formData.formErrors;
    formRequestErrors[0] = '';
    setFormData({
      ...formData,
      formErrors: formRequestErrors,
      formValid: true,
    });

    setSubmit(true);

    fetch(
      '/users/',
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
      [400]
    )
      .then(() => {
        navigate('/login', { state: { registered: true } });
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
    <Box width={['100%', '100%', '400px']}>
      <form
        method='POST'
        onSubmit={(event) => {
          event.preventDefault();
          registerFormSubmit({
            username: formData.username,
            email: formData.email,
            membership: formData.membership,
            password: formData.password,
            re_password: formData.re_password,
          });
        }}
      >
        <VStack gap={3}>
          <FormControl isInvalid={formData.formErrors['username']} isRequired>
            <FormLabel>Username</FormLabel>
            <Input
              type='text'
              name='username'
              maxLength='150'
              value={formData.username}
              onChange={handleUserInput}
              placeholder='Username'
            />
            <FormErrorMessage>
              {formData.formErrors['username']}
            </FormErrorMessage>
            <FormHelperText>
              Can contain word characters, '.', '@', '+' or '-'.
            </FormHelperText>
          </FormControl>
          <FormControl isInvalid={formData.formErrors['email']} isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type='email'
              name='email'
              maxLength='100'
              value={formData.email}
              onChange={handleUserInput}
              placeholder='Email'
            />
            <FormErrorMessage>{formData.formErrors['email']}</FormErrorMessage>
          </FormControl>
          <FormControl isRequired>
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
                  <option key={el.id} value={el.id}>
                    {el.name}
                  </option>
                ))}
            </Select>
          </FormControl>
          <FormControl isInvalid={formData.formErrors['password']} isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type='password'
              name='password'
              maxLength='100'
              value={formData.password}
              onChange={handleUserInput}
              placeholder='Password'
            />
            <FormErrorMessage>
              {formData.formErrors['password']}
            </FormErrorMessage>
            <FormHelperText>Minimum 8 characters.</FormHelperText>
          </FormControl>
          <FormControl isInvalid={formData.formErrors['repassword']} isRequired>
            <FormLabel>Confirm Password</FormLabel>
            <Input
              type='password'
              name='re_password'
              maxLength='100'
              value={formData.re_password}
              onChange={handleUserInput}
              placeholder='Confirm password'
            />
            <FormErrorMessage>
              {formData.formErrors['repassword']}
            </FormErrorMessage>
          </FormControl>
          <FormErrors formErrors={formData.formErrors} />
          <FormControl>
            <Button
              type='submit'
              size='md'
              px='10'
              disabled={!formData.formValid || submit}
              isLoading={submit}
            >
              Register
            </Button>
          </FormControl>
        </VStack>
      </form>
    </Box>
  );
}
