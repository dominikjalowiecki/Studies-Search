import { Image } from '@chakra-ui/react';
import { Carousel } from 'react-responsive-carousel';
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
              image.indexOf('&export=download') !== -1
                ? image.substring(0, image.indexOf('&export=download'))
                : image
            }
          />
        );
      })}
    </Carousel>
  );
};

export default ImageSlider;
