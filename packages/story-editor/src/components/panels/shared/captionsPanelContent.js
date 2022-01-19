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
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import {
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
  Icons,
  Input,
  Text,
  THEME_CONSTANTS,
  themeHelpers,
} from '@web-stories-wp/design-system';
import { __ } from '@web-stories-wp/i18n';
import { ResourcePropTypes } from '@web-stories-wp/media';

/**
 * Internal dependencies
 */
import { Row } from '../../form';
import { MULTIPLE_DISPLAY_VALUE } from '../../../constants';
import Tooltip from '../../tooltip';
import { useConfig } from '../../../app/config';
import { focusStyle } from './styles';

const InputRow = styled.div`
  display: flex;
  flex-grow: 1;
  margin-right: 8px;
`;

const ErrorText = styled(Text).attrs({
  as: 'span',
  size: THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL,
})`
  color: ${({ theme }) => theme.colors.fg.negative};
`;

const StyledFileInput = styled(Input)(
  ({ hasMixedValue, theme }) => css`
    ${focusStyle};
    ${!hasMixedValue &&
    css`
      * > input:disabled {
        color: ${theme.colors.fg.primary};
      }
    `};
  `
);

const StyledButton = styled(Button)`
  ${({ theme }) =>
    themeHelpers.focusableOutlineCSS(
      theme.colors.border.focus,
      theme.colors.bg.secondary
    )};
`;

function CaptionsPanelContent({
  isMixedValue = false,
  tracks = [],
  captionText = __('Upload a file', 'web-stories'),
  handleChangeTrack,
  handleRemoveTrack,
  renderUploadButton,
  uploadError = false,
  clearFileText = __('Remove file', 'web-stories'),
}) {
  const { MediaUpload } = useConfig();
  return (
    <>
      {isMixedValue && (
        <Row>
          <StyledFileInput
            value={MULTIPLE_DISPLAY_VALUE}
            disabled
            aria-label={__('Filename', 'web-stories')}
            onChange={() => handleRemoveTrack()}
            hasMixedValue={isMixedValue}
          />
        </Row>
      )}
      {tracks &&
        !isMixedValue &&
        tracks.map(({ id, trackName }) => (
          <Row key={`row-filename-${id}`}>
            <InputRow>
              <StyledFileInput
                value={trackName}
                aria-label={__('Filename', 'web-stories')}
                onChange={() => handleRemoveTrack(id)}
                hasMixedValue={isMixedValue}
                disabled
              />
            </InputRow>
            <Tooltip hasTail title={clearFileText}>
              <StyledButton
                aria-label={clearFileText}
                type={BUTTON_TYPES.TERTIARY}
                size={BUTTON_SIZES.SMALL}
                variant={BUTTON_VARIANTS.SQUARE}
                onClick={() => handleRemoveTrack(id)}
              >
                <Icons.Trash />
              </StyledButton>
            </Tooltip>
          </Row>
        ))}
      {!tracks.length && (
        <>
          <Row expand>
            <MediaUpload
              onSelect={handleChangeTrack}
              onSelectErrorMessage={__(
                'Please choose a VTT file to use as caption.',
                'web-stories'
              )}
              type={['text/vtt']}
              title={captionText}
              buttonInsertText={__('Select caption', 'web-stories')}
              render={renderUploadButton}
            />
          </Row>
          {uploadError && (
            <Row expand>
              <ErrorText role="alert">
                {__('Upload error. Please try again', 'web-stories')}
              </ErrorText>
            </Row>
          )}
        </>
      )}
    </>
  );
}

CaptionsPanelContent.propTypes = {
  isMixedValue: PropTypes.bool,
  tracks: PropTypes.arrayOf(ResourcePropTypes.trackResource),
  captionText: PropTypes.string,
  clearFileText: PropTypes.string,
  handleChangeTrack: PropTypes.func,
  handleRemoveTrack: PropTypes.func,
  renderUploadButton: PropTypes.func,
  uploadError: PropTypes.bool,
};

export default CaptionsPanelContent;
