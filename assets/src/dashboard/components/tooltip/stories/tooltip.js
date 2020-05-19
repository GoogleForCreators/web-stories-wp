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
import { text, select } from '@storybook/addon-knobs';

/**
 * Internal dependencies
 */
import styled from 'styled-components';
import Tooltip from '../';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default {
  title: 'Dashboard/Components/Tooltip',
  component: Tooltip,
};

export const _default = () => {
  const positionValues = {
    left: 'left',
    right: 'right',
    center: 'center',
  };
  const position = select('Position', positionValues, 'left');
  return (
    <Container>
      <Tooltip
        position={position}
        content={text('tooltipContent', 'Tooltip Content')}
      >
        <button>{text('buttonTitle', 'Hover Over Me')}</button>
      </Tooltip>
    </Container>
  );
};
