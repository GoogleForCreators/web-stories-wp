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
import { DropDown } from '@googleforcreators/design-system';
import { getTextElementTagNames } from '@googleforcreators/output';

/**
 * Internal dependencies
 */
import { Row } from '../../../form';
import { SimplePanel } from '../../panel';
import { useHighlights, states, styles } from '../../../../app/highlights';
import { MULTIPLE_VALUE, MULTIPLE_DISPLAY_VALUE } from '../../../../constants';
// import getTextElementTagNames from '../../../../../../output/src/utils/getTextElementTagNames';

// packages/output/src/utils/getTextElementTagNames

const optionsMap = [
  {
    label: __('Heading 1', 'web-stories'),
    value: 'h1',
  },
  {
    label: __('Heading 2', 'web-stories'),
    value: 'h2',
  },
  {
    label: __('Heading 3', 'web-stories'),
    value: 'h3',
  },
  {
    label: __('Paragraph', 'web-stories'),
    value: 'p',
  },
];

function TextAccessibilityPanel({ selectedElements }) {
  const { highlight, resetHighlight, cancelHighlight } = useHighlights(
    (state) => ({
      highlight: state[states.ASSISTIVE_TEXT],
      resetHighlight: state.onFocusOut,
      cancelHighlight: state.cancelEffect,
    })
  );
  // Map all types of tag names in the selected elements
  // and then convert to an Array for usage
  const tagNames = Array.from(
    getTextElementTagNames(
      selectedElements.filter(({ type }) => 'text' === type)
    ).values()
  );
  const currentValue = tagNames.length > 1 ? '((MULTIPLE))' : tagNames;
  const onChange = () => {};
  return (
    <SimplePanel
      css={highlight && styles.FLASH}
      onAnimationEnd={() => resetHighlight()}
      name="textAccessibility"
      title={__('Accessibility', 'web-stories')}
      isPersistable={!highlight}
    >
      <Row>
        <DropDown
          ref={(node) => {
            if (node && highlight?.focus && highlight?.showEffect) {
              node.addEventListener('keydown', cancelHighlight, { once: true });
              node.focus();
            }
          }}
          data-testid="headingLevel"
          title={__('Heading Levels', 'web-stories')}
          dropdownButtonLabel={__('Heading Levels', 'web-stories')}
          options={optionsMap}
          selectedValue={currentValue}
          placeholder={
            MULTIPLE_VALUE === currentValue
              ? MULTIPLE_DISPLAY_VALUE
              : currentValue
          }
          onChange={onChange}
          dropDownLabel={__('Heading Level', 'web-stories')}
        />
      </Row>
    </SimplePanel>
  );
}

TextAccessibilityPanel.propTypes = {
  selectedElements: PropTypes.array.isRequired,
};

export default TextAccessibilityPanel;
