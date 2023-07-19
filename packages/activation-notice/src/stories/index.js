/*
 * Copyright 2022 Google LLC
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
import App from '../app';

export default {
  title: 'WordPress/Plugin Activation',
  args: {
    cdnURL: 'https://wp.stories.google/static/main/',
    demoStoryURL: 'https://example:com',
    dashboardURL: 'https://example:com',
    isRTL: false,
  },
};

// TODO (#10380): Support RTL using something like @pxblue/storybook-rtl-addon;
export const _default = {
  render: function Render(args) {
    return <App config={args} {...args} />;
  },
};
