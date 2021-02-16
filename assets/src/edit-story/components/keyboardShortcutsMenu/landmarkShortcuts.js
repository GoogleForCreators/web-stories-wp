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
import { Fragment } from 'react';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { Text, THEME_CONSTANTS } from '../../../design-system';
import useKeyboardShortcuts from './getKeyboardShortcuts';
import ShortcutLabel from './shortcutLabel';

const LandmarksWrapper = styled.dl`
  background-color: ${({ theme }) => theme.colors.bg.secondary};
  margin: 0;
  padding: 16px 24px;
  display: flex;
  justify-items: space-between;
`;

const Landmark = styled.div`
  display: flex;
  flex-direction: column-reverse;
`;

const Label = styled(Text).attrs({
  size: THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL,
})`
  text-align: center;
  margin-top: 8px;
  white-space: nowrap;
`;

const Space = styled.span`
  width: 36px;
`;

function LandmarkShortcuts() {
  const { landmarks } = useKeyboardShortcuts();

  return (
    <LandmarksWrapper role="group">
      {landmarks.map(({ label, shortcut }, index) => (
        <Fragment key={label}>
          <Landmark role="listitem">
            <Label>{label}</Label>
            <ShortcutLabel keys={shortcut} />
          </Landmark>
          {index < landmarks.length - 1 && <Space />}
        </Fragment>
      ))}
    </LandmarksWrapper>
  );
}

export default LandmarkShortcuts;
