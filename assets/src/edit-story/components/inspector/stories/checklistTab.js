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

const Container = styled.div`
  background: ${({ theme }) => theme.colors.bg.primary};
  color: ${({ theme }) => theme.DEPRECATED_THEME.colors.fg.white};
  font-family: ${({ theme }) => theme.DEPRECATED_THEME.fonts.body1.family};
  width: 280px;
`;

export default {
  title: 'Stories Editor/Components/Checklist Tab',
  component: ChecklistTab,
  decorators: [
    (Story) => (
      <Container>
        <Story />
      </Container>
    ),
  ],
};

export const _default = () => {
  const defaultChecklist = [
    {
      type: 'error',
      storyId: 120,
      message: 'Missing poster image',
      help:
        'Used as the poster image for the Story and is representative of the story. Should not have the Story title pre-embedded on it or any other burned-in text. Should be at least 640x853px in size and maintain a 3:4 aspect ratio.',
    },
    {
      type: 'error',
      storyId: 120,
      message: 'Missing story title',
      help:
        'Keep the title clear and clean, ideally under 10 words in less than 40 characters.',
    },
    {
      message: 'Missing Story Description',
      help: 'Add a Story Description in the Document panel.',
      storyId: 120,
      type: 'warning',
    },
    {
      type: 'guidance',
      storyId: 120,
      message: 'Story too short',
      help: 'Use between 4 and 30 pages in your story.',
    },
    {
      storyId: 120,
      type: 'guidance',
      message: 'Too little text',
      help:
        'The entire story should have a minimum of 100 characters of text in total.',
    },
  ];
  return <ChecklistTab checklist={defaultChecklist} />;
};

export const withPages = () => {
  const checklist = [
    {
      type: 'error',
      storyId: 120,
      message: 'Missing poster image',
      help:
        'Used as the poster image for the Story and is representative of the story. Should not have the Story title pre-embedded on it or any other burned-in text. Should be at least 640x853px in size and maintain a 3:4 aspect ratio.',
    },
    {
      type: 'error',
      storyId: 120,
      message: 'Missing story title',
      help:
        'Keep the title clear and clean, ideally under 10 words in less than 40 characters.',
    },
    {
      message: 'Font size too small',
      help: 'Text should have size 12 or larger.',
      elementId: 891,
      type: 'warning',
      page: 1,
      pageId: 921,
    },
    {
      message: 'Image missing description',
      help:
        'Add meaningful assistive text to images to optimize accessibility and indexability.',
      elementId: 123,
      type: 'warning',
      page: 2,
      pageId: 456,
    },
    {
      type: 'guidance',
      storyId: 120,
      message: 'Story too short',
      help: 'Use between 4 and 30 pages in your story.',
    },
    {
      pageId: 921,
      elements: [
        {
          id: 891,
          type: 'text',
          fontSize: 11,
          content:
            '<span>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</span>',
        },
      ],
      type: 'guidance',
      message: 'Too much text on page',
      help:
        'Keep text to max 200 characters per page. Consider using a page attachment, breaking up the text into multiple screens, or keeping the total number of pages with a lot of text to less than 10% of the pages in the story.',
      page: 1,
    },
    {
      type: 'guidance',
      elementId: 123,
      message: 'Video or image too small on the page',
      help:
        'Use full screen videos and images where possible to keep to an immersive feeling. <a>(more info)</a>',

      page: 2,
      pageId: 456,
    },
  ];
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
