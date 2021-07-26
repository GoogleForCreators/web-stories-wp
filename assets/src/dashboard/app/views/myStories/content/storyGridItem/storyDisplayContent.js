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
import { useFeatures } from 'flagged';
import { __, sprintf } from '@web-stories-wp/i18n';
import { Tooltip, TOOLTIP_PLACEMENT } from '@web-stories-wp/design-system';

/**
 * Internal dependencies
 */
import { STORY_STATUS } from '../../../../../constants';
import { useConfig } from '../../../../config';
import { InlineInputForm } from '../../../../../components';
import { DashboardStatusesPropType } from '../../../../../types';
import {
  StyledStoryDisplayContent,
  CardDetailsGrid,
  CardDetailsColumn,
  Row,
  Title,
  DetailCopy,
  LockAvatar,
  AvatarTooltip,
  LockIcon,
} from './components';

const StoryDisplayContent = ({
  author,
  contextMenu,
  displayDate,
  editMode,
  formattedTitle,
  id,
  lockUser = {},
  locked = false,
  onEditComplete,
  onEditCancel,
  status,
  tabIndex,
  title,
  titleLink,
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

  const storyLockedTitle = showLockIcon && (
    <Tooltip
      position={TOOLTIP_PLACEMENT.BOTTOM_START}
      title={
        lockUser.avatar && (
          <AvatarTooltip>
            <LockAvatar
              src={lockUser.avatar}
              alt={lockUser.name}
              height={24}
              width={24}
            />
            {lockUser?.name}
          </AvatarTooltip>
        )
      }
    >
      <LockIcon />
      <DetailCopy>
        {lockUser.name &&
          sprintf(
            /* translators: %s: user name */
            __('%s is currently editing', 'web-stories'),
            lockUser.name
          )}
      </DetailCopy>
    </Tooltip>
  );
  return (
    <StyledStoryDisplayContent>
      {showLockIcon && <Row>{storyLockedTitle}</Row>}
      {editMode ? (
        <InlineInputForm
          onEditComplete={onEditComplete}
          onEditCancel={onEditCancel}
          value={title}
          id={id}
          label={__('Rename story', 'web-stories')}
          isInverted
        />
      ) : (
        <Row>
          <Title
            href={titleLink}
            tabIndex={tabIndex}
            aria-label={sprintf(
              /* translators: %s: title*/
              __('Open %s in editor', 'web-stories'),
              title
            )}
          >
            {formattedTitle}
          </Title>
        </Row>
      )}
      <CardDetailsGrid>
        <CardDetailsColumn>
          <DetailCopy>
            {status === STORY_STATUS.DRAFT && __('Draft', 'web-stories')}
          </DetailCopy>
          {author && <DetailCopy>{author}</DetailCopy>}
          <DetailCopy className="dashboard-grid-item-date">
            {displayDateText}
          </DetailCopy>
        </CardDetailsColumn>
        <CardDetailsColumn>{contextMenu}</CardDetailsColumn>
      </CardDetailsGrid>
    </StyledStoryDisplayContent>
  );
};

StoryDisplayContent.propTypes = {
  author: PropTypes.string,
  contextMenu: PropTypes.node,
  displayDate: PropTypes.string,
  editMode: PropTypes.bool,
  formattedTitle: PropTypes.string.isRequired,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  lockUser: PropTypes.object,
  locked: PropTypes.bool,
  onEditComplete: PropTypes.func,
  onEditCancel: PropTypes.func,
  tabIndex: PropTypes.number,
  title: PropTypes.string.isRequired,
  titleLink: PropTypes.string,
  status: DashboardStatusesPropType,
};

export default StoryDisplayContent;
