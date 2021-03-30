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
import { action } from '@storybook/addon-actions';
import { text } from '@storybook/addon-knobs';

/**
 * Internal dependencies
 */
import PostPublishDialog from '../postPublishDialog';

export default {
  title: 'Stories Editor/Components/Dialog/Post-Publish',
  component: PostPublishDialog,
};

export const _default = () => {
  return (
    <PostPublishDialog
      open
      onClose={action('closed')}
      storyURL={text('Story URL', 'https://example.com')}
      confirmURL={text('Confirm URL', 'https://example.com')}
    />
  );
};
