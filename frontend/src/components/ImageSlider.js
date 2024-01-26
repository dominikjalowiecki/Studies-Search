import { Image } from '@chakra-ui/react';
import { Carousel } from 'react-responsive-carousel';
import { generateGoogleDriveURL } from '../utils';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import '../style.css';

const ImageSlider = ({ setToggler, images }) => {
  return (
    <Carousel
      onClick
      infiniteLoop
      width='100%'
      dynamicHeight={true}
      showStatus={false}
      onClickItem={(idx, item) => {
        setToggler(idx + 1);
      }}
      renderThumbs={(items) => {
        return items;
      }}
    >
      {images.map((image, idx) => {
        return (
          <Image
            key={idx}
            src={
              image.indexOf('https://drive.google.com/uc?id=') !== -1
                ? generateGoogleDriveURL(image)
                : image
            }
          />
        );
      })}
    </Carousel>
  );
};

export default ImageSlider;
