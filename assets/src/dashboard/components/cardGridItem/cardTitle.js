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

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { STORY_STATUS } from '../../constants';
import { titleFormatted } from '../../utils';
import { DashboardStatusesPropType } from '../../types';
import { Paragraph2 } from '../typography';
import InlineInputForm from '../inlineInputForm';
import { Link } from '../link';

const StyledCardTitle = styled.div`
  padding-top: 12px;
  display: inline-block;
  overflow: hidden;
`;

const TitleStoryLink = styled(Link)`
  display: inline-block;
  max-width: 100%;
  margin-bottom: 2px;
  color: ${({ theme }) => theme.DEPRECATED_THEME.colors.gray900};
  font-weight: ${({ theme }) => theme.DEPRECATED_THEME.typography.weight.bold};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TitleBodyText = styled(Paragraph2)`
  margin: 0;
  color: ${({ theme }) => theme.DEPRECATED_THEME.colors.gray500};
  font-weight: ${({ theme }) => theme.DEPRECATED_THEME.typography.weight.light};
`;

const DateHelperText = styled.span`
  text-transform: uppercase;
  font-weight: 500;
  color: ${({ theme }) => theme.DEPRECATED_THEME.colors.gray900};
  &:after {
    content: '-';
    color: ${({ theme }) => theme.DEPRECATED_THEME.colors.gray500};
    font-weight: 400;
    padding: 0 0.25em;
  }
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
}) => {
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

  return (
    <StyledCardTitle>
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
      <TitleBodyText className="dashboard-grid-item-date">
        {status === STORY_STATUS.DRAFT && (
          <DateHelperText>{__('draft', 'web-stories')}</DateHelperText>
        )}
        {displayDateText}
      </TitleBodyText>
      {secondaryTitle && <TitleBodyText>{secondaryTitle}</TitleBodyText>}
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
  displayDate: PropTypes.string,
  onEditComplete: PropTypes.func,
  onEditCancel: PropTypes.func,
  tabIndex: PropTypes.number,
};

export default CardTitle;
