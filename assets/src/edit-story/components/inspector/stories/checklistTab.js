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
import ChecklistTab from '../prepublish/checklistTab';
import { getPrepublishErrors } from '../../../app/prepublish';

const Container = styled.div`
  color: ${({ theme }) => theme.colors.fg.white};
  font-family: ${({ theme }) => theme.fonts.body1.family};
  width: 280px;
`;

export default {
  title: 'Stories Editor/Components/Checklist Tab',
  component: ChecklistTab,
  parameters: {
    backgrounds: {
      default: 'Dark',
    },
  },
  decorators: [
    (Story) => (
      <Container>
        <Story />
      </Container>
    ),
  ],
};

export const _default = () => {
  const testStory = {
    id: 120,
    pages: [{ id: 123, elements: [] }],
  };
  const checklist = getPrepublishErrors(testStory);
  return <ChecklistTab checklist={checklist} />;
};

export const withPages = () => {
  const testStory = {
    id: 120,
    excerpt: 'Test',
    pages: [
      {
        id: 921,
        elements: [
          {
            id: 891,
            type: 'text',
            fontSize: 11,
            content:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
          },
        ],
      },
      {
        id: 456,
        elements: [
          {
            id: 123,
            type: 'image',
            height: 50,
            width: 50,
            x: 0,
            y: 0,
          },
        ],
      },
    ],
  };
  const checklist = getPrepublishErrors(testStory);
  return <ChecklistTab checklist={checklist} />;
};

export const recommendedOnly = () => {
  const checklist = [
    {
      message: 'Font size too small',
      elementId: 891,
      type: 'warning',
      pageId: 921,
      page: 1,
    },
    {
      message: 'Too much text on page',
      pageId: 921,
      type: 'guidance',
      page: 2,
    },
    {
      type: 'guidance',
      elementId: 123,
      message: 'Image is too small on the page',
      pageId: 456,
      page: 2,
    },
  ];
  return <ChecklistTab checklist={checklist} />;
};

export const emptyChecklist = () => {
  return <ChecklistTab checklist={[]} />;
};
