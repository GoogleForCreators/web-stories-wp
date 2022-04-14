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
import { __ } from '@googleforcreators/i18n';
import styled from 'styled-components';
import { useState } from '@googleforcreators/react';
import {
  blobToFile,
  getImageFromVideo,
  createBlob,
} from '@googleforcreators/media';
import PropTypes from 'prop-types';
import {
  Button,
  BUTTON_TYPES,
  BUTTON_SIZES,
} from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { MEDIA_POSTER_IMAGE_MIME_TYPE } from '../../../../../../constants/media';

const Photo = styled.img`
  display: block;
  width: 240px;
  margin: 0 auto;
`;

const Actions = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

export const ImageCapture = ({ videoRef, onCapture, onClear }) => {
  const [src, setSrc] = useState('');

  const clear = () => {
    setSrc('');
    onClear();
  };

  const captureImage = async () => {
    if (!videoRef.current) {
      return;
    }
    const blob = await getImageFromVideo(videoRef.current);
    const imageSrc = await createBlob(blob);
    setSrc(imageSrc);
    onCapture(
      blobToFile(blob, 'image-capture.jpeg', MEDIA_POSTER_IMAGE_MIME_TYPE)
    );
  };

  return (
    <>
      {src && <Photo src={src} alt={__('Image capture', 'web-stories')} />}
      <Actions>
        <Button
          type={BUTTON_TYPES.PRIMARY}
          size={BUTTON_SIZES.SMALL}
          onClick={captureImage}
          disabled={onClear !== null}
        >
          {__('Capture Image', 'web-stories')}
        </Button>
        <Button
          type={BUTTON_TYPES.TERTIARY}
          size={BUTTON_SIZES.SMALL}
          onClick={clear}
          disabled={onClear === null}
        >
          {__('Clear Image', 'web-stories')}
        </Button>
      </Actions>
    </>
  );
};

ImageCapture.propTypes = {
  videoRef: PropTypes.shape({
    current:
      typeof Element !== 'undefined'
        ? PropTypes.instanceOf(Element)
        : PropTypes.any,
  }), // To handle SSR
  onCapture: PropTypes.func.isRequired,
  onClear: PropTypes.oneOfType([PropTypes.func], null),
};
