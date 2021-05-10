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
import { useCallback, useRef, useState } from 'react';
import { format, formatTime, is12Hour } from '@web-stories-wp/date';
import { __ } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import { DateTime, Row } from '../../../form';
import Popup from '../../../popup';
import { useStory } from '../../../../app/story';
import {
  PLACEMENT,
  useKeyDownEffect,
  useFocusOut,
} from '../../../../../design-system';
import DropDownSelect from '../../../../../design-system/components/dropDown/select';
import { focusStyle } from '../../shared';

function PublishTime() {
  const { date, updateStory } = useStory(
    ({
      state: {
        story: { date },
      },
      actions: { updateStory },
    }) => ({
      date,
      updateStory,
    })
  );
  const use12HourFormat = is12Hour();

  /* translators: Date format, see https://www.php.net/date */
  const shortDateFormat = __('d/m/Y', 'web-stories');

  const [showDatePicker, setShowDatePicker] = useState(false);
  const dateTimeNode = useRef();
  const dateFieldRef = useRef();

  useKeyDownEffect(
    dateFieldRef,
    { key: ['space', 'enter'] },
    () => {
      setShowDatePicker((val) => !val);
    },
    []
  );

  useFocusOut(dateTimeNode, () => setShowDatePicker(false), [showDatePicker]);

  const handleDateChange = useCallback(
    (value, close = false) => {
      if (close && showDatePicker) {
        setShowDatePicker(false);
      }
      updateStory({ properties: { date: value } });
    },
    [showDatePicker, updateStory]
  );

  return (
    <>
      <Row>
        <DropDownSelect
          dropDownLabel={__('Publish', 'web-stories')}
          aria-pressed={showDatePicker}
          aria-haspopup
          aria-expanded={showDatePicker}
          aria-label={__('Story publish time', 'web-stories')}
          onSelectClick={(e) => {
            e.preventDefault();
            if (!showDatePicker) {
              // Handle only opening the datepicker since onFocusOut deals with closing.
              setShowDatePicker(true);
            }
          }}
          ref={dateFieldRef}
          activeItemLabel={
            format(date, shortDateFormat) + ' ' + formatTime(date)
          }
          selectButtonStylesOverride={focusStyle}
        />
      </Row>
      <Popup
        anchor={dateFieldRef}
        isOpen={showDatePicker}
        placement={PLACEMENT.BOTTOM_END}
        renderContents={({ propagateDimensionChange }) => (
          <DateTime
            value={date}
            onChange={(value, close = false) => {
              handleDateChange(value, close);
            }}
            onViewChange={() => propagateDimensionChange()}
            is12Hour={use12HourFormat}
            forwardedRef={dateTimeNode}
            onClose={() => setShowDatePicker(false)}
          />
        )}
      />
    </>
  );
}

export default PublishTime;
