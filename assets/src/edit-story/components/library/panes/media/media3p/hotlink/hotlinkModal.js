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
import { useState, useCallback } from 'react';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { useConfig } from '../../../../../../app';
import Dialog from '../../../../../dialog';
import useLibrary from '../../../../useLibrary';

const InputWrapper = styled.div`
  margin: 16px 4px;
  width: 470px;
  height: 100px;
`;

function HotlinkModal({ isOpen, onClose }) {
  const { allowedFileTypes } = useConfig();
  const { insertElement } = useLibrary((state) => ({
    insertElement: state.actions.insertElement,
  }));

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
  const [link, setLink] = useState(
    'https://s3.amazonaws.com/cdn-origin-etr.akc.org/wp-content/uploads/2017/11/31120612/French-Bulldog-laying-down-in-the-grass.jpg'
  );

  const getFileInfo = useCallback(
    (value = link) => {
      const ext = value.split(/[#?]/)[0].split('.').pop().trim();
      if (!allowedFileTypes.includes(ext)) {
        setHasError(true);
      } else {
        setHasError(false);
      }
      return {
        ext,
        type: ['m4v', 'mp4'].includes(ext) ? 'video' : 'image',
      };
    },
    [link, allowedFileTypes]
  );

  const onInsert = useCallback(() => {
    /*const img = document.createElement('img');
    img.crossOrigin = 'anonymous';
    img.addEventListener('load', function () {
      console.log(img);
      console.log(img.naturalHeight, img.naturalWidth);
    });
    img.src = link + '?cancel-cache=1';*/
    if (hasError) {
      return;
    }
    const { type } = getFileInfo();
    insertElement(type, {
      resource: { alt: '', id: 'test', width: 300, height: 300 },
    });
  }, [insertElement, link, hasError, getFileInfo]);

  return (
    <Dialog
      onClose={onClose}
      isOpen={isOpen}
      title={__('Insert link', 'web-stories')}
      onPrimary={() => onInsert()}
      primaryText={__('Insert', 'web-stories')}
      secondaryText={__('Cancel', 'web-stories')}
    >
      <InputWrapper>
        <Input
          onChange={({ target: { value } }) => {
            setLink(value);
            getFileInfo(value);
          }}
          value={link}
          hint={hasError ? error : description}
          hasError={hasError}
        />
      </InputWrapper>
    </Dialog>
  );
}

export default HotlinkModal;
