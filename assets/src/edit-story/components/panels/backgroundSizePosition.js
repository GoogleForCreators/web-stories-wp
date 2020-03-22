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
import { Button, Row } from '../form';
import useStory from '../../app/story/useStory';
import { SimplePanel } from './panel';
import FlipControls from './shared/flipControls';

function BackgroundSizePositionPanel({ selectedElements, onSetProperties }) {
  // Background can only have one selected element.
  const flip = selectedElements[0]?.flip;
  const [state, setState] = useState({ flip });

  const {
    actions: { setBackgroundElement },
  } = useStory();

  useEffect(() => {
    setState({ flip });
  }, [flip]);

  useEffect(() => {
    onSetProperties(state);
  }, [onSetProperties, state, state.flip]);

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
    <SimplePanel
      name="backgroundSizePosition"
      title={__('Size & Position', 'web-stories')}
    >
      <Row expand={false}>
        <Button onClick={handleClick} fullWidth>
          {__('Remove as Background', 'web-stories')}
        </Button>
      </Row>
      <Row expand={false}>
        <FlipControls
          onChange={(value) => setState({ ...state, flip: value })}
          value={state.flip}
        />
      </Row>
    </SimplePanel>
  );
}

BackgroundSizePositionPanel.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  onSetProperties: PropTypes.func.isRequired,
};

export default BackgroundSizePositionPanel;
