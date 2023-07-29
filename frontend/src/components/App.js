import { Box, Flex, Portal } from '@chakra-ui/react';
import { SkipNavContent } from '@chakra-ui/skip-nav';
import { ServiceStatusProvider } from '../utils/serviceStatus';
import { AuthProvider } from '../utils/auth';
import FetchInterceptor from '../utils/FetchInterceptor';
import Header from './Header';
import Breadcrumbs from './Breadcrumbs';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';
import UnavailableAlert from './UnavailableAlert';
import { Helmet } from 'react-helmet';
import theme from '../themes/theme';

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

export default function App() {
  return (
    <div className='App'>
      <Helmet>
        <link
          rel='preload'
          href={
            (SERVER_URL || '') +
            '/faculties/?faculty=&school=&city=&course=&page=1'
          }
          as='fetch'
          crossorigin='anonymous'
        />
        <meta name='robots' content='noindex, nofollow' />
      </Helmet>
      <ServiceStatusProvider>
        <FetchInterceptor>
          <AuthProvider>
            <Box position='relative' minH='100vh' m='auto'>
              <Header />
              <Flex justify='center' px={5}>
                <Box maxWidth={theme.config.defaultContainerSize} width='100%'>
                  <Breadcrumbs />
                  <SkipNavContent />
                  <Outlet />
                </Box>
              </Flex>
              <Footer />
              <Portal zIndex={3}>
                <UnavailableAlert />
              </Portal>
            </Box>
          </AuthProvider>
        </FetchInterceptor>
      </ServiceStatusProvider>
    </div>
  );
}
