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
import { __ } from '@googleforcreators/i18n';
import {
  Button as DefaultButton,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
  Icons,
} from '@googleforcreators/design-system';
import styled from 'styled-components';
import { useState } from '@googleforcreators/react';

/**
 * Internal dependencies
 */
import { focusStyle } from '../../../../../panels/shared/styles';
import Tooltip from '../../../../../tooltip';
import Modal from './modal';

const Button = styled(DefaultButton)`
  ${focusStyle};
  margin: 0 10px 0 0;
`;

const Camera = styled(Icons.Camera)`
  width: 24px !important;
  height: 24px !important;
`;

function MediaRecording() {
  const [isOpen, setIsOpen] = useState(false);
  const label = __('Record audio/video', 'web-stories');
  return (
    <>
      <Tooltip title={label}>
        <Button
          variant={BUTTON_VARIANTS.SQUARE}
          type={BUTTON_TYPES.SECONDARY}
          size={BUTTON_SIZES.SMALL}
          onClick={() => setIsOpen(true)}
          aria-label={label}
        >
          <Camera />
        </Button>
      </Tooltip>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}

export default MediaRecording;
