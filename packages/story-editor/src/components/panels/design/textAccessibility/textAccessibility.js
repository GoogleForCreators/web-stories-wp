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
import { Datalist } from '@googleforcreators/design-system';
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
    label: 'Heading 1',
    value: 'h1',
  },
  {
    label: 'Heading 2',
    value: 'h2',
  },
  {
    label: 'Heading 3',
    value: 'h3',
  },
  {
    label: 'Paragraph',
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
  const tagNamesMap = getTextElementTagNames(
    selectedElements.filter(({ type }) => 'text' === type)
  );
  console.log([...tagNamesMap]);
  const currentValue =
    [...tagNamesMap.length] > 1 ? '((MULTIPLE))' : [...tagNamesMap][0];
  console.log([...tagNamesMap]);
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
        <Datalist.DropDown
          ref={(node) => {
            if (node && highlight?.focus && highlight?.showEffect) {
              node.addEventListener('keydown', cancelHighlight, { once: true });
              node.focus();
            }
          }}
          //   zIndex={zIndex}
          //   tabIndex={tabIndex}
          //   highlightStylesOverride={highlightStylesOverride}
          data-testid="font"
          title={__('Heading Levels', 'web-stories')}
          dropdownButtonLabel={__('Font family', 'web-stories')}
          options={optionsMap}
          selectedId={MULTIPLE_VALUE === currentValue ? '' : currentValue}
          placeholder={
            MULTIPLE_VALUE === currentValue
              ? MULTIPLE_DISPLAY_VALUE
              : currentValue
          }
          onChange={onChange}
          // renderer={forwardRef(renderer)}
          dropDownLabel={__('Heading Level', 'web-stories')}
          //   listStyleOverrides={listStyleOverrides}
          //   containerStyleOverrides={containerStyleOverrides}
          //   className={className}
        />
      </Row>
    </SimplePanel>
  );
}

TextAccessibilityPanel.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  pushUpdate: PropTypes.func.isRequired,
};

export default TextAccessibilityPanel;
