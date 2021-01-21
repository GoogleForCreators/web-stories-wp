/*
 * Copyright 2021 Google LLC
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

export const mq = {
  desktop: (styles) => css`
    @media screen and (min-width: 1121px) {
      ${styles}
    }
  `,
  tablet: (styles) => css`
    @media screen and (min-width: 801px) {
      ${styles}
    }
  `,
  mobile: (styles) => css`
    @media screen and (max-width: 800px) {
      ${styles}
    }
  `,
  mobileSmall: (styles) => css`
    @media screen and (max-width: 684px) {
      ${styles}
    }
  `,
  min: (styles) => css`
    @media screen and (max-width: 440px) {
      ${styles}
    }
  `,
};
