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
import { useEffect, useState } from 'react';

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

function BackgroundPanel({ selectedElements, onSetProperties }) {
  // Remove background: check if is background.
  const {
    actions: { setBackgroundElement },
  } = useStory();
  const { overlay, opacity, isBackground } = selectedElements[0];

  // To add: Remove as background; Opacity; Overlay

  const [state, setState] = useState({ isBackground, opacity, overlay });
  useEffect(() => {
    setState({ isBackground });
  }, [isBackground]);
  const handleClick = () => {
    const newIsBackground = !state.isBackground;
    const newState = {
      isBackground: newIsBackground,
      opacity: 100,
      overlay: null,
    };
    setState(newState);
    const backgroundId = newIsBackground ? selectedElements[0].id : null;
    setBackgroundElement({ elementId: backgroundId });
    onSetProperties(newState);
  };
  return (
    <SimplePanel name="position" title={__('Background', 'web-stories')}>
      <Button onClick={handleClick}>
        {state.isBackground
          ? __('Remove as Background', 'web-stories')
          : __('Set as background', 'web-stories')}
      </Button>
    </SimplePanel>
  );
}

BackgroundPanel.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  onSetProperties: PropTypes.func.isRequired,
};

export default BackgroundPanel;
