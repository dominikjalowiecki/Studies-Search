import { useLocation, Link } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Box,
} from '@chakra-ui/react';

export default function Breadcrumbs() {
  const location = useLocation();
  const pathname = location.pathname.split('/');

  String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
  };

  return (
    <Box>
      {pathname[1] !== '' &&
        pathname[1] !== 'reset-password-confirm' &&
        pathname[1] !== 'faculties' && (
          <Breadcrumb my='10'>
            {pathname.map((path, idx, arr) => (
              <BreadcrumbItem key={path}>
                <BreadcrumbLink as={Link} to={arr.slice(0, idx + 1).join('/')}>
                  {idx !== 0 ? path.replaceAll('-', ' ').capitalize() : 'Home'}
                </BreadcrumbLink>
              </BreadcrumbItem>
            ))}
          </Breadcrumb>
        )}
    </Box>
  );
}
