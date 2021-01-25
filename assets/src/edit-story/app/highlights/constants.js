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
import { css } from 'styled-components';

const ANIMATION = `
  opacity: 1;
  animation: flash 1s ease-in-out 4;
`;
const KEYFRAMES = `
  @keyframes flash {
    50% {
      opacity: 0;
    }
  }
`;

const OUTLINE = css`
  box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.accent.primary};
`;

const HIGHLIGHT_ELEMENT = `&:focus-within::after`;

const container = css`
  position: relative;
  ${HIGHLIGHT_ELEMENT} {
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    content: '';
    pointer-events: none;
    ${OUTLINE}
    ${ANIMATION}
  }
  ${KEYFRAMES}
`;

const defaultBehavior = {
  focusContainerCss: container,
  focusContainerSelector: HIGHLIGHT_ELEMENT,
  animation: css`
    ${OUTLINE}
    ${ANIMATION}
  `,
  keyframes: KEYFRAMES,
};

const STORY_TITLE = 'STORY_TITLE';
const COVER = 'COVER';
const PUBLISHER_LOGO = 'PUBLISHER_LOGO';
const EXCERPT = 'EXCERPT';
const CAPTIONS = 'CAPTIONS';
const ASSISTIVE_TEXT = 'ASSISTIVE_TEXT';

export const STATES = {
  [STORY_TITLE]: {
    storyTitle: defaultBehavior,
  },
  [COVER]: {
    cover: defaultBehavior,
    tab: 'document',
  },
  [PUBLISHER_LOGO]: {
    publisherLogo: defaultBehavior,
    tab: 'document',
  },
  [EXCERPT]: {
    excerpt: defaultBehavior,
    tab: 'document',
  },
  [CAPTIONS]: {
    captions: defaultBehavior,
    tab: 'design',
  },
  [ASSISTIVE_TEXT]: {
    assistiveText: defaultBehavior,
    tab: 'design',
  },
};
