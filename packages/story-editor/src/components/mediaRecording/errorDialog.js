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
import PropTypes from 'prop-types';
import { ThemeProvider } from 'styled-components';
import {
  Icons,
  lightMode,
  theme as dsTheme,
  THEME_CONSTANTS,
} from '@googleforcreators/design-system';
import { __ } from '@googleforcreators/i18n';

/**
 * Internal dependencies
 */
import {
  MessageWrap,
  MessageText,
  MessageHeading,
  LayerWithGrayout,
  DisplayPageArea,
  Wrapper,
} from './components';
import SettingsModal from './settingsModal';
import useMediaRecording from './useMediaRecording';

function ErrorMessage({ error }) {
  return (
    <MessageWrap>
      <Icons.ExclamationTriangle />
      <ThemeProvider theme={{ ...dsTheme, colors: lightMode }}>
        <MessageHeading size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
          {__('Error', 'web-stories')}
        </MessageHeading>
        <MessageText size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
          {__('Could not initialize recording', 'web-stories')}
        </MessageText>
        {error && (
          <MessageText size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
            {error.message}
          </MessageText>
        )}
      </ThemeProvider>
    </MessageWrap>
  );
}

ErrorMessage.propTypes = {
  error: PropTypes.shape({
    message: PropTypes.string,
  }),
};

function ErrorDialog() {
  const { error } = useMediaRecording(({ state }) => ({
    error: state.error,
  }));
  return (
    <>
      <LayerWithGrayout>
        <DisplayPageArea withSafezone={false} showOverflow>
          <Wrapper>
            <ErrorMessage error={error} />
          </Wrapper>
        </DisplayPageArea>
      </LayerWithGrayout>
      <SettingsModal />
    </>
  );
}

export default ErrorDialog;
