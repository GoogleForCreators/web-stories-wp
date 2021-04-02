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
import { useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useFeatures } from 'flagged';
import { __, sprintf } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import { Headline, Text, THEME_CONSTANTS } from '../../../design-system';
import { STORY_STATUS } from '../../constants';
import { titleFormatted } from '../../utils';
import { DashboardStatusesPropType } from '../../types';
import InlineInputForm from '../inlineInputForm';
import { LockClosed as LockSVG } from '../../../design-system/icons';
import { useConfig } from '../../app/config';

const StyledCardTitle = styled.div`
  padding: 12px 4px 0 4px;
  display: inline-block;
  max-width: calc(100% - 20px);
`;

const LockRow = styled.div`
  margin-bottom: 5px;
`;
const LockAvatar = styled.img`
  height: 16px;
  width: 16px;
  margin-right: 5px;
`;

const TitleStoryLink = styled(Headline).attrs(() => ({
  as: 'a',
  size: THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.XX_SMALL,
}))`
  width: 100%;
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const TitleBodyText = styled(Text).attrs(() => ({
  forwardedAs: 'span',
  size: THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL,
}))`
  display: block;
  color: ${({ isSecondary, theme }) =>
    isSecondary ? theme.colors.fg.secondary : theme.colors.fg.primary};
  margin: 0;
`;

const DateHelperText = styled(Text).attrs(() => ({
  forwardedAs: 'span',
  size: THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL,
}))`
  &:after {
    content: '-';
    color: ${({ theme }) => theme.colors.fg.secondary};
    font-weight: 400;
    padding: 0 0.25em;
  }
`;
// TODO: Fix dirty workaround.
const ListIcon = styled(LockSVG)`
  color: ${({ theme }) => theme.colors.gray[90]};
  display: inline-block;
  height: 36px;
  width: 36px;
  margin: -9px -3px -10px -8px;
`;

const CardTitle = ({
  id,
  secondaryTitle,
  title,
  titleLink,
  status,
  displayDate,
  editMode,
  onEditComplete,
  onEditCancel,
  tabIndex,
  locked = false,
  lockUser = {},
}) => {
  const { enablePostLocking } = useFeatures();
  const { userId } = useConfig();

  const displayDateText = useMemo(() => {
    if (!displayDate) {
      return null;
    }

    switch (status) {
      case STORY_STATUS.PUBLISH:
        return sprintf(
          /* translators: %s: published date */
          __('Published %s', 'web-stories'),
          displayDate
        );
      case STORY_STATUS.FUTURE:
        return sprintf(
          /* translators: %s: future publish date */
          __('Scheduled %s', 'web-stories'),
          displayDate
        );

      default:
        return sprintf(
          /* translators: %s: last modified date */
          __('Modified %s', 'web-stories'),
          displayDate
        );
    }
  }, [status, displayDate]);

  const showLockIcon = useMemo(() => {
    return enablePostLocking && locked && userId !== lockUser.id;
  }, [enablePostLocking, lockUser, locked, userId]);

  return (
    <StyledCardTitle>
      {showLockIcon && (
        <LockRow>
          <ListIcon />
          {lockUser.avatar && (
            <LockAvatar
              src={lockUser.avatar}
              alt={lockUser.name}
              height={24}
              width={24}
            />
          )}
          {sprintf(
            /* translators: %s: user name */
            __('%s is currently editing', 'web-stories'),
            lockUser.name
          )}
        </LockRow>
      )}
      {editMode ? (
        <InlineInputForm
          onEditComplete={onEditComplete}
          onEditCancel={onEditCancel}
          value={title}
          id={id}
          label={__('Rename story', 'web-stories')}
        />
      ) : (
        <TitleStoryLink
          href={titleLink}
          tabIndex={tabIndex}
          aria-label={sprintf(
            /* translators: %s: title*/
            __('Open %s in editor', 'web-stories'),
            title
          )}
        >
          {titleFormatted(title)}
        </TitleStoryLink>
      )}
      {secondaryTitle && <TitleBodyText>{secondaryTitle}</TitleBodyText>}
      <TitleBodyText isSecondary className="dashboard-grid-item-date">
        {status === STORY_STATUS.DRAFT && (
          <DateHelperText isBold>{__('Draft', 'web-stories')}</DateHelperText>
        )}
        {displayDateText}
      </TitleBodyText>
    </StyledCardTitle>
  );
};

CardTitle.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  title: PropTypes.string.isRequired,
  titleLink: PropTypes.string,
  secondaryTitle: PropTypes.string,
  status: DashboardStatusesPropType,
  editMode: PropTypes.bool,
  locked: PropTypes.bool,
  lockUser: PropTypes.object,
  displayDate: PropTypes.string,
  onEditComplete: PropTypes.func,
  onEditCancel: PropTypes.func,
  tabIndex: PropTypes.number,
};

export default CardTitle;
