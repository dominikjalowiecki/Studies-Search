import { Divider, List, ListItem } from '@chakra-ui/react';

export default function FormError({ formErrors }) {
  return (
    <List w='100%'>
      {Object.keys(formErrors).map((fieldName, i) => {
        if (formErrors[fieldName].length > 0) {
          return (
            <ListItem key={i} color='red.500'>
              {/* {fieldName} */}
              {formErrors[fieldName]}
              <Divider my={2} />
            </ListItem>
          );
        } else {
          return '';
        }
      })}
    </List>
  );
}
