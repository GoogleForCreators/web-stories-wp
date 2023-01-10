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
import { forwardRef } from '@googleforcreators/react';
import type { ForwardedRef } from 'react';
import styled from 'styled-components';
import { __ } from '@googleforcreators/i18n';

/**
 * Internal dependencies
 */
import { CheckmarkSmall } from '../../../icons';
import { TextSize } from '../../../theme';
import type { DefaultListItemProps } from '../types';
import { ListItem, ListItemDisplayText } from './components';

const ActiveIcon = styled(CheckmarkSmall)`
  position: absolute;
  left: 4px;
  top: 50%;
  transform: translateY(-50%);
`;

const DefaultListItem = forwardRef(function DefaultListItem(
  { option, isSelected, ...rest }: DefaultListItemProps,
  ref: ForwardedRef<HTMLLIElement>
) {
  return (
    <ListItem
      {...rest}
      ref={ref}
      disabled={option.disabled}
      aria-disabled={option.disabled}
    >
      {isSelected && (
        <ActiveIcon
          data-testid={'dropdownMenuItem_active_icon'}
          aria-label={__('Selected', 'web-stories')}
          width={32}
          height={32}
        />
      )}
      <ListItemDisplayText size={TextSize.Small}>
        {option.label}
      </ListItemDisplayText>
    </ListItem>
  );
});

export default DefaultListItem;
