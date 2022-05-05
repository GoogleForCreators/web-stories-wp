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
import {
  useCallback,
  useRef,
  useState,
  useFocusOut,
} from '@googleforcreators/react';
import { format, formatTime, is12Hour } from '@googleforcreators/date';
import { __ } from '@googleforcreators/i18n';
import {
  DropDownSelect,
  useKeyDownEffect,
  Popup,
} from '@googleforcreators/design-system';
import {
  DateTime,
  Row,
  useStory,
  focusStyle,
} from '@googleforcreators/story-editor';

// date-fns format without timezone.
const TIMEZONELESS_FORMAT = 'Y-m-d\\TH:i:s';

const loadCalendar = () =>
  import(/* webpackChunkName: "chunk-react-calendar" */ 'react-calendar');

function PublishTime() {
  const { date, modified, status, updateStory } = useStory(
    ({
      state: {
        story: { date, modified, status },
      },
      actions: { updateStory },
    }) => ({
      date,
      modified,
      status,
      updateStory,
    })
  );
  const use12HourFormat = is12Hour();

  /* translators: Date format, see https://www.php.net/manual/en/datetime.format.php */
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
      // Format the date only if the value exists.
      const newDate = value
        ? format(new Date(value), TIMEZONELESS_FORMAT)
        : value;
      updateStory({
        properties: { date: newDate },
      });
    },
    [showDatePicker, updateStory]
  );

  // Floating date means an unset date so that the story publish date will match the time it will get published.
  const floatingDate =
    ['draft', 'pending', 'auto-draft'].includes(status) &&
    (date === modified || date === null);
  const displayDate = Date.now();
  const displayLabel = !floatingDate
    ? format(date || displayDate, shortDateFormat) +
      ' ' +
      formatTime(date || displayDate)
    : __('Immediately', 'web-stories');
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
          activeItemLabel={displayLabel}
          selectButtonStylesOverride={focusStyle}
          onPointerEnter={() => loadCalendar()}
          onFocus={() => loadCalendar()}
        />
      </Row>
      <Popup
        anchor={dateFieldRef}
        isOpen={showDatePicker}
        zIndex={10}
        renderContents={({ propagateDimensionChange }) => (
          <DateTime
            value={floatingDate ? displayDate : date}
            onChange={(value, close = false) => {
              handleDateChange(value, close);
            }}
            onViewChange={() => propagateDimensionChange()}
            is12Hour={use12HourFormat}
            forwardedRef={dateTimeNode}
            onClose={() => setShowDatePicker(false)}
            canReset={
              ['draft', 'pending', 'auto-draft'].includes(status) &&
              !floatingDate
            }
          />
        )}
      />
    </>
  );
}

export default PublishTime;
