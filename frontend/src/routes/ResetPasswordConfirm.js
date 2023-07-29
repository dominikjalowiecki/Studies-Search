import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  Button,
  VStack,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Heading,
  FormHelperText,
  Box,
} from '@chakra-ui/react';
import FormErrors from '../components/FormErrors';

export default function ResetPasswordConfirm() {
  const { uid, token } = useParams();

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: '',
    re_password: '',
    formErrors: { password: '', repassword: '', '': '' },
    passwordValid: false,
    repasswordValid: false,
    formValid: false,
  });

  function handleUserInput(e) {
    e.preventDefault();
    const name = e.target.name;
    const value = e.target.value;
    validateField(name, value);
  }

  function validateField(fieldName, value) {
    let fieldValidationErrors = formData.formErrors;
    let passwordValid = formData.passwordValid;
    let repasswordValid = formData.repasswordValid;

    switch (fieldName) {
      case 'password':
        passwordValid = value.length >= 8;
        fieldValidationErrors.password = passwordValid
          ? ''
          : 'Password is too short';
        repasswordValid = value === formData.re_password;
        fieldValidationErrors.repassword = repasswordValid
          ? ''
          : " Confirm password doesn't match password";
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
      passwordValid: passwordValid,
      repasswordValid: repasswordValid,
      formValid: passwordValid && repasswordValid,
    });
  }

  const [submit, setSubmit] = useState(false);

  const resetPasswordFormSubmit = (data) => {
    let formRequestErrors = formData.formErrors;
    formRequestErrors[0] = '';
    setFormData({
      ...formData,
      formErrors: formRequestErrors,
      formValid: true,
    });

    setSubmit(true);

    fetch(
      '/users/reset_password_confirm/',
      {
        method: 'POST',
        body: JSON.stringify({
          uid,
          token,
          new_password: data.password,
        }),
      },
      [400]
    )
      .then(() => {
        navigate('/login', { state: { passwordChanged: true } });
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
      <Heading size='md' mb={5} mt={10}>
        Reset password
      </Heading>
      <Box width={['100%', '100%', '400px']}>
        <form
          method='POST'
          onSubmit={(event) => {
            event.preventDefault();
            resetPasswordFormSubmit({
              password: formData.password,
            });
          }}
        >
          <VStack gap={3}>
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
              <FormHelperText>Minimum 8 characters.</FormHelperText>
              <FormErrorMessage>
                {formData.formErrors['password']}
              </FormErrorMessage>
            </FormControl>
            <FormControl
              isInvalid={formData.formErrors['repassword']}
              isRequired
            >
              <FormLabel>Confirm Password</FormLabel>
              <Input
                type='password'
                name='re_password'
                maxLength='100'
                value={formData.re_password}
                onChange={handleUserInput}
                placeholder='Confirm Password'
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
                Reset password
              </Button>
            </FormControl>
          </VStack>
        </form>
      </Box>
    </>
  );
}
