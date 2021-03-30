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
import { PatternPropType } from '@web-stories-wp/patterns';
import { FontPropType } from '@web-stories-wp/fonts';
import { BACKGROUND_TEXT_MODE, MULTIPLE_VALUE } from '@web-stories-wp/elements';

const StoryElementPropTypes = {};

const StoryMediaPropTypes = {
  scale: PropTypes.number.isRequired,
  focalX: PropTypes.number,
  focalY: PropTypes.number,
};

export const PaddingPropType = PropTypes.shape({
  horizontal: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.oneOf([MULTIPLE_VALUE]),
  ]),
  vertical: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.oneOf([MULTIPLE_VALUE]),
  ]),
  locked: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.oneOf([MULTIPLE_VALUE]),
  ]),
});

const StoryTextElementPropTypes = {
  content: PropTypes.string,
  backgroundTextMode: PropTypes.oneOf(Object.values(BACKGROUND_TEXT_MODE)),
  backgroundColor: PatternPropType,
  font: FontPropType.isRequired,
  fontSize: PropTypes.number,
  lineHeight: PropTypes.number,
  padding: PaddingPropType,
  textAlign: PropTypes.string,
};

StoryElementPropTypes.textContent = PropTypes.shape({
  ...StoryTextElementPropTypes,
});

StoryElementPropTypes.image = PropTypes.shape({
  ...StoryElementPropTypes,
  ...StoryMediaPropTypes,
  resource: StoryElementPropTypes.imageResource,
});

StoryElementPropTypes.video = PropTypes.shape({
  ...StoryElementPropTypes,
  ...StoryMediaPropTypes,
  resource: StoryElementPropTypes.videoResource,
  poster: PropTypes.string,
  tracks: PropTypes.arrayOf(StoryElementPropTypes.trackResource),
  loop: PropTypes.bool,
});

StoryElementPropTypes.gif = PropTypes.shape({
  ...StoryElementPropTypes,
  ...StoryMediaPropTypes,
  resource: StoryElementPropTypes.gifResource,
});

StoryElementPropTypes.media = PropTypes.oneOfType([
  StoryElementPropTypes.image,
  StoryElementPropTypes.video,
  StoryElementPropTypes.gif,
]);

StoryElementPropTypes.text = PropTypes.shape({
  ...StoryElementPropTypes,
  ...StoryTextElementPropTypes,
});

StoryElementPropTypes.shape = PropTypes.shape({
  ...StoryElementPropTypes,
  backgroundColor: PatternPropType,
});

StoryElementPropTypes.sticker = PropTypes.shape({
  ...StoryElementPropTypes,
  sticker: PropTypes.shape({
    type: PropTypes.string.isRequired,
  }),
});

export { StoryElementPropTypes };
