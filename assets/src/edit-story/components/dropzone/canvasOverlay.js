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
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
/**
 * Internal dependencies
 */
/**
 * External dependencies
 */
import styled from 'styled-components';
import { useConfig } from '../../app/config';
import StoryPropTypes from '../../types';
import useDropZone from './useDropZone';
import { Icon, OverContent } from './shared';
const Overlay = styled.div`
  position: absolute;
  top: 25%;
  text-align: center;
  width: 80%;
  z-index: 999;
  left: 10%;
  right: 10%;
`;
const Heading = styled.h4`
  color: ${({ theme }) => theme.colors.fg.v0};
  margin: 0;
`;
const Text = styled.p`
  color: ${({ theme }) => theme.colors.fg.v0};
`;
function CanvasOverlay({ children }) {
  const {
    state: { isDragging },
  } = useDropZone();

  const { allowedFileTypes } = useConfig();

  return (
    <>
      {isDragging && (
        <Overlay>
          <Icon />
          <Heading>
            {__('Upload to media library and add to the page.', 'web-stories')}
          </Heading>
          <Text>
            {sprintf(
              /* translators: %s is a list of allowed file extensions. */
              __('You can upload %s.', 'web-stories'),
              allowedFileTypes.join(', ')
            )}
          </Text>
        </Overlay>
      )}
      <OverContent>{children}</OverContent>
    </>
  );
}

CanvasOverlay.propTypes = {
  children: StoryPropTypes.children.isRequired,
};

export default CanvasOverlay;
