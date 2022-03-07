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
import { __ } from '@googleforcreators/i18n';
import { Text, THEME_CONSTANTS } from '@googleforcreators/design-system';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { Row, TextArea } from '../../../form';
import { getCommonValue, useCommonObjectValue } from '../../shared';
import { SimplePanel } from '../../panel';
import { useHighlights, states, styles } from '../../../../app/highlights';
import { MULTIPLE_VALUE, MULTIPLE_DISPLAY_VALUE } from '../../../../constants';

const StyledText = styled(Text)`
  color: ${({ theme }) => theme.colors.fg.secondary};
  margin-bottom: 10px;
`;

const DEFAULT_RESOURCE = { alt: null };
const MIN_MAX = {
  ALT_TEXT: {
    MAX: 1000,
  },
};

function ImageAccessibilityPanel({ selectedElements, pushUpdate }) {
  const resource = useCommonObjectValue(
    selectedElements,
    'resource',
    DEFAULT_RESOURCE
  );
  const alt = getCommonValue(selectedElements, 'alt', resource.alt);

  const { highlight, resetHighlight, cancelHighlight } = useHighlights(
    (state) => ({
      highlight: state[states.ASSISTIVE_TEXT],
      resetHighlight: state.onFocusOut,
      cancelHighlight: state.cancelEffect,
    })
  );

  return (
    <SimplePanel
      css={highlight && styles.FLASH}
      onAnimationEnd={() => resetHighlight()}
      name="imageAccessibility"
      title={__('Accessibility', 'web-stories')}
      isPersistable={!highlight}
    >
      <StyledText size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
        {__('Add a brief description of the image.', 'web-stories')}
      </StyledText>
      <Row>
        <TextArea
          ref={(node) => {
            if (node && highlight?.focus && highlight?.showEffect) {
              node.addEventListener('keydown', cancelHighlight, { once: true });
              node.focus();
            }
          }}
          placeholder={alt === MULTIPLE_VALUE ? MULTIPLE_DISPLAY_VALUE : ''}
          value={alt || ''}
          onChange={(evt) =>
            pushUpdate({ alt: evt?.target?.value?.trim() || null }, true)
          }
          aria-label={__('Assistive text', 'web-stories')}
          maxLength={MIN_MAX.ALT_TEXT.MAX}
          rows={2}
          isIndeterminate={alt === MULTIPLE_VALUE}
        />
      </Row>
    </SimplePanel>
  );
}

ImageAccessibilityPanel.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  pushUpdate: PropTypes.func.isRequired,
};

export default ImageAccessibilityPanel;
