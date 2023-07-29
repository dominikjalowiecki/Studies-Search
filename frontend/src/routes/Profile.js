import { useState, useEffect } from 'react';
import { Spinner, Flex } from '@chakra-ui/react';
import { AuthConsumer } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardBody, CardFooter } from '@chakra-ui/react';
import ChangePassword from '../components/ChangePassword';
import UpdateUser from '../components/UpdateUser';

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  useToast,
  Badge,
  Wrap,
  WrapItem,
  Heading,
} from '@chakra-ui/react';
import { DateTime } from 'luxon';

export default function Profile() {
  const { user } = AuthConsumer();
  const toast = useToast();

  return !!user ? (
    <>
      <Heading size='md' mb={5} mt={10}>
        User Details
      </Heading>
      {user && (
        <TableContainer mb={10}>
          <Table variant='simple' size='sm'>
            <Thead>
              <Tr>
                <Th>Property</Th>
                <Th>Value</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>Username</Td>
                <Td>{user.username}</Td>
              </Tr>
              <Tr>
                <Td>Email</Td>
                <Td>{user.email}</Td>
              </Tr>
              <Tr>
                <Td>Membership</Td>
                <Td>{user.membership}</Td>
              </Tr>
              <Tr>
                <Td>Is moderator</Td>
                <Td>
                  {user.is_moderator ? (
                    <Badge colorScheme='green'>True</Badge>
                  ) : (
                    <Badge colorScheme='red'>False</Badge>
                  )}
                </Td>
              </Tr>
              <Tr>
                <Td>Date joined</Td>
                <Td>
                  {DateTime.fromISO(user.date_joined).toLocaleString(
                    DateTime.DATETIME_SHORT_WITH_SECONDS
                  )}
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
      )}
      <Wrap>
        <WrapItem>
          <ChangePassword toast={toast} />
        </WrapItem>
        <WrapItem>
          <UpdateUser toast={toast} />
        </WrapItem>
      </Wrap>
    </>
  ) : (
    <Flex justify='center'>
      <Spinner />
    </Flex>
  );
}
