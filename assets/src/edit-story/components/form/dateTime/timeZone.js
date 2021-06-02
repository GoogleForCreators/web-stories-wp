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
import { getSettings, format } from '@web-stories-wp/date';
import getTimeZoneString from '@web-stories-wp/date/src/getTimeZoneString';
import PropTypes from 'prop-types';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import Tooltip from '../../tooltip';
import { PLACEMENT, Text, THEME_CONSTANTS } from '../../../../design-system';

const Wrapper = styled.div``;

const StyledText = styled(Text)`
  color: ${({ theme }) => theme.colors.fg.tertiary};
  line-height: 30px;
`;

function TimeZone({ date }) {
  const { timezone } = getSettings();

  const zoneAbbr = timezone?.length
    ? format(date, 'T')
    : `UTC${getTimeZoneString()}`;
  return (
    <Wrapper>
      <Tooltip hasTail title={timezone} placement={PLACEMENT.TOP}>
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
  date: PropTypes.string.isRequired,
};

export default TimeZone;
