/*
 * Copyright 2022 Google LLC
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
import { useCallback, useEffect, useMemo } from 'react';
import { Pill } from '@googleforcreators/design-system';
import { __, sprintf } from '@googleforcreators/i18n';
import styled from 'styled-components';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import useStoryFilters from '../filters/useStoryFilters';
import { STORY_STATUS, STORY_STATUSES } from '../../../../constants';
import { TotalStoriesByStatusPropType } from '../../../../types';

const StyledPill = styled(Pill)`
  margin: 0 2px;
  white-space: nowrap;

  & > span {
    padding-left: 8px;
    color: ${({ theme, isActive }) =>
      isActive ? theme.colors.gray[20] : theme.colors.fg.tertiary};
  }
`;

function StoryStatusToggle({
  initialPageReady,
  totalStoriesByStatus,
  currentStatus,
}) {
  const { updateFilter, registerFilters } = useStoryFilters(
    ({ actions: { updateFilter, registerFilters } }) => ({
      updateFilter,
      registerFilters,
    })
  );

  const handleStatusChange = useCallback(
    (value) => {
      if (currentStatus !== value) {
        updateFilter('status', { filterId: value });
      }
    },
    [currentStatus, updateFilter]
  );

  useEffect(() => {
    registerFilters([
      {
        key: 'status',
        filterId: STORY_STATUS.ALL,
      },
    ]);
  }, [registerFilters]);

  /**
   * The total stories based on the given filters
   */
  const totalStories = useMemo(
    () =>
      Object.keys(totalStoriesByStatus).reduce(
        (prev, cur) => prev + totalStoriesByStatus[cur],
        0
      ),
    [totalStoriesByStatus]
  );

  /**
   * Set up the status data for the UI.
   * Only show statuses that correlate to the filtered stories, and the current status.
   */
  const statuses = useMemo(() => {
    return STORY_STATUSES.filter(({ status }) => {
      return (
        (Boolean(status in totalStoriesByStatus) &&
          totalStoriesByStatus[status] > 0) ||
        status === currentStatus
      );
    }).map(({ label, status, value }) => {
      const count = totalStoriesByStatus[status];
      const disabled = Boolean(!count);
      const ariaLabel = sprintf(
        /* translators: %s is story status */
        __('Filter stories by %s', 'web-stories'),
        label
      );
      const isActive = currentStatus === value;
      return { ariaLabel, disabled, isActive, value, label, count };
    });
  }, [totalStoriesByStatus, currentStatus]);

  if (
    !initialPageReady ||
    !totalStories ||
    (totalStoriesByStatus && Object.keys(totalStoriesByStatus).length === 0)
  ) {
    return null;
  }

  return (
    <>
      {statuses.map(
        ({ ariaLabel, disabled, isActive, value, label, count }) => {
          return (
            <StyledPill
              key={value}
              onClick={() => handleStatusChange(value)}
              isActive={isActive}
              disabled={disabled}
              aria-label={ariaLabel}
            >
              {label}
              <span>{count}</span>
            </StyledPill>
          );
        }
      )}
    </>
  );
}

StoryStatusToggle.propTypes = {
  initialPageReady: PropTypes.bool,
  totalStoriesByStatus: TotalStoriesByStatusPropType,
  currentStatus: PropTypes.string,
};

export default StoryStatusToggle;
