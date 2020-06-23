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
import { object } from '@storybook/addon-knobs';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import Presets from '../presets';
import createSolid from '../../../../utils/createSolid';

export default {
  title: 'Stories Editor/Components/Style Presets',
  component: Presets,
  parameters: {
    backgrounds: {
      default: 'Dark',
    },
  },
};

const Wrapper = styled.div`
  max-width: 300px;
`;

export const _default = () => {
  const stylePresets = object('Presets', {
    colors: [
      createSolid(255, 255, 255, 0.5),
      createSolid(255, 0, 0, 0.9),
      createSolid(255, 255, 0, 0.8),
      createSolid(255, 0, 255, 0.5),
      createSolid(0, 255, 0, 1),
      createSolid(0, 255, 255, 1),
      createSolid(0, 0, 0, 0.7),
      createSolid(0, 0, 255, 0.7),
    ],
  });

  return (
    <Wrapper>
      <Presets
        stylePresets={stylePresets}
        handlePresetClick={() => {}}
        isEditMode={false}
        isText={true}
        textContent={'Hello, World!'}
      />
    </Wrapper>
  );
};
