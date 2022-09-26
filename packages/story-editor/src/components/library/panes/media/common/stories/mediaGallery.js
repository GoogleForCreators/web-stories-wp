/*
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * External dependencies
 */
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import MediaGallery from '../mediaGallery';
import { CanvasProvider } from '../../../../../../app/canvas';
import { LayoutProvider } from '../../../../../../app/layout';
import { noop } from '../../../../../../utils/noop';

import MediaContext from '../../../../../../app/media/context';

export default {
  title: 'Stories Editor/Components/Media Gallery',
  component: MediaGallery,
  argTypes: {
    onInsert: { action: 'selected' },
  },
};

const resources = [
  {
    id: 1,
    type: 'image',
    alt: 'image alt',
    mimeType: 'image/jpeg',
    baseColor: '#ffffff',
    width: 18,
    height: 12,
    src: 'https://img.webmd.com/dtmcms/live/webmd/consumer_assets/site_images/article_thumbnails/slideshows/how_to_brush_dogs_teeth_slideshow/1800x1200_how_to_brush_dogs_teeth_slideshow.jpg',
  },
  {
    id: 2,
    type: 'image',
    alt: 'image alt',
    mimeType: 'image/jpeg',
    baseColor: '#ffffff',
    width: 128,
    height: 72,
    src: 'https://www.sciencemag.org/sites/default/files/styles/article_main_large/public/dogs_1280p_0.jpg?itok=cnRk0HYq',
  },
  {
    id: 3,
    type: 'image',
    alt: 'image alt',
    mimeType: 'image/jpeg',
    baseColor: '#ffffff',
    width: 110,
    height: 62,
    src: 'https://post.medicalnewstoday.com/wp-content/uploads/sites/3/2020/02/322868_1100-1100x628.jpg',
  },
  {
    id: 4,
    type: 'image',
    alt: 'image alt',
    mimeType: 'image/jpeg',
    baseColor: '#ffffff',
    width: 79,
    height: 59,
    src: 'https://www.abc.net.au/cm/rimage/11779952-4x3-xlarge.jpg?v=3',
  },
  {
    id: 5,
    type: 'image',
    alt: 'image alt',
    mimeType: 'image/jpeg',
    baseColor: '#ffffff',
    width: 18,
    height: 12,
    src: 'https://img.webmd.com/dtmcms/live/webmd/consumer_assets/site_images/article_thumbnails/slideshows/how_to_brush_dogs_teeth_slideshow/1800x1200_how_to_brush_dogs_teeth_slideshow.jpg',
  },
  {
    id: 6,
    type: 'image',
    alt: 'image alt',
    mimeType: 'image/jpeg',
    baseColor: '#ffffff',
    width: 218,
    height: 278,
    src: 'https://i0.wp.com/rollinsps.vic.edu.au/wp-content/uploads/2018/11/IMG_0451.jpg',
  },
  {
    id: 7,
    type: 'image',
    alt: 'image alt',
    mimeType: 'image/jpeg',
    baseColor: '#ffffff',
    width: 1100,
    height: 825,
    src: 'https://i.insider.com/5d2e0e30a17d6c5cfd30be94?width=1100&format=jpeg&auto=webp',
  },
  {
    id: 8,
    type: 'image',
    alt: 'image alt',
    mimeType: 'image/jpeg',
    baseColor: '#ffffff',
    width: 591,
    height: 555,
    src: 'https://www.dogsnsw.org.au/media/1007/breeding-dogs.jpg',
  },
  {
    id: 9,
    type: 'image',
    alt: 'image alt',
    mimeType: 'image/jpeg',
    baseColor: '#ffffff',
    width: 640,
    height: 635,
    src: 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/golden-retriever-royalty-free-image-506756303-1560962726.jpg?crop=0.672xw:1.00xh;0.166xw,0&resize=640:*',
  },
  {
    id: 10,
    type: 'image',
    alt: 'image alt',
    mimeType: 'image/jpeg',
    baseColor: '#ffffff',
    width: 1100,
    height: 825,
    src: 'https://i.insider.com/5d2e0e30a17d6c5cfd30be94?width=1100&format=jpeg&auto=webp',
  },
  {
    id: 11,
    type: 'image',
    alt: 'image alt',
    mimeType: 'image/jpeg',
    baseColor: '#ffffff',
    width: 18,
    height: 12,
    src: 'https://img.webmd.com/dtmcms/live/webmd/consumer_assets/site_images/article_thumbnails/slideshows/how_to_brush_dogs_teeth_slideshow/1800x1200_how_to_brush_dogs_teeth_slideshow.jpg',
  },
  {
    id: 12,
    type: 'image',
    alt: 'image alt',
    mimeType: 'image/jpeg',
    baseColor: '#ffffff',
    width: 320,
    height: 400,
    src: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Declassified_image_of_Conan%2C_the_dog_who_chased_al-Baghdadi.jpg',
  },
  {
    id: 13,
    type: 'image',
    alt: 'image alt',
    mimeType: 'image/jpeg',
    baseColor: '#ffffff',
    width: 1100,
    height: 825,
    src: 'https://i.insider.com/5d2e0e30a17d6c5cfd30be94?width=1100&format=jpeg&auto=webp',
  },
  {
    id: 14,
    type: 'image',
    alt: 'image alt',
    mimeType: 'image/jpeg',
    baseColor: '#ffffff',
    width: 480,
    height: 720,
    src: 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/bernese-mountain-dog-royalty-free-image-1581013857.jpg?crop=0.87845xw:1xh;center,top&resize=480:*',
  },
  {
    id: 15,
    type: 'image',
    alt: 'image alt',
    mimeType: 'image/jpeg',
    baseColor: '#ffffff',
    width: 640,
    height: 640,
    src: 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/smartest-dog-breeds-lead-1587757081.jpg?crop=1.00xw:1.00xh;0,0&resize=640:*',
  },
  {
    id: 16,
    type: 'image',
    alt: 'image alt',
    mimeType: 'image/jpeg',
    baseColor: '#ffffff',
    width: 320,
    height: 400,
    src: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Declassified_image_of_Conan%2C_the_dog_who_chased_al-Baghdadi.jpg',
  },
  {
    id: 17,
    type: 'image',
    alt: 'image alt',
    mimeType: 'image/jpeg',
    baseColor: '#ffffff',
    width: 591,
    height: 555,
    src: 'https://www.dogsnsw.org.au/media/1007/breeding-dogs.jpg',
  },
  {
    id: 18,
    type: 'image',
    alt: 'image alt',
    mimeType: 'image/jpeg',
    baseColor: '#ffffff',
    width: 640,
    height: 635,
    src: 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/golden-retriever-royalty-free-image-506756303-1560962726.jpg?crop=0.672xw:1.00xh;0.166xw,0&resize=640:*',
  },
  {
    id: 19,
    type: 'image',
    alt: 'image alt',
    mimeType: 'image/jpeg',
    baseColor: '#ffffff',
    width: 1100,
    height: 825,
    src: 'https://i.insider.com/5d2e0e30a17d6c5cfd30be94?width=1100&format=jpeg&auto=webp',
  },
  {
    id: 20,
    type: 'image',
    alt: 'image alt',
    mimeType: 'image/jpeg',
    baseColor: '#ffffff',
    width: 18,
    height: 12,
    src: 'https://img.webmd.com/dtmcms/live/webmd/consumer_assets/site_images/article_thumbnails/slideshows/how_to_brush_dogs_teeth_slideshow/1800x1200_how_to_brush_dogs_teeth_slideshow.jpg',
  },
  {
    id: 21,
    type: 'image',
    alt: 'image alt',
    mimeType: 'image/jpeg',
    baseColor: '#ffffff',
    width: 320,
    height: 400,
    src: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Declassified_image_of_Conan%2C_the_dog_who_chased_al-Baghdadi.jpg',
  },
  {
    id: 22,
    type: 'image',
    alt: 'image alt',
    mimeType: 'image/jpeg',
    baseColor: '#ffffff',
    width: 1100,
    height: 825,
    src: 'https://i.insider.com/5d2e0e30a17d6c5cfd30be94?width=1100&format=jpeg&auto=webp',
  },
  {
    id: 23,
    type: 'image',
    alt: 'image alt',
    mimeType: 'image/jpeg',
    baseColor: '#ffffff',
    width: 480,
    height: 720,
    src: 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/bernese-mountain-dog-royalty-free-image-1581013857.jpg?crop=0.87845xw:1xh;center,top&resize=480:*',
  },
  {
    id: 24,
    type: 'image',
    alt: 'image alt',
    mimeType: 'image/jpeg',
    baseColor: '#ffffff',
    width: 640,
    height: 640,
    src: 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/smartest-dog-breeds-lead-1587757081.jpg?crop=1.00xw:1.00xh;0,0&resize=640:*',
  },
  {
    id: 25,
    type: 'image',
    alt: 'image alt',
    mimeType: 'image/jpeg',
    baseColor: '#ffffff',
    width: 320,
    height: 400,
    src: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Declassified_image_of_Conan%2C_the_dog_who_chased_al-Baghdadi.jpg',
  },
];

const Container = styled.div`
  width: 300px;
`;

export const _default = (args) => {
  const mediaValue = {
    local: {
      state: {
        isCurrentResourceProcessing: () => false,
        isCurrentResourceUploading: () => false,
      },
      actions: {
        uploadMedia: noop,
      },
    },
  };

  return (
    <Container>
      <MediaContext.Provider value={mediaValue}>
        <LayoutProvider>
          <CanvasProvider>
            <MediaGallery
              resources={resources}
              providerType={'unsplash'}
              {...args}
            />
          </CanvasProvider>
        </LayoutProvider>
      </MediaContext.Provider>
    </Container>
  );
};
