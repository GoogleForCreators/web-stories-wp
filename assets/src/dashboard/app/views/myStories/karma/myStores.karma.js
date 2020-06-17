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
import { render } from '@testing-library/react';
import { FlagsProvider } from 'flagged';

/**
 * Internal dependencies
 */
import App from '../../../../app';

const config = {
  isRTL: false,
  newStoryURL:
    'http://localhost:8899/wp-admin/post-new.php?post_type=web-story',
  editStoryURL: 'http://localhost:8899/wp-admin/post.php?action=edit',
  wpListURL: 'http://localhost:8899/wp-admin/edit.php?post_type=web-story',
  assetsURL: 'http://localhost:8899/wp-content/plugins/web-stories//assets',
  version: '1.0.0-alpha.9',
  api: {
    stories: '/wp/v2/web-story',
    users: '/wp/v2/users',
    fonts: '/web-stories/v1/fonts',
  },
};

describe('My Stories View', () => {
  it('should render', () => {
    const root = document.querySelector('test-root');
    render(
      <FlagsProvider features={{}}>
        <App key={Math.random()} config={config} />
      </FlagsProvider>,
      { container: root }
    );
  });
});
