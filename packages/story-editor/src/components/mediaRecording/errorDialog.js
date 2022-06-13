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
import styled, { ThemeProvider } from 'styled-components';
import {
  Icons,
  lightMode,
  theme as dsTheme,
} from '@googleforcreators/design-system';
import { __, sprintf } from '@googleforcreators/i18n';

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
import useMediaRecording from './useMediaRecording';

const StyledHeading = styled(MessageHeading)`
  display: flex;
  align-items: center;
`;

function ErrorMessage({ error, hasVideo }) {
  let errorMessage = error?.message;

  // Use some more human-readable error messages for most common scenarios.
  // See https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia#exceptions
  if (error?.name === 'NotAllowedError') {
    errorMessage = __('Permission denied', 'web-stories');
  } else if (
    !hasVideo ||
    error?.name === 'NotFoundError' ||
    error?.name === 'OverConstrainedError'
  ) {
    errorMessage = __('No camera found', 'web-stories');
  }

  return (
    <MessageWrap>
      <ThemeProvider theme={{ ...dsTheme, colors: lightMode }}>
        <StyledHeading>
          <Icons.ExclamationTriangle size={32} height={32} aria-hidden />
          {__('Error', 'web-stories')}
        </StyledHeading>
        <MessageText>
          {__('Could not initialize recording.', 'web-stories')}
        </MessageText>
        {errorMessage && (
          <MessageText>
            {sprintf(
              /* translators: %s: error message. */
              __('Reason: %s', 'web-stories'),
              errorMessage
            )}
          </MessageText>
        )}
      </ThemeProvider>
    </MessageWrap>
  );
}

ErrorMessage.propTypes = {
  error: PropTypes.shape({
    name: PropTypes.string,
    message: PropTypes.string,
  }),
  hasVideo: PropTypes.bool.isRequired,
};

function ErrorDialog() {
  const { error, hasVideo } = useMediaRecording(({ state }) => ({
    error: state.error,
    hasVideo: Boolean(state.videoInput),
  }));
  return (
    <LayerWithGrayout>
      <DisplayPageArea withSafezone={false} showOverflow>
        <Wrapper>
          <ErrorMessage error={error} hasVideo={hasVideo} />
        </Wrapper>
      </DisplayPageArea>
    </LayerWithGrayout>
  );
}

export default ErrorDialog;
