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
import App from '../../../assets/src/edit-story/app';

export default {
  title: 'Playground|Stories Editor',
};

// @todo: Find better way to mock these.
const config = {
  allowedVideoMimeTypes: ['video/mp4'],
  storyId: 1234,
  api: {
    stories: '',
    media: '',
    fonts: '',
  },
};

export const _default = () => {
  return <App config={config} />;
};
