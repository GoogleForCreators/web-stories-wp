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
import { useCallback } from '@googleforcreators/react';
import { __ } from '@googleforcreators/i18n';

/**
 * Internal dependencies
 */
import { Row, Color } from '../../../form';
import { SimplePanel } from '../../panel';
import { getCommonValue } from '../../shared';
import { states, styles, useHighlights } from '../../../../app/highlights';

function ShapeStylePanel({ selectedElements, pushUpdate }) {
  const backgroundColor = getCommonValue(selectedElements, 'backgroundColor');

  const onChange = useCallback(
    (value) => {
      pushUpdate({ backgroundColor: value }, true);
    },
    [pushUpdate]
  );

  const { highlight, resetHighlight, cancelHighlight } = useHighlights(
    (state) => ({
      highlight: state[states.STYLE],
      resetHighlight: state.onFocusOut,
      cancelHighlight: state.cancelEffect,
    })
  );

  return (
    <SimplePanel
      css={highlight?.showEffect && styles.FLASH}
      onAnimationEnd={() => resetHighlight()}
      name="shapeStyle"
      title={__('Color', 'web-stories')}
      isPersistable={!highlight}
      aria-labelledby={null}
      aria-label={__('Shape style', 'web-stories')}
    >
      <Row>
        <Color
          ref={(node) => {
            if (node && highlight?.focus && highlight?.showEffect) {
              node.addEventListener('keydown', cancelHighlight, { once: true });
              node.focus();
            }
          }}
          allowsGradient
          value={backgroundColor}
          isMultiple={backgroundColor === ''}
          onChange={onChange}
          label={__('Background color', 'web-stories')}
          allowsSavedColors
        />
      </Row>
    </SimplePanel>
  );
}

ShapeStylePanel.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  pushUpdate: PropTypes.func.isRequired,
};

export default ShapeStylePanel;
