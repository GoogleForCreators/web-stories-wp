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

/**
 * Internal dependencies
 */
import { useConfig } from '../config';

interface ImgProps {
  $rotationAngle: string;
}

interface ImageProps {
  name: string;
  name2x: string;
  width: number;
  height: number;
}

const Img = styled.img<ImgProps>`
  transform: rotate(${(props) => props.$rotationAngle});
  margin-top: 60px;
`;

function Image({ name, name2x, ...props }: ImageProps) {
  const { cdnURL, isRTL } = useConfig();
  return (
    <Img
      src={`${cdnURL}images/plugin-activation/${name}`}
      srcSet={`${cdnURL}images/plugin-activation/${name}, ${cdnURL}images/plugin-activation/${name2x} 2x`}
      alt=""
      $rotationAngle={isRTL ? '-30deg' : '30deg'}
      {...props}
    />
  );
}

export default Image;
