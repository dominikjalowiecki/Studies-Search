import { useState, memo } from 'react';
import FsLightbox from 'fslightbox-react';
import img from '../assets/images/default-thumbnail.jpeg';
import ImageSlider from '../components/ImageSlider';
import { generateGoogleDriveURL } from '../utils';

export default memo(function PostImages({ images }) {
  const [lightboxController, setLightboxController] = useState({
    toggler: false,
    slide: 1,
  });

  function openLightboxOnSlide(number) {
    setLightboxController({
      toggler: !lightboxController.toggler,
      slide: number,
    });
  }

  const DEBUG = process.env.NODE_ENV === 'development';

  const corsImages = DEBUG
    ? images
    : images.map(
        (el) =>
          'https://corsproxy.io/?' +
          encodeURIComponent(
            el.indexOf('https://drive.google.com/uc?id=') !== -1
              ? generateGoogleDriveURL(el)
              : el
          )
      );

  return images.length !== 0 ? (
    <>
      <ImageSlider setToggler={openLightboxOnSlide} images={images} />
      <FsLightbox
        toggler={lightboxController.toggler}
        sources={corsImages}
        slide={lightboxController.slide}
      />
    </>
  ) : (
    <>
      <ImageSlider
        setToggler={openLightboxOnSlide}
        images={[img]}
        alt='Default thumbnail'
      />
      <FsLightbox
        toggler={lightboxController.toggler}
        sources={[img]}
        slide={lightboxController.slide}
      />
    </>
  );
});
