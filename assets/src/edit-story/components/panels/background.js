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
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import useStory from '../../app/story/useStory';
import { Button } from '../form';
import { SimplePanel } from './panel';

function BackgroundPanel({ onSetProperties }) {
  // Remove background: check if is background.
  const {
    actions: { setBackgroundElement },
  } = useStory();

  // To add: Opacity; Overlay
  const handleClick = () => {
    const newState = {
      isBackground: false,
      opacity: 100,
      overlay: null,
    };
    setBackgroundElement({ elementId: null });
    onSetProperties(newState);
  };
  return (
    <SimplePanel name="position" title={__('Background', 'web-stories')}>
      <Button onClick={handleClick}>
        {__('Remove as Background', 'web-stories')}
      </Button>
    </SimplePanel>
  );
}

BackgroundPanel.propTypes = {
  onSetProperties: PropTypes.func.isRequired,
};

export default BackgroundPanel;
