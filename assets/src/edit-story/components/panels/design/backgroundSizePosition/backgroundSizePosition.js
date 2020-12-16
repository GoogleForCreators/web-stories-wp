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
import { useCallback } from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Button, Row } from '../../../form';
import useStory from '../../../../app/story/useStory';
import { SimplePanel } from '../../panel';
import { FlipControls } from '../../shared';

const DEFAULT_FLIP = { horizontal: false, vertical: false };

function BackgroundSizePositionPanel({ selectedElements, pushUpdate }) {
  // Background can only have one selected element.
  const flip = selectedElements[0]?.flip || DEFAULT_FLIP;

  const { setBackgroundElement } = useStory((state) => ({
    setBackgroundElement: state.actions.setBackgroundElement,
  }));

  const removeAsBackground = useCallback(() => {
    pushUpdate(
      {
        isBackground: false,
        opacity: 100,
        overlay: null,
      },
      true
    );
    setBackgroundElement({ elementId: null });
  }, [pushUpdate, setBackgroundElement]);

  return (
    <SimplePanel
      name="backgroundSizePosition"
      title={__('Size & Position', 'web-stories')}
    >
      <Row expand={false}>
        <Button onClick={removeAsBackground} fullWidth>
          {__('Detach from background', 'web-stories')}
        </Button>
      </Row>
      <Row expand={false}>
        <FlipControls
          onChange={(value) => pushUpdate({ flip: value }, true)}
          value={flip}
          elementSpacing={36}
        />
      </Row>
    </SimplePanel>
  );
}

BackgroundSizePositionPanel.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  pushUpdate: PropTypes.func.isRequired,
};

export default BackgroundSizePositionPanel;
