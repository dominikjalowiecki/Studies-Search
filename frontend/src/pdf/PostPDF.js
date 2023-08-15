import React from 'react';
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Link,
  Font,
  Image,
} from '@react-pdf/renderer';
import img from '../assets/images/default-thumbnail.jpeg';

Font.register({
  family: 'Roboto',
  src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf',
});

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    fontFamily: 'Roboto',
    fontSize: '16px',
  },
  section: {
    margin: 10,
    padding: 10,
    lineHeight: 1.5,
  },
});

const DEBUG = process.env.NODE_ENV === 'development';

const PostPDF = ({
  post: {
    images: [image],
    name,
    description,
    school,
    city,
    courses,
    hyperlink,
    modificated_by,
  },
}) => (
  <Document
    title={name}
    author={modificated_by.username}
    creator={'Studies Search'}
  >
    <Page size='A4' style={styles.page}>
      <View style={styles.section}>
        <Image
          style={{ width: '275px', marginBottom: '20px' }}
          src={
            image
              ? DEBUG
                ? image
                : 'https://corsproxy.io/?' +
                  encodeURIComponent(
                    image.indexOf('&export=download') !== -1
                      ? image.substring(0, image.indexOf('&export=download'))
                      : image
                  )
              : img
          }
        />
        <Text>Name: {name}</Text>
        <Text>Description: {description}</Text>
        <Text>City: {city}</Text>
        <Text>School: {school}</Text>
        <Text>
          Courses:{' '}
          {courses.map(
            (el, idx, arr) => el + (idx < arr.length - 1 ? ', ' : '')
          )}
        </Text>
        <Text>
          Hyperlink: <Link src={hyperlink}>{hyperlink}</Link>
        </Text>
        <Text
          style={{ textAlign: 'center', fontSize: '14px', marginTop: '20px' }}
        >
          Studies Search - Dominik Jałowiecki 2023
        </Text>
      </View>
    </Page>
  </Document>
);

export default PostPDF;
