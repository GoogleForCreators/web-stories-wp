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
  Link,
} from '@googleforcreators/design-system';
import { trackClick } from '@googleforcreators/tracking';
import { useFeature } from 'flagged';
import { useCallback, useState } from '@googleforcreators/react';
import { getTextElementTagNames } from '@googleforcreators/output';

/**
 * Internal dependencies
 */
import { useStory } from '../../../../app/story';
import { Row } from '../../../form';
import { getCommonValue } from '../../shared';
import { SimplePanel } from '../../panel';
import { MULTIPLE_VALUE, MULTIPLE_DISPLAY_VALUE } from '../../../../constants';

const HEADING_LEVELS = {
  h1: __('Heading 1', 'web-stories'),
  h2: __('Heading 2', 'web-stories'),
  h3: __('Heading 3', 'web-stories'),
  p: __('Paragraph', 'web-stories'),
};

function TextAccessibilityPanel({ selectedElements, pushUpdate }) {
  const showSemanticHeadings = useFeature('showSemanticHeadings');
  const [tagNamesOverrides, setTagNamesOverrides] = useState();

  const { textElements } = useStory(({ state }) => ({
    textElements: state.currentPage?.elements
      ?.filter(({ type }) => 'text' === type)
      .map(({ id, tagName, ...rest }) => ({
        id,
        ...rest,
        tagName: tagNamesOverrides?.get(id) || tagName,
      })),
  }));

  const onLinkClick = useCallback((evt) => {
    trackClick(evt, 'click_headings_docs');
  }, []);

  const handleChange = useCallback(
    (evt, value) => {
      setTagNamesOverrides(
        new Map(selectedElements.map(({ id }) => [id, value]))
      );

      selectedElements.forEach(() => {
        pushUpdate({ tagName: value });
      });
    },
    [pushUpdate, selectedElements]
  );

  if (!showSemanticHeadings) {
    return null;
  }

  const tagNamesMap = getTextElementTagNames(textElements);

  const selectedElementsWithTagNames = selectedElements.map((element) => ({
    ...element,
    tagName: tagNamesMap.get(element.id),
    defaultTagName: element.tagName || 'auto',
  }));

  const uniqueTagNames = [
    ...new Set(
      selectedElementsWithTagNames.map(({ tagName }) => tagName || 'auto')
    ),
  ];

  const currentValue =
    uniqueTagNames.length === 1 ? uniqueTagNames[0] : MULTIPLE_VALUE;

  const tagName = getCommonValue(
    selectedElementsWithTagNames,
    'defaultTagName',
    'auto'
  );

  const isIndeterminate = MULTIPLE_VALUE === tagName;
  const selectedValue = 'auto' === tagName ? 'auto' : currentValue;

  const options = [
    {
      label:
        'auto' === selectedValue
          ? sprintf(
              /* translators: %s: heading level. */
              __('Automatic (%s)', 'web-stories'),
              HEADING_LEVELS[currentValue] || MULTIPLE_DISPLAY_VALUE
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
              <Link
                href={__('https://wp.stories.google/docs/seo/', 'web-stories')}
                rel="noreferrer"
                target="_blank"
                onClick={onLinkClick}
                size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL}
              />
            ),
          }}
        >
          {__(
            '<a>Learn more</a> about using headings in stories.',
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
