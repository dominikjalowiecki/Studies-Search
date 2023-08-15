import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  FormErrorMessage,
  FormHelperText,
  InputGroup,
  InputRightElement,
  Stack,
  Image,
  Wrap,
  WrapItem,
  Tag,
  TagLabel,
  TagCloseButton,
} from '@chakra-ui/react';
import { useState, useEffect, useRef } from 'react';
import FormErrors from './FormErrors';
import { AuthConsumer } from '../utils/auth';
import useSWRImmutable from 'swr/immutable';

export default function EditPostModal({ isOpen, onClose, post, mutate }) {
  const [formData, setFormData] = useState({
    name: post.name,
    description: post.description,
    add_school: post.school,
    add_city: post.city,
    courses: post.courses,
    add_courses: '',
    hyperlink: post.hyperlink,
    formErrors: {
      add_city: '',
      hyperlink: '',
      images: '',
      name: '',
      description: '',
      add_courses: '',
      '': '',
    },
    cityValid: true,
    hyperlinkValid: true,
    imagesValid: true,
    formValid: false,
  });

  const imageInputRef = useRef();

  const { authFetch } = AuthConsumer();

  const [thumbnails, setThumbnails] = useState([]);

  function handleUserInput(e) {
    e.preventDefault();
    const name = e.target.name;
    const value = e.target.value;
    validateField(name, value, e.target);
  }

  useEffect(() => {
    if (thumbnails.length > 0) {
      thumbnails.forEach((el, idx) => {
        URL.revokeObjectURL(el);
      });
      setThumbnails([]);
    }
    return () => {
      thumbnails.forEach((el, idx) => {
        URL.revokeObjectURL(el);
      });
    };
  }, [isOpen]);

  const [courses, setCourses] = useState([]);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  function validateField(fieldName, value, target) {
    let fieldValidationErrors = formData.formErrors;
    let cityValid = formData.cityValid;
    let hyperlinkValid = formData.hyperlinkValid;
    let imagesValid = formData.imagesValid;

    switch (fieldName) {
      case 'name':
        fieldValidationErrors.name = '';
        break;
      case 'description':
        fieldValidationErrors.description = '';
        break;
      case 'add_city':
        cityValid = /^[a-zA-Z ]*$/.test(value);
        fieldValidationErrors.add_city = cityValid ? '' : 'City is invalid';
        break;
      case 'add_courses':
        clearTimeout(timerRef.current);
        if (value.length > 3) {
          timerRef.current = setTimeout(() => {
            fetch(
              '/courses/?' +
                new URLSearchParams({
                  name__contains: value,
                })
            )
              .then((response) => response.json())
              .then((json) => {
                setCourses(json);
              });
          }, 800);
        }

        fieldValidationErrors.add_courses = '';
        break;
      case 'hyperlink':
        hyperlinkValid =
          /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/.test(
            value
          );
        fieldValidationErrors.hyperlink = hyperlinkValid
          ? ''
          : 'Hyperlink is invalid';
        break;
      case 'images':
        if (thumbnails.length > 0) {
          thumbnails.forEach((el, idx) => {
            URL.revokeObjectURL(el);
          });
          setThumbnails([]);
        }

        const imageMaxSize = 2097152; // 2MB

        if (target.files.length > 4) imagesValid = false;
        else {
          const allowedMIMETypes = [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/gif',
          ];

          for (const file of target.files) {
            if (file.size > imageMaxSize) {
              imagesValid = false;

              break;
            } else if (!allowedMIMETypes.includes(file.type)) {
              imagesValid = false;

              break;
            } else {
              imagesValid = true;
            }
          }
        }

        const thumbs = [];
        if (imagesValid) {
          for (const file of target.files) {
            thumbs.push(URL.createObjectURL(file));
          }
        }

        setThumbnails([...thumbs]);
        fieldValidationErrors.images = imagesValid ? '' : 'Images are invalid';
        break;
      default:
        break;
    }

    setFormData({
      ...formData,
      [fieldName]: value,
      formErrors: fieldValidationErrors,
      cityValid: cityValid,
      hyperlinkValid: hyperlinkValid,
      imagesValid: imagesValid,
      formValid: cityValid && hyperlinkValid && imagesValid,
    });
  }

  const { data: filters } = useSWRImmutable('/filters/', (url) => {
    return fetch(url, {}).then((response) => {
      return response.json();
    });
  });

  const [submit, setSubmit] = useState(false);

  const editPostFormSubmit = ({
    name,
    description,
    add_school,
    add_city,
    courses,
    hyperlink,
  }) => {
    let formRequestErrors = {};
    setFormData({
      ...formData,
      formErrors: formRequestErrors,
      formValid: true,
    });

    const form = new FormData();

    form.append('name', name);
    form.append('description', description);
    form.append('add_school', add_school);
    form.append('add_city', add_city);
    for (const course of courses) {
      form.append('add_courses', course);
    }

    form.append('hyperlink', hyperlink);

    const target = imageInputRef.current;
    for (const file of target.files) {
      form.append('uploaded_images', file);
    }

    setSubmit(true);

    authFetch(
      `/faculties/${post.id}/`,
      {
        method: 'PUT',
        body: form,
      },
      [400],
      true,
      false
    )
      .then((res) => res.json())
      .then((json) => {
        mutate(json, {
          revalidate: false,
        });
        onClose();
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

  const handleAddCourse = ({ course }) => {
    const courses = formData.courses;

    if (course == '') return;

    if (courses.length > 4) {
      setFormData({
        ...formData,
        formErrors: {
          ...formData.errors,
          add_courses: 'Maximum 5 courses allowed',
        },
      });

      return;
    }

    if (!formData.courses.includes(course)) courses.push(course);

    setFormData({
      ...formData,
      courses: [...courses],
      add_courses: '',
    });
  };

  const handleDeleteCourse = ({ index }) => {
    const courses = formData.courses;
    courses.splice(index, 1);
    setFormData({
      ...formData,
      courses: [...courses],
      formErrors: {
        ...formData.errors,
        add_courses: '',
      },
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Faculty</ModalHeader>
        <ModalCloseButton />
        <form
          method='POST'
          onSubmit={(event) => {
            event.preventDefault();
            editPostFormSubmit({
              name: formData.name,
              description: formData.description,
              add_school: formData.add_school,
              add_city: formData.add_city,
              courses: formData.courses,
              hyperlink: formData.hyperlink,
            });
          }}
        >
          <ModalBody>
            <VStack gap={2}>
              <FormControl isInvalid={formData.formErrors['name']} isRequired>
                <FormLabel>Faculty Name</FormLabel>
                <Input
                  type='text'
                  name='name'
                  placeholder='Name'
                  maxLength='100'
                  value={formData.name}
                  onChange={handleUserInput}
                />
                <FormErrorMessage>
                  {formData.formErrors['name']}
                </FormErrorMessage>
              </FormControl>
              <FormControl
                isInvalid={formData.formErrors['description']}
                isRequired
              >
                <FormLabel>Description</FormLabel>
                <Textarea
                  name='description'
                  placeholder='Description'
                  maxLength='500'
                  value={formData.description}
                  onChange={handleUserInput}
                >
                  {formData.description}
                </Textarea>
                <FormErrorMessage>
                  {formData.formErrors['description']}
                </FormErrorMessage>
              </FormControl>
              <FormControl
                isInvalid={formData.formErrors['add_city']}
                isRequired
              >
                <FormLabel>City</FormLabel>
                <Input
                  type='text'
                  name='add_city'
                  placeholder='City'
                  maxLength='50'
                  value={formData.add_city}
                  onChange={handleUserInput}
                  list='city-datalist'
                  required
                />
                <datalist id='city-datalist'>
                  {filters &&
                    filters.cities.map((el, idx) => (
                      <option value={el.name} key={idx} />
                    ))}
                </datalist>
                <FormErrorMessage>
                  {formData.formErrors['add_city']}
                </FormErrorMessage>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>School</FormLabel>
                <Input
                  type='text'
                  name='add_school'
                  placeholder='School'
                  maxLength='100'
                  value={formData.add_school}
                  onChange={handleUserInput}
                  list='school-datalist'
                  required
                />
                <datalist id='school-datalist'>
                  {filters &&
                    filters.schools.map((el, idx) => (
                      <option value={el.name} key={idx} />
                    ))}
                </datalist>
              </FormControl>
              <FormControl isInvalid={formData.formErrors['add_courses']}>
                <FormLabel>Courses</FormLabel>
                <InputGroup size='md'>
                  <Input
                    type='text'
                    name='add_courses'
                    placeholder='Course'
                    maxLength='100'
                    value={formData.add_courses}
                    onChange={handleUserInput}
                    list='courses-datalist'
                  />
                  <datalist id='courses-datalist'>
                    {courses.map((el, idx) => (
                      <option value={el.name} key={idx} />
                    ))}
                  </datalist>
                  <InputRightElement width='4.5rem'>
                    <Button
                      h='1.75rem'
                      size='sm'
                      onClick={() => {
                        handleAddCourse({ course: formData.add_courses });
                      }}
                    >
                      {'Add'}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>
                  {formData.formErrors['add_courses']}
                </FormErrorMessage>
                <FormHelperText>
                  Write minimum 4 letters for hint.
                </FormHelperText>
                <Wrap mt={2}>
                  {formData.courses.map((el, idx) => (
                    <WrapItem key={idx}>
                      <Tag
                        size={'md'}
                        borderRadius='md'
                        variant='solid'
                        colorScheme='teal'
                      >
                        <TagLabel>{el}</TagLabel>
                        <TagCloseButton
                          onClick={() => {
                            handleDeleteCourse({ index: idx });
                          }}
                        />
                      </Tag>
                    </WrapItem>
                  ))}
                </Wrap>
              </FormControl>
              <FormControl
                isInvalid={formData.formErrors['hyperlink']}
                isRequired
              >
                <FormLabel>Hyperlink</FormLabel>
                <Input
                  type='text'
                  name='hyperlink'
                  placeholder='Hyperlink'
                  maxLength='200'
                  value={formData.hyperlink}
                  onChange={handleUserInput}
                />
                <FormErrorMessage>
                  {formData.formErrors['hyperlink']}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={formData.formErrors['images']}>
                <FormLabel>Images (Override)</FormLabel>
                <Input
                  type='file'
                  name='images'
                  ref={imageInputRef}
                  placeholder='None'
                  onChange={handleUserInput}
                  accept='image/jpeg,image/jpg,image/png,image/gif'
                  multiple
                  pt={1}
                />
                <FormErrorMessage>
                  {formData.formErrors['images']}
                </FormErrorMessage>
                <FormHelperText>
                  Accepted jpeg, png and gif. Max 4 images, 2MB each.
                </FormHelperText>
                <Stack direction='row' mt='2'>
                  {thumbnails.map((el, idx) => (
                    <Image
                      key={idx}
                      boxSize='50px'
                      objectFit='cover'
                      src={el}
                      rounded='md'
                    />
                  ))}
                </Stack>
              </FormControl>
              <FormErrors formErrors={formData.formErrors} />
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              Close
            </Button>
            <Button
              type='submit'
              size='md'
              px='10'
              disabled={!formData.formValid || submit}
              isLoading={submit}
              colorScheme='teal'
            >
              Submit
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
