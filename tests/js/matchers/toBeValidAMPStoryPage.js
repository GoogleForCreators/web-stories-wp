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
import toBeValidAMP from './toBeValidAMP';

// eslint-disable-next-line react/prop-types
function WrapPage({ children }) {
  return (
    <amp-story
      standalone="standalone"
      publisher="Example Publisher"
      publisher-logo-src="https://example.com/publisher.png"
      title="Example Story"
      poster-portrait-src="https://example.com/poster.png"
    >
      {children}
    </amp-story>
  );
}

// eslint-disable-next-line require-await
async function toBeValidAMPStoryPage(stringOrComponent) {
  return toBeValidAMP(<WrapPage>{stringOrComponent}</WrapPage>);
}

export default toBeValidAMPStoryPage;
