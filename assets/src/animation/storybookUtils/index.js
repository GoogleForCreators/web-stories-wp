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
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { PAGE_HEIGHT, PAGE_WIDTH } from '../../edit-story/constants';
import Boilerplate from '../../edit-story/output/utils/ampBoilerplate';
import CustomCSS from '../../edit-story/output/utils/styles';
import { useStoryAnimationContext } from '../components';

export const AMP_STORY_ASPECT_RATIO = `${PAGE_WIDTH}:${PAGE_HEIGHT}`;

export function AMPStoryWrapper({ children }) {
  return (
    <div style={{ width: '100%', height: '640px' }}>
      <Boilerplate />
      <CustomCSS />
      <amp-story
        standalone
        title="My Story"
        publisher="The AMP Team"
        publisher-logo-src="https://example.com/logo/1x1.png"
        poster-portrait-src="https://example.com/my-story/poster/3x4.jpg"
      >
        {children}
      </amp-story>
    </div>
  );
}

AMPStoryWrapper.propTypes = {
  children: PropTypes.node,
};

export const PlayButton = () => {
  const {
    actions: { WAAPIAnimationMethods },
  } = useStoryAnimationContext();

  const label = {
    play: 'play',
    pause: 'pause',
    reset: 'reset',
  };
  return (
    <>
      <button onClick={WAAPIAnimationMethods.play}>{label.play}</button>
      <button onClick={WAAPIAnimationMethods.pause}>{label.pause}</button>
      <button onClick={WAAPIAnimationMethods.reset}>{label.reset}</button>
    </>
  );
};

export default PlayButton;
