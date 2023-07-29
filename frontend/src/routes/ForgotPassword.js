import {
  Button,
  VStack,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Box,
} from '@chakra-ui/react';
import { useState } from 'react';
import FormErrors from '../components/FormErrors';
import { useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
  const [formData, setFormData] = useState({
    email: '',
    formErrors: { email: '', '': '' },
    emailValid: false,
    formValid: false,
  });

  const navigate = useNavigate();

  function handleUserInput(e) {
    e.preventDefault();
    const name = e.target.name;
    const value = e.target.value;
    validateField(name, value);
  }

  function validateField(fieldName, value) {
    let fieldValidationErrors = formData.formErrors;
    let emailValid = formData.emailValid;

    switch (fieldName) {
      case 'email':
        emailValid = /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i.test(value);
        fieldValidationErrors.email = emailValid ? '' : 'Email is invalid';
        break;
      default:
        break;
    }

    setFormData({
      ...formData,
      [fieldName]: value,
      formErrors: fieldValidationErrors,
      emailValid: emailValid,
      formValid: emailValid,
    });
  }

  const [submit, setSubmit] = useState(false);

  const resetPasswordFormSubmit = (data) => {
    let formRequestErrors = formData.formErrors;
    formRequestErrors[''] = '';
    setFormData({
      ...formData,
      formErrors: formRequestErrors,
      formValid: true,
    });

    setSubmit(true);

    fetch(
      '/users/reset_password/',
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
      [400]
    )
      .then(() => {
        navigate('/login', { state: { resetPassword: true } });
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
          resetPasswordFormSubmit({
            email: formData.email,
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
              placeholder='Email'
            />
            <FormErrorMessage>{formData.formErrors['email']}</FormErrorMessage>
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
              Reset password
            </Button>
          </FormControl>
        </VStack>
      </form>
    </Box>
  );
}
