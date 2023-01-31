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
  ButtonSize,
  ButtonType,
  ButtonVariant,
  Icons,
} from '@googleforcreators/design-system';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { focusStyle } from '../../../../../panels/shared/styles';
import Tooltip from '../../../../../tooltip';
import HotlinkModal from '../../../../../hotlinkModal';
import useInsert from './useInsert';

const Button = styled(DefaultButton)`
  ${focusStyle};
  margin: 0 10px 0 0;
`;

function Hotlink() {
  const label = __('Insert by link', 'web-stories');
  const {
    action: { onSelect, onError, onClose, onClick },
    state: { allowedFileTypes, isOpen },
  } = useInsert();
  return (
    <>
      <Tooltip title={label}>
        <Button
          variant={ButtonVariant.Square}
          type={ButtonType.Secondary}
          size={ButtonSize.Small}
          onClick={onClick}
          aria-label={label}
        >
          <Icons.Link />
        </Button>
      </Tooltip>
      <HotlinkModal
        onClose={onClose}
        isOpen={isOpen}
        onError={onError}
        onSelect={onSelect}
        allowedFileTypes={allowedFileTypes}
        title={__('Insert external image or video', 'web-stories')}
      />
    </>
  );
}

export default Hotlink;
