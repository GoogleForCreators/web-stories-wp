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
import { useCallback } from 'react';
import { __ } from '@web-stories-wp/i18n';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { Button, Color, Row } from '../../../form';
import { useStory } from '../../../../app';
import { SimplePanel } from '../../panel';
import { FlipControls, getColorPickerActions } from '../../shared';

const DEFAULT_FLIP = { horizontal: false, vertical: false };
function PageBackgroundPanel({ selectedElements, pushUpdate }) {
  const {
    state: { currentPage },
    actions: { updateCurrentPageProperties },
  } = useStory();
  const isBackground = selectedElements[0].isBackground;
  const isDefaultBackground = selectedElements[0].isDefaultBackground;
  const { backgroundColor } = currentPage;

  const updateBackgroundColor = useCallback(
    (value) => {
      updateCurrentPageProperties({ properties: { backgroundColor: value } });
    },
    [updateCurrentPageProperties]
  );

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
      name="pageBackground"
      title={__('Page background', 'web-stories')}
      isPersistable={false}
    >
      {isDefaultBackground && (
        <Row>
          <Color
            hasGradient
            value={backgroundColor}
            onChange={updateBackgroundColor}
            label={__('Background color', 'web-stories')}
            colorPickerActions={getColorPickerActions}
            hasOpacity={false}
          />
        </Row>
      )}
      {isBackground && !isDefaultBackground && (
        <Row expand={false}>
          <Button onClick={removeAsBackground} fullWidth>
            {__('Detach from background', 'web-stories')}
          </Button>
          <FlipControls
            onChange={(value) => pushUpdate({ flip: value }, true)}
            value={flip}
            elementSpacing={36}
          />
        </Row>
      )}
    </SimplePanel>
  );
}

PageBackgroundPanel.propTypes = {
  selectedElements: PropTypes.array,
  pushUpdate: PropTypes.func,
};

export default PageBackgroundPanel;
