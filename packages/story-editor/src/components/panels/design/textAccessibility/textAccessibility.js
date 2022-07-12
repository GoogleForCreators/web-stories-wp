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
import { __, sprintf, TranslateWithMarkup } from '@googleforcreators/i18n';
import {
  DropDown,
  Text,
  THEME_CONSTANTS,
} from '@googleforcreators/design-system';
import { getTextElementTagNames } from '@googleforcreators/output';
import { trackClick } from '@googleforcreators/tracking';
import { useFeature } from 'flagged';
import { useState, useEffect } from '@googleforcreators/react';

/**
 * Internal dependencies
 */
import { Row } from '../../../form';
import { getCommonValue } from '../../shared';
import { SimplePanel } from '../../panel';
import { MULTIPLE_VALUE, MULTIPLE_DISPLAY_VALUE } from '../../../../constants';
import { combineElementsWithTags } from './utils';

const HEADING_LEVELS = {
  h1: __('Heading 1', 'web-stories'),
  h2: __('Heading 2', 'web-stories'),
  h3: __('Heading 3', 'web-stories'),
  p: __('Paragraph', 'web-stories'),
};

function TextAccessibilityPanel({ selectedElements, pushUpdate }) {
  // Feature flagging for Semantic Headings
  const showSemanticHeadings = useFeature('showSemanticHeadings');
  const [selectedTextElements, setSelectedTextElements] = useState([]);
  const [currentTags, setCurrentTags] = useState([]);

  useEffect(() => {
    // We want to get the text tags for the elements if not already defined
    const textTags = getTextElementTagNames(selectedElements);
    // Then combine the elements with their associated tag
    const newElements = combineElementsWithTags(selectedElements, textTags);
    // And then set them into component state
    setSelectedTextElements(newElements);
    setCurrentTags(Array.from(textTags.values()));
  }, [selectedElements, setSelectedTextElements]);

  if (!showSemanticHeadings) {
    return null;
  }

  // Map all types of tag names in the selected elements
  // and then convert to an Array for usage
  const handleChange = (evt, value) => {
    trackClick(evt, 'click-headings-docs');
    selectedElements.map(() => {
      return pushUpdate({ tagName: value });
    });
    // Update the selected text elements with the
    // value chosen in the text accessibility dropdown
    const newTags = getTextElementTagNames(selectedTextElements, value);
    setCurrentTags(Array.from(newTags.values()));
  };

  // Check if tags match for selected item in dropdown
  // If they don't match, we want to show 'Mixed'
  // However, if they match, show the matching value
  const currentValue =
    new Set(currentTags || []).size === 1 ? currentTags[0] : MULTIPLE_VALUE;

  const isIndeterminate = MULTIPLE_VALUE === currentValue;

  const tagName = getCommonValue(selectedElements, 'tagName', 'auto');

  const selectedValue = 'auto' === tagName ? 'auto' : currentValue;

  const options = [
    {
      label:
        'auto' === selectedValue
          ? sprintf(
              /* translators: %s: heading level. */
              __('Automatic (%s)', 'web-stories'),
              HEADING_LEVELS[currentValue]
            )
          : __('Automatic', 'web-stories'),
      value: 'auto',
    },
    {
      label: HEADING_LEVELS.h1,
      value: 'h1',
    },
    {
      label: HEADING_LEVELS.h2,
      value: 'h2',
    },
    {
      label: HEADING_LEVELS.h3,
      value: 'h3',
    },
    {
      label: HEADING_LEVELS.p,
      value: 'p',
    },
  ];

  return (
    <SimplePanel
      name="textAccessibility"
      title={__('Accessibility', 'web-stories')}
    >
      <Row>
        <DropDown
          data-testid="text-accessibility-dropdown"
          title={__('Heading Levels', 'web-stories')}
          dropdownButtonLabel={__('Heading Levels', 'web-stories')}
          options={options}
          selectedValue={selectedValue}
          placeholder={isIndeterminate ? MULTIPLE_DISPLAY_VALUE : currentValue}
          onMenuItemClick={handleChange}
          dropDownLabel={__('Heading Level', 'web-stories')}
        />
      </Row>
      <Text size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL}>
        <TranslateWithMarkup
          mapping={{
            a: (
              <a
                href={__('https://wp.stories.google/docs', 'web-stories')}
                rel="noreferrer"
                target="_blank"
                aria-label={__('Learn more', 'web-stories')}
              />
            ),
          }}
        >
          {__(
            '<a>Learn more</a> about using headings in Stories.',
            'web-stories'
          )}
        </TranslateWithMarkup>
      </Text>
    </SimplePanel>
  );
}

TextAccessibilityPanel.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  pushUpdate: PropTypes.func.isRequired,
};

export default TextAccessibilityPanel;
