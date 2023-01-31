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
import { Text } from '../../components';
import * as Images from '..';

export default {
  title: 'DesignSystem/Images',
};

const ImageList = styled.ul`
  list-style-type: none;
  display: flex;
  flex-direction: column;
  padding: 24px;
  width: 300px;

  li {
    margin: 20px 0;
  }
`;

export const Default = () => {
  return (
    <ImageList>
      {Object.keys(Images).map((imageName) => {
        // eslint-disable-next-line import/namespace
        const Image = Images[imageName];
        return (
          <li key={imageName}>
            <Image />
            <Text.Span isBold>{imageName}</Text.Span>
          </li>
        );
      })}
    </ImageList>
  );
};
