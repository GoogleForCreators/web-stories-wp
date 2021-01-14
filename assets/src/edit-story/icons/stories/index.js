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
import Lottie from 'react-lottie';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import * as Icons from '..';
import dragAnimationData from '../dragAnimation';

export default {
  title: 'Stories Editor/Icons',
  component: Icons,
};

const IconsList = styled.ul`
  color: ${({ theme }) => theme.colors.grayout};
  list-style-type: none;
  li {
    padding: 10px 0;
  }
  svg {
    height: 1em;
    width: 1em;
    margin-right: 10px;
  }
`;

export const _default = () => {
  return (
    <IconsList>
      {Object.keys(Icons).map((iconName) => {
        // eslint-disable-next-line import/namespace
        const Icon = Icons[iconName];
        return (
          <li key={iconName}>
            <Icon />
            {iconName}
          </li>
        );
      })}
    </IconsList>
  );
};

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: dragAnimationData,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
};

export const dragAnimation = () => {
  return <Lottie options={defaultOptions} height={400} width={400} />;
};
