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
import { ThemeProvider } from 'styled-components';
import {
  lightMode,
  theme as dsTheme,
  THEME_CONSTANTS,
} from '@googleforcreators/design-system';
import { __ } from '@googleforcreators/i18n';

/**
 * Internal dependencies
 */
import SettingsModal from './settingsModal';
import {
  DisplayPageArea,
  LayerWithGrayout,
  Wrapper,
  MessageWrap,
  MessageText,
  MessageHeading,
} from './components';

function IntroMessage() {
  return (
    <MessageWrap>
      <ThemeProvider theme={{ ...dsTheme, colors: lightMode }}>
        <MessageHeading size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
          {__('Media Recording', 'web-stories')}
        </MessageHeading>

        <MessageText size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
          {__(
            'To get started, you need to allow access to your camera and micrphone.',
            'web-stories'
          )}
        </MessageText>
      </ThemeProvider>
    </MessageWrap>
  );
}

function PermissionsDialog() {
  return (
    <>
      <LayerWithGrayout>
        <DisplayPageArea withSafezone={false} showOverflow>
          <Wrapper>
            <IntroMessage />
          </Wrapper>
        </DisplayPageArea>
      </LayerWithGrayout>
      <SettingsModal />
    </>
  );
}

export default PermissionsDialog;
