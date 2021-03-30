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
import PropTypes from 'prop-types';
import { AnimationProps } from '@web-stories-wp/animation';
import { StoryElementPropType } from '@web-stories-wp/elements';

export const StoryPagePropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  animations: PropTypes.arrayOf(PropTypes.shape(AnimationProps)),
  elements: PropTypes.arrayOf(StoryElementPropType),
  // See OverlayType in story-editor package.
  backgroundOverlay: PropTypes.oneOf(['none', 'solid', 'linear', 'radial']),
});

export const PageSizePropType = PropTypes.shape({
  width: PropTypes.number,
  height: PropTypes.number,
  containerHeight: PropTypes.number,
});
