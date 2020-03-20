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
import { Button, Row, DropDown, DateTime, Label } from '../../form';
import { SimplePanel } from '../panel';
import { useMediaPicker } from '../../mediaPicker';
import { useConfig } from '../../../app/config';
import useInspector from '../../inspector/useInspector';
import { useStory } from '../../../app/story';
import { ReactComponent as ToggleIcon } from '../../../icons/dropdown.svg';
import { getReadableDate, getReadableTime } from './utils';
import useOutSideClickHandler from './useOutsideClickHandler';

const Img = styled.img`
  width: 100%;
  max-height: 300px;
  object-fit: contain;
`;

const FieldLabel = styled(Label)`
  flex-basis: ${({ width }) => (width ? width : 64)}px;
`;

const BoxedText = styled.div.attrs({ role: 'button', tabIndex: '0' })`
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
`;

const DateWrapper = styled.div`
  padding: 5px 0 5px 2px;
`;

const Date = styled.span`
  color: ${({ theme }) => rgba(theme.colors.fg.v1, 0.86)};
`;

const Time = styled.span`
  color: ${({ theme }) => rgba(theme.colors.fg.v1, 0.4)};
`;

const DateTimeWrapper = styled.div`
  position: relative;
`;

const StyledToggleIcon = styled(ToggleIcon)`
  height: 26px;
  flex: 1;
`;

function PublishPanel() {
  const {
    state: { users },
  } = useInspector();

  const {
    state: {
      meta: { isSaving },
      story: { author, date, featuredMediaUrl },
      capabilities,
    },
    actions: { updateStory },
  } = useStory();
  const { postThumbnails } = useConfig();

  const [showDatePicker, setShowDatePicker] = useState(false);
  const dateTimePickerNode = useRef();
  const dateFieldNode = useRef();

  useOutSideClickHandler([dateTimePickerNode, dateFieldNode], () =>
    setShowDatePicker(false)
  );
  const handleDateChange = useCallback(
    (value, close = false) => {
      if (close && showDatePicker) {
        setShowDatePicker(false);
      }
      updateStory({ properties: { date: value } });
    },
    [showDatePicker, updateStory]
  );

  const handleChangeImage = useCallback(
    (image) =>
      updateStory({
        properties: {
          featuredMedia: image.id,
          featuredMediaUrl: image.sizes?.medium?.url || image.url,
        },
      }),
    [updateStory]
  );

  const handleRemoveImage = useCallback(
    (evt) => {
      updateStory({ properties: { featuredMedia: 0, featuredMediaUrl: '' } });
      evt.preventDefault();
    },
    [updateStory]
  );

  const openMediaPicker = useMediaPicker({
    title: __('Select as featured image', 'web-stories'),
    buttonInsertText: __('Set as featured image', 'web-stories'),
    onSelect: handleChangeImage,
    type: 'image',
  });

  const handleChangeValue = useCallback(
    (prop) => (value) => updateStory({ properties: { [prop]: value } }),
    [updateStory]
  );

  const authorLabel = __('Author', 'web-stories');
  return (
    <SimplePanel name="publishing" title={__('Publishing', 'web-stories')}>
      <Row>
        <FieldLabel>{__('Publish', 'web_stories')}</FieldLabel>
        <BoxedText
          aria-pressed={showDatePicker}
          aria-haspopup={true}
          aria-expanded={showDatePicker}
          onClick={(e) => {
            e.preventDefault();
            setShowDatePicker(!showDatePicker);
          }}
          ref={dateFieldNode}
        >
          <DateWrapper>
            <Date>{getReadableDate(date)}</Date>{' '}
            <Time>{getReadableTime(date)}</Time>
          </DateWrapper>
          <StyledToggleIcon />
        </BoxedText>
        {showDatePicker && (
          <DateTimeWrapper>
            {/* @todo get the actual value for is12Hour */}
            <DateTime
              value={date}
              onChange={handleDateChange}
              is12Hour={true}
              forwardedRef={dateTimePickerNode}
            />
          </DateTimeWrapper>
        )}
      </Row>
      {capabilities && capabilities.hasAssignAuthorAction && users && (
        <Row>
          <FieldLabel>{authorLabel}</FieldLabel>
          <DropDown
            ariaLabel={authorLabel}
            options={users}
            value={author}
            disabled={isSaving}
            onChange={handleChangeValue('author')}
            isDocumentPanel={true}
          />
        </Row>
      )}
      {featuredMediaUrl && <Img src={featuredMediaUrl} />}
      {featuredMediaUrl && (
        <Button onClick={handleRemoveImage} fullWidth>
          {__('Remove image', 'web-stories')}
        </Button>
      )}

      {postThumbnails && (
        <Button onClick={openMediaPicker} fullWidth>
          {featuredMediaUrl
            ? __('Replace image', 'web-stories')
            : __('Set featured image', 'web-stories')}
        </Button>
      )}
    </SimplePanel>
  );
}

export default PublishPanel;
