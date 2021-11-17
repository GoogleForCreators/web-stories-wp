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
import { action } from '@storybook/addon-actions';

/**
 * Internal dependencies
 */
import PostLockDialog from '../postLockDialog';

export default {
  title: 'Stories Editor/Components/Dialog/Post Lock Dialog',
  component: PostLockDialog,
};

export const _default = () => {
  const user = {
    name: 'Matt Mullenweg',
    avatar:
      'http://1.gravatar.com/avatar/767fc9c115a1b989744c755db47feb60?size=48',
  };
  const dashboardLink = 'http://www.example.com/dashboard';
  const previewLink = 'http://www.example.com/preview';
  return (
    <PostLockDialog
      user={user}
      isOpen
      dashboardLink={dashboardLink}
      previewLink={previewLink}
      onClose={action('closed')}
    />
  );
};
