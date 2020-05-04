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
import styled from 'styled-components';
import { rgba } from 'polished';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Row, DropDown, DateTime, Label, Media, Required } from '../../../form';
import { SimplePanel } from '../../../panels/panel';
import useInspector from '../../../inspector/useInspector';
import { useStory } from '../../../../app/story';
import { ReactComponent as ToggleIcon } from '../../../../icons/dropdown.svg';
import { useKeyDownEffect } from '../../../keyboard';
import useFocusOut from '../../../../utils/useFocusOut';
import { useConfig } from '../../../../app/config';
import Popup from '../../../popup';
import { getReadableDate, getReadableTime, is12Hour } from './utils';

const LabelWrapper = styled.div`
  width: 106px;
`;

const FieldLabel = styled(Label)`
  flex-basis: ${({ width }) => (width ? width : '64px')};
`;

const MediaWrapper = styled.div`
  flex-basis: 134px;
`;

const StyledButton = styled.button`
  color: ${({ theme }) => theme.colors.fg.v1};
  font-family: ${({ theme }) => theme.fonts.body2.family};
  font-size: ${({ theme }) => theme.fonts.body2.size};
  line-height: ${({ theme }) => theme.fonts.body2.lineHeight};
  letter-spacing: ${({ theme }) => theme.fonts.body2.letterSpacing};
  display: flex;
  flex-direction: row;
  background-color: ${({ theme }) => rgba(theme.colors.fg.v1, 0.1)};
  flex: 1;
  padding: 2px;
  border-radius: 4px;
  border-color: transparent;
`;

const DateWrapper = styled.div`
  padding: 5px 0px 5px 2px;
  width: 100%;
  text-align: left;
`;

const Date = styled.span`
  color: ${({ theme }) => rgba(theme.colors.fg.v1, 0.86)};
`;

const Time = styled.span`
  color: ${({ theme }) => rgba(theme.colors.fg.v1, 0.4)};
  display: inline-block;
`;

const StyledToggleIcon = styled(ToggleIcon)`
  height: 26px;
  min-width: 25px;
`;

function PublishPanel() {
  const {
    state: { users, isUsersLoading },
  } = useInspector();

  const {
    state: {
      meta: { isSaving },
      story: { author, date, featuredMediaUrl, publisherLogoUrl },
    },
    actions: { updateStory },
  } = useStory();

  const { timeFormat, capabilities } = useConfig();

  const [showDatePicker, setShowDatePicker] = useState(false);
  const dateTimeNode = useRef();
  const dateFieldRef = useRef();

  useKeyDownEffect(dateFieldRef, { key: ['space', 'enter'] }, () => {
    setShowDatePicker((val) => !val);
  });

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

  const handleChangeCover = useCallback(
    (image) =>
      updateStory({
        properties: {
          featuredMedia: image.id,
          featuredMediaUrl: image.sizes?.medium?.url || image.url,
        },
      }),
    [updateStory]
  );

  // @todo Enforce square image while selecting in Media Library.
  const handleChangePublisherLogo = useCallback(
    (image) => {
      updateStory({
        properties: {
          publisherLogo: image.id,
          publisherLogoUrl: image.sizes?.thumbnail?.url || image.url,
        },
      });
    },
    [updateStory]
  );

  const handleChangeValue = useCallback(
    (prop) => (value) => updateStory({ properties: { [prop]: value } }),
    [updateStory]
  );

  const authorLabel = __('Author', 'web-stories');
  const use12HourFormat = is12Hour(timeFormat);
  return (
    <SimplePanel name="publishing" title={__('Publishing', 'web-stories')}>
      <Row>
        <FieldLabel>{__('Publish', 'web-stories')}</FieldLabel>
        <StyledButton
          aria-pressed={showDatePicker}
          aria-haspopup={true}
          aria-expanded={showDatePicker}
          onClick={(e) => {
            e.preventDefault();
            if (!showDatePicker) {
              // Handle only opening the datepicker since onFocusOut deals with closing.
              setShowDatePicker(true);
            }
          }}
          ref={dateFieldRef}
        >
          <DateWrapper>
            <Date>{getReadableDate(date, use12HourFormat)}</Date>{' '}
            <Time>{getReadableTime(date, use12HourFormat)}</Time>
          </DateWrapper>
          <StyledToggleIcon />
        </StyledButton>
      </Row>
      <Popup anchor={dateFieldRef} isOpen={showDatePicker}>
        <DateTime
          value={date}
          onChange={handleDateChange}
          is12Hour={use12HourFormat}
          forwardedRef={dateTimeNode}
        />
      </Popup>
      {capabilities && capabilities.hasAssignAuthorAction && users && (
        <Row>
          <FieldLabel>{authorLabel}</FieldLabel>
          {isUsersLoading ? (
            <DropDown
              ariaLabel={authorLabel}
              placeholder={__('Loading…', 'web-stories')}
              disabled
              lightMode={true}
            />
          ) : (
            <DropDown
              ariaLabel={authorLabel}
              options={users}
              value={author}
              disabled={isSaving}
              onChange={handleChangeValue('author')}
              lightMode={true}
            />
          )}
        </Row>
      )}
      <Row>
        {/* @todo Replace this with selection to choose between publisher logos */}
        <LabelWrapper>
          <FieldLabel>{__('Publisher Logo', 'web-stories')}</FieldLabel>
          <Required />
        </LabelWrapper>
        <MediaWrapper>
          <Media
            value={publisherLogoUrl}
            onChange={handleChangePublisherLogo}
            title={__('Select as publisher logo', 'web-stories')}
            buttonInsertText={__('Select as publisher logo', 'web-stories')}
            type={'image'}
            size={80}
          />
        </MediaWrapper>
      </Row>
      <Row>
        <LabelWrapper>
          <FieldLabel>{__('Cover Image', 'web-stories')}</FieldLabel>
          <Required />
        </LabelWrapper>
        <MediaWrapper>
          <Media
            value={featuredMediaUrl}
            onChange={handleChangeCover}
            title={__('Select as cover image', 'web-stories')}
            buttonInsertText={__('Select as cover image', 'web-stories')}
            type={'image'}
          />
        </MediaWrapper>
      </Row>
    </SimplePanel>
  );
}

export default PublishPanel;
