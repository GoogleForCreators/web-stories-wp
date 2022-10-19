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
import { getSettings } from '@googleforcreators/date';
import styled from 'styled-components';
import { __ } from '@googleforcreators/i18n';
import {
  PLACEMENT,
  Text,
  THEME_CONSTANTS,
} from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import Tooltip from '../../tooltip';
import { Z_INDEX_TIME_PICKER_TOOLTIP } from '../../../constants/zIndex';

const Wrapper = styled.div`
  white-space: nowrap;
`;

const StyledText = styled(Text)`
  color: ${({ theme }) => theme.colors.fg.tertiary};
  line-height: 30px;
`;

function TimeZone() {
  const { timezone, gmtOffset, timezoneAbbr } = getSettings();

  // Convert timezone offset to hours.
  const userTimezoneOffset = -1 * (new Date().getTimezoneOffset() / 60);

  // System timezone and user timezone match, nothing needed.
  // Compare as numbers because it comes over as string.
  if (Number(gmtOffset) === userTimezoneOffset) {
    return null;
  }

  const offsetSymbol = Number(gmtOffset) >= 0 ? '+' : '';
  const zoneAbbr =
    '' !== timezoneAbbr && Number.isNaN(Number(timezoneAbbr))
      ? timezoneAbbr
      : `UTC${offsetSymbol}${gmtOffset}`;

  const tooltip =
    'UTC' === timezone
      ? __('Coordinated Universal Time', 'web-stories')
      : `(${zoneAbbr}) ${timezone.replace('_', ' ')}`;

  return (
    <Wrapper>
      <Tooltip
        hasTail
        title={tooltip}
        placement={PLACEMENT.TOP}
        popupZIndexOverride={Z_INDEX_TIME_PICKER_TOOLTIP}
      >
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

export default TimeZone;
