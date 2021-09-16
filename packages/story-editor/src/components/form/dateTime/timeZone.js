/*
 * Copyright 2021 Google LLC
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
import { getSettings, getOptions, format } from '@web-stories-wp/date';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { __ } from '@web-stories-wp/i18n';
import {
  PLACEMENT,
  Text,
  THEME_CONSTANTS,
} from '@web-stories-wp/design-system';

/**
 * Internal dependencies
 */
import Tooltip from '../../tooltip';

const Wrapper = styled.div`
  white-space: nowrap;
`;

const StyledText = styled(Text)`
  color: ${({ theme }) => theme.colors.fg.tertiary};
  line-height: 30px;
`;

function TimeZone({ date }) {
  const { timezone, gmtOffset } = getSettings();

  // Convert timezone offset to hours.
  const userTimezoneOffset = -1 * (new Date().getTimezoneOffset() / 60);

  // System timezone and user timezone match, nothing needed.
  // Compare as numbers because it comes over as string.
  if (Number(gmtOffset) === userTimezoneOffset) {
    return null;
  }

  const { timeZone: timeZoneString } = getOptions();
  const zoneAbbr = timezone?.length
    ? format(date, 'T')
    : `UTC${timeZoneString}`;

  const tooltip =
    'UTC' === zoneAbbr
      ? __('Coordinated Universal Time', 'web-stories')
      : timezone;

  return (
    <Wrapper>
      <Tooltip hasTail title={tooltip} placement={PLACEMENT.TOP}>
        <StyledText
          forwardedAs="span"
          size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL}
        >
          {zoneAbbr}
        </StyledText>
      </Tooltip>
    </Wrapper>
  );
}

TimeZone.propTypes = {
  date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)])
    .isRequired,
};

export default TimeZone;
