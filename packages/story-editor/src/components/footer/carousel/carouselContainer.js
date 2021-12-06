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
import {
  memo,
  useRef,
  useState,
  useResizeEffect,
} from '@googleforcreators/react';

/**
 * Internal dependencies
 */
import CarouselLayout from './carouselLayout';
import CarouselProvider from './carouselProvider';

const Wrapper = styled.div`
  height: auto;
  width: 100%;
  align-self: flex-end;
`;

function CarouselContainer() {
  const ref = useRef();
  const [carouselWidth, setCarouselWidth] = useState(0);

  useResizeEffect(ref, ({ width }) => setCarouselWidth(width), []);

  return (
    <CarouselProvider availableSpace={carouselWidth}>
      <Wrapper ref={ref}>
        <CarouselLayout />
      </Wrapper>
    </CarouselProvider>
  );
}

// Don't rerender the carousel container needlessly e.g. on element selection change.
export default memo(CarouselContainer);
