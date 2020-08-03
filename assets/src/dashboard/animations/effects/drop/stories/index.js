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
import { AMPStoryWrapper } from '../../../../storybookUtils';

export default {
  title: 'Animations/Effects/Drop',
};

const redSquareStyles = {
  backgroundColor: 'red',
  height: '50px',
  width: '50px',
  top: 'calc(100% - 50px)',
  left: 'calc(50% - 25px)',
  position: 'absolute',
};

export const _default = () => (
  <AMPStoryWrapper>
    <amp-story-page id="page-1">
      <amp-story-grid-layer template="vertical">
        <div animate-in="drop" style={redSquareStyles} />
      </amp-story-grid-layer>
    </amp-story-page>
    <amp-story-page id="page-2">
      <amp-story-grid-layer template="vertical">
        <div animate-in="drop" style={redSquareStyles} />
      </amp-story-grid-layer>
    </amp-story-page>
  </AMPStoryWrapper>
);
