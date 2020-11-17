/*
 * Copyright 2020 Google LLC
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
import PrepublishChecklist from '../prepublish/checklistTab';
import check from '../../../app/prepublish';
import formattedStoriesArray from '../../../../dashboard/dataUtils/formattedStoriesArray';

export default {
  title: 'Stories Editor/Components/Prepublish Checklist',
  component: PrepublishChecklist,
};

const Container = styled.div`
  color: ${({ theme }) => theme.colors.fg.white};
  font-family: ${({ theme }) => theme.fonts.body1.family};
  width: 280px;
`;

export const _default = () => {
  const pages = {
    pages: [
      {
        elements: [
          {
            resource: {
              type: 'image',
              mimeType: 'image/jpeg',
              creationDate: '2020-11-16T20:12:08',
              src:
                'http://localhost:8899/wp-content/uploads/2020/11/example-2-39.jpg',
              width: 330,
              height: 220,
              posterId: 0,
              id: 512,
              title: 'example-2',
              alt: 'example-2',
              local: false,
              sizes: {
                medium: {
                  file: 'example-2-39-300x200.jpg',
                  width: 300,
                  height: 200,
                  mime_type: 'image/jpeg',
                  source_url:
                    'http://localhost:8899/wp-content/uploads/2020/11/example-2-39-300x200.jpg',
                },
                large: {
                  file: 'example-2-39-1024x683.jpg',
                  width: 1024,
                  height: 683,
                  mime_type: 'image/jpeg',
                  source_url:
                    'http://localhost:8899/wp-content/uploads/2020/11/example-2-39-1024x683.jpg',
                },
                thumbnail: {
                  file: 'example-2-39-150x150.jpg',
                  width: 150,
                  height: 150,
                  mime_type: 'image/jpeg',
                  source_url:
                    'http://localhost:8899/wp-content/uploads/2020/11/example-2-39-150x150.jpg',
                },
                medium_large: {
                  file: 'example-2-39-768x512.jpg',
                  width: 768,
                  height: 512,
                  mime_type: 'image/jpeg',
                  source_url:
                    'http://localhost:8899/wp-content/uploads/2020/11/example-2-39-768x512.jpg',
                },
                '1536x1536': {
                  file: 'example-2-39-1536x1024.jpg',
                  width: 1536,
                  height: 1024,
                  mime_type: 'image/jpeg',
                  source_url:
                    'http://localhost:8899/wp-content/uploads/2020/11/example-2-39-1536x1024.jpg',
                },
                'post-thumbnail': {
                  file: 'example-2-39-1200x800.jpg',
                  width: 1200,
                  height: 800,
                  mime_type: 'image/jpeg',
                  source_url:
                    'http://localhost:8899/wp-content/uploads/2020/11/example-2-39-1200x800.jpg',
                },
                'web-stories-poster-portrait': {
                  file: 'example-2-39-640x853.jpg',
                  width: 640,
                  height: 853,
                  mime_type: 'image/jpeg',
                  source_url:
                    'http://localhost:8899/wp-content/uploads/2020/11/example-2-39-640x853.jpg',
                },
                'web-stories-poster-landscape': {
                  file: 'example-2-39-853x640.jpg',
                  width: 853,
                  height: 640,
                  mime_type: 'image/jpeg',
                  source_url:
                    'http://localhost:8899/wp-content/uploads/2020/11/example-2-39-853x640.jpg',
                },
                'web-stories-poster-square': {
                  file: 'example-2-39-640x640.jpg',
                  width: 640,
                  height: 640,
                  mime_type: 'image/jpeg',
                  source_url:
                    'http://localhost:8899/wp-content/uploads/2020/11/example-2-39-640x640.jpg',
                },
                'web-stories-publisher-logo': {
                  file: 'example-2-39-96x96.jpg',
                  width: 96,
                  height: 96,
                  mime_type: 'image/jpeg',
                  source_url:
                    'http://localhost:8899/wp-content/uploads/2020/11/example-2-39-96x96.jpg',
                },
                'web-stories-thumbnail': {
                  file: 'example-2-39-150x100.jpg',
                  width: 150,
                  height: 100,
                  mime_type: 'image/jpeg',
                  source_url:
                    'http://localhost:8899/wp-content/uploads/2020/11/example-2-39-150x100.jpg',
                },
                full: {
                  file: 'example-2-39.jpg',
                  width: 1920,
                  height: 1280,
                  mime_type: 'image/jpeg',
                  source_url:
                    'http://localhost:8899/wp-content/uploads/2020/11/example-2-39.jpg',
                },
              },
              baseColor: [49, 73, 71],
            },
            type: 'image',
            x: 48,
            y: 0,
            width: 330,
            height: 220,
            id: '202e06dd-f5ba-49a5-b31f-a007905a0ecb',
          },
          {
            opacity: 100,
            flip: {
              vertical: false,
              horizontal: false,
            },
            rotationAngle: 0,
            lockAspectRatio: true,
            scale: 100,
            focalX: 50,
            focalY: 50,
            resource: {
              type: 'image',
              mimeType: 'image/png',
              creationDate: '2020-11-13T18:33:40',
              src: 'http://localhost:8899/wp-content/uploads/2020/11/image.png',
              width: 330,
              height: 350,
              posterId: 0,
              id: 508,
              title: 'image',
              alt: 'image',
              local: false,
              sizes: {
                medium: {
                  file: 'image-283x300.png',
                  width: 283,
                  height: 300,
                  mime_type: 'image/png',
                  source_url:
                    'http://localhost:8899/wp-content/uploads/2020/11/image-283x300.png',
                },
                thumbnail: {
                  file: 'image-150x150.png',
                  width: 150,
                  height: 150,
                  mime_type: 'image/png',
                  source_url:
                    'http://localhost:8899/wp-content/uploads/2020/11/image-150x150.png',
                },
                medium_large: {
                  file: 'image-768x814.png',
                  width: 768,
                  height: 814,
                  mime_type: 'image/png',
                  source_url:
                    'http://localhost:8899/wp-content/uploads/2020/11/image-768x814.png',
                },
                'web-stories-poster-portrait': {
                  file: 'image-640x853.png',
                  width: 640,
                  height: 853,
                  mime_type: 'image/png',
                  source_url:
                    'http://localhost:8899/wp-content/uploads/2020/11/image-640x853.png',
                },
                'web-stories-poster-landscape': {
                  file: 'image-853x640.png',
                  width: 853,
                  height: 640,
                  mime_type: 'image/png',
                  source_url:
                    'http://localhost:8899/wp-content/uploads/2020/11/image-853x640.png',
                },
                'web-stories-poster-square': {
                  file: 'image-640x640.png',
                  width: 640,
                  height: 640,
                  mime_type: 'image/png',
                  source_url:
                    'http://localhost:8899/wp-content/uploads/2020/11/image-640x640.png',
                },
                'web-stories-publisher-logo': {
                  file: 'image-96x96.png',
                  width: 96,
                  height: 96,
                  mime_type: 'image/png',
                  source_url:
                    'http://localhost:8899/wp-content/uploads/2020/11/image-96x96.png',
                },
                'web-stories-thumbnail': {
                  file: 'image-150x159.png',
                  width: 150,
                  height: 159,
                  mime_type: 'image/png',
                  source_url:
                    'http://localhost:8899/wp-content/uploads/2020/11/image-150x159.png',
                },
                full: {
                  file: 'image.png',
                  width: 892,
                  height: 946,
                  mime_type: 'image/png',
                  source_url:
                    'http://localhost:8899/wp-content/uploads/2020/11/image.png',
                },
              },
              baseColor: [131, 90, 56],
            },
            type: 'image',
            x: -27,
            y: 131,
            width: 530,
            height: 562,
            mask: {
              type: 'rectangle',
              showInLibrary: true,
              name: 'Rectangle',
              path: 'M 0,0 1,0 1,1 0,1 0,0 Z',
              ratio: 1,
              supportsBorder: true,
            },
            id: 'd8ac1103-b60f-4827-a557-1161dbcaae36',
          },
        ],
        type: 'page',
        id: '2a9a55d6-e6a1-4efa-bd92-59cc1d27a1da',
      },
    ],
  };
  const checklist = check({ ...formattedStoriesArray[0], ...pages });
  return (
    <Container>
      <PrepublishChecklist checklist={checklist} />
    </Container>
  );
};

_default.parameters = {
  backgrounds: {
    default: 'Dark',
  },
};
