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

const FLASH_KEYFRAMES = `
@keyframes flash {
  50% {
    opacity: 50%;
  }
}
`;

const FLASH_ANIMATION = `
  animation: flash 0.25s ease-out 3;
`;

export const panelRowStyles = css`
  position: relative;
  &:after {
    display: block;
    position: absolute;
    top: -10px;
    right: -10px;
    bottom: -10px;
    left: -10px;
    content: '';
    background-color: ${({ theme }) => theme.colors.callout};
    opacity: 0;
    pointer-events: none;
    ${FLASH_ANIMATION}
  }
  ${FLASH_KEYFRAMES}
`;

const defaultBehavior = { css: panelRowStyles };

export const INPUTS = {
  storyTitle: { ...defaultBehavior, focus: true },
  pageMenu: defaultBehavior,
  document: {
    publisherLogo: defaultBehavior,
    cover: defaultBehavior,
    excerpt: { ...defaultBehavior, focus: true },
  },
  design: {
    captions: defaultBehavior,
    assistiveText: {
      ...defaultBehavior,
      focus: true,
    },
  },
  tab: {
    text: defaultBehavior,
  },
};
