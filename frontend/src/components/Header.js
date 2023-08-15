import { Link as RouterLink } from 'react-router-dom';
import React, { useEffect } from 'react';
import { useTime, Clock } from '../utils/clock';
import {
  Text,
  Flex,
  Box,
  Link,
  Button,
  Switch,
  HStack,
  useColorMode,
  useDisclosure,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Grid,
  GridItem,
  VisuallyHidden,
  Divider,
} from '@chakra-ui/react';
import { HamburgerIcon, SunIcon, MoonIcon } from '@chakra-ui/icons';
import { SkipNavLink } from '@chakra-ui/skip-nav';
import NavigationList from './NavigationList';
import theme from '../themes/theme';

const HeaderAddon = () => {
  const now = useTime();

  return (
    <HStack>
      <Clock time={now} />
    </HStack>
  );
};

export default function Header() {
  const { colorMode, toggleColorMode } = useColorMode();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const btnRef = React.useRef();

  useEffect(() => {
    let mediaQuery = window.matchMedia('(max-width: 768px)');
    mediaQuery.addEventListener('change', onClose);

    return () => mediaQuery.removeEventListener('change', onClose);
  }, []);

  const DarkModeToggle = () => (
    <Box>
      <Text>
        <SunIcon />{' '}
        <Switch
          onChange={toggleColorMode}
          isChecked={colorMode === 'dark' ? true : false}
        />{' '}
        <MoonIcon />
      </Text>
    </Box>
  );

  return (
    <>
      <Flex
        justifyContent={'center'}
        bgColor='teal.700'
        borderColor='blackAlpha.200'
        px={5}
        color='white'
      >
        <SkipNavLink color='black'>Skip to content</SkipNavLink>
        <Grid
          templateColumns={'repeat(3, 1fr)'}
          width={theme.config.defaultContainerSize}
          height={'80px'}
        >
          <GridItem
            display='flex'
            alignItems={'center'}
            colSpan={{ base: 2, md: 1 }}
          >
            <Text as='h1' fontWeight={'bold'}>
              <Link as={RouterLink} to='/' fontSize='24'>
                Studies Search
              </Link>
            </Text>
          </GridItem>
          <GridItem
            display='flex'
            alignItems={'center'}
            justifyContent={'end'}
            colSpan={{ base: 1, md: 2 }}
          >
            <Flex as='header' display={['none', 'none', 'flex', 'flex']}>
              <HStack spacing='5'>
                <HeaderAddon />
                <DarkModeToggle />
                <NavigationList />
              </HStack>
            </Flex>
            <Button
              ref={btnRef}
              colorScheme='teal'
              onClick={onOpen}
              display={['flex', 'flex', 'none', 'none']}
            >
              <VisuallyHidden>Toggle menu</VisuallyHidden>
              <HamburgerIcon />
            </Button>
            <Drawer
              isOpen={isOpen}
              placement='right'
              onClose={onClose}
              finalFocusRef={btnRef}
            >
              <DrawerOverlay />
              <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>Menu</DrawerHeader>
                <DrawerBody>
                  <NavigationList isVertical={true} closeMenu={onClose} />
                  <Divider my={3} />
                  <HeaderAddon />
                  <Divider my={3} />
                  <DarkModeToggle />
                </DrawerBody>
              </DrawerContent>
            </Drawer>
          </GridItem>
        </Grid>
      </Flex>
    </>
  );
}
