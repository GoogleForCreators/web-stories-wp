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
import { __, sprintf, translateToExclusiveList } from '@web-stories-wp/i18n';
import { Input } from '@web-stories-wp/design-system';
import { useState } from 'react';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { useConfig } from '../../../../../../app';
import Dialog from '../../../../../dialog';

const InputWrapper = styled.div`
  margin: 16px 4px;
`;

function HotlinkModal({ isOpen, onClose }) {
  const { allowedFileTypes } = useConfig();
  const [hasError, setHasError] = useState(false);

  // @todo We're not really uploading anything here, so should we have a fixed list instead?
  let description = __('No file types are currently supported.', 'web-stories');
  if (allowedFileTypes.length) {
    description = sprintf(
      /* translators: %s is a list of allowed file extensions. */
      __('You can insert %s.', 'web-stories'),
      translateToExclusiveList(allowedFileTypes)
    );
  }
  const error = sprintf(
    /* translators: %s is the description with allowed file extensions. */
    __('Invalid link. %s', 'web-stories'),
    description
  );
  const [link, setLink] = useState('https://');
  return (
    <Dialog
      onClose={onClose}
      isOpen={isOpen}
      title={__('Insert link', 'web-stories')}
      onPrimary={() => console.log('heo')}
      primaryText={__('Insert', 'web-stories')}
      secondaryText={__('Cancel', 'web-stories')}
    >
      <InputWrapper>
        <Input
          onChange={({ target: { value } }) => setLink(value)}
          value={link}
          hint={hasError ? error : description}
          hasError={hasError}
        />
      </InputWrapper>
    </Dialog>
  );
}

export default HotlinkModal;
