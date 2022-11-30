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
 * Internal dependencies
 */
import PostLockDialog from '../postLockDialog';

export default {
  title: 'Stories Editor/Components/Dialog/Post Lock Dialog',
  component: PostLockDialog,
  args: {
    user: {
      name: 'Matt Mullenweg',
      avatar:
        'http://1.gravatar.com/avatar/767fc9c115a1b989744c755db47feb60?size=48',
    },
    dashboardLink: 'http://www.example.com/dashboard',
    previewLink: 'http://www.example.com/preview',
    isOpen: true,
  },
  argTypes: {
    onClose: { action: 'onClose' },
  },
};

export const _default = (args) => {
  return <PostLockDialog {...args} />;
};
