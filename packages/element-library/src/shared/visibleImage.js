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
 * External dependencies
 */
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Image as RawImage } from '@googleforcreators/design-system';

const Image = styled(RawImage)`
  display: block;
  height: 21px;
  width: 21px;
  border-radius: ${({ theme }) => theme.borders.radius.small};
  object-fit: cover;
`;

function VisibleImage({ ...attrs }) {
  // The image is purely decorative by default, because the alt text is already used
  // for the layer description. Hence using alt="" to avoid repetition.
  return <Image alt="" {...attrs} />;
}

VisibleImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};

export default VisibleImage;
