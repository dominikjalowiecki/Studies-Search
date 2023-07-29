import { Button } from '@chakra-ui/react';

export default function PaginationButton({ children, ...props }) {
  return (
    <Button colorScheme='teal' color='white' {...props}>
      {children}
    </Button>
  );
}
