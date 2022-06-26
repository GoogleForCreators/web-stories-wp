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
// eslint-disable-next-line import/no-extraneous-dependencies -- Available via storybook itself.
import { useEffect } from 'react';

/**
 * Internal dependencies
 */
import { LOCAL_STORAGE_PREVIEW_MARKUP_KEY } from './constants';

export default {
  title: 'Playground/preview',
};

// This is a hidden story component ( hidden via manager-head.html ), used for previewing the story-editor. Please do not remove.
function Preview() {
  useEffect(() => {
    const content = window.localStorage.getItem(
      LOCAL_STORAGE_PREVIEW_MARKUP_KEY
    );

    if (content) {
      document.open();
      document.write(content);
      document.close();
    }
  }, []);

  return null;
}

export const _default = Preview;
