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
import { useRef, useCallback, useState } from 'react';

/**
 * Internal dependencies
 */
import useAverageColor from './useAverageColor';

const Image = styled.img`
  display: block;
  ${({ isTooBright }) =>
    isTooBright &&
    `
    /* Using filter rather than box-shadow to correctly follow
     * outlines in semi-transparent images like gif and png.
     */
    filter: drop-shadow( 0 0 5px rgba(0, 0, 0, 0.5) );
  `}
`;

const TOO_BRIGHT = 230;

function VisibleImage({ ...attrs }) {
  const ref = useRef();
  const [isTooBright, setIsTooBright] = useState(false);

  const handleBrightness = useCallback((averageColor) => {
    const darkestDimension = Math.min.apply(null, averageColor);
    setIsTooBright(darkestDimension >= TOO_BRIGHT);
  }, []);

  useAverageColor(ref, handleBrightness);

  return <Image ref={ref} {...attrs} isTooBright={isTooBright} />;
}

export default VisibleImage;
