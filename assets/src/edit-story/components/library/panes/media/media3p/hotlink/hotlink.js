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
import { __ } from '@web-stories-wp/i18n';
import {
  Button as DefaultButton,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
  Icons, lightMode, theme,
} from '@web-stories-wp/design-system';
import styled, {ThemeProvider} from 'styled-components';
import { useState } from 'react';

/**
 * Internal dependencies
 */
import { focusStyle } from '../../../../../panels/shared';
import Tooltip from '../../../../../tooltip';
import HotlinkModal from './hotlinkModal';

const Button = styled(DefaultButton)`
  ${focusStyle};
`;

function Hotlink() {
  const [isOpen, setIsOpen] = useState(false);
  const label = __('Insert by link', 'web-stories');
  return (
    <>
      <Tooltip title={label}>
        <Button
          variant={BUTTON_VARIANTS.SQUARE}
          type={BUTTON_TYPES.SECONDARY}
          size={BUTTON_SIZES.SMALL}
          onClick={() => setIsOpen(true)}
          label={label}
        >
          <Icons.Link />
        </Button>
      </Tooltip>
      <HotlinkModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}

export default Hotlink;
