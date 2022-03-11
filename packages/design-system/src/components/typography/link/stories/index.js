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
 * Internal dependencies
 */
import { Link } from '..';
import { THEME_CONSTANTS } from '../../../..';

export default {
  title: 'DesignSystem/Components/Typography/Link',
  component: Link,
};

const textPresetSizes = THEME_CONSTANTS.TYPOGRAPHY.TEXT_SIZES;

export const _default = () => (
  <>
    {textPresetSizes.map((presetSize) => (
      <Link
        key={`${presetSize}_text_link`}
        size={presetSize}
        href="https://example.com"
      >
        {`${presetSize} - Click here for more information`}
        <br />
      </Link>
    ))}
  </>
);

export const ExternalLink = () => (
  <Link href="https://example.com" target="_blank">
    {`Support`}
  </Link>
);
