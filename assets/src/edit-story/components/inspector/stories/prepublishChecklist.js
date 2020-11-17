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
            rotationAngle: 0,
            lockAspectRatio: true,
            scale: 100,
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
