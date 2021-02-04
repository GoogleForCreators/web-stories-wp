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
import { useState } from 'react';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import {
  DIRECTION,
  ROTATION,
  SCALE_DIRECTION,
} from '../../../../../../animation';
import { DirectionRadioInput } from '../directionRadioInput';

export default {
  title: 'Animations/Direction Radio Input',
  component: DirectionRadioInput,
};

const Panel = styled.div`
  padding: 20px;
  background-color: #1c1c1c;
`;

export const _default = () => {
  return (
    <Panel>
      <DirectionRadioInput
        directions={Object.values(DIRECTION)}
        defaultChecked={DIRECTION.TOP_TO_BOTTOM}
      />
    </Panel>
  );
};

export const Rotation = () => {
  return (
    <Panel>
      <DirectionRadioInput
        directions={[ROTATION.CLOCKWISE, ROTATION.COUNTER_CLOCKWISE]}
        defaultChecked={ROTATION.CLOCKWISE}
      />
    </Panel>
  );
};

export const Scale = () => {
  const [value, setValue] = useState(SCALE_DIRECTION.SCALE_IN);
  return (
    <Panel>
      <DirectionRadioInput
        value={value}
        onChange={({ target }) => setValue(target.value)}
        directions={[SCALE_DIRECTION.SCALE_IN, SCALE_DIRECTION.SCALE_OUT]}
        defaultChecked={SCALE_DIRECTION.SCALE_IN}
      />
    </Panel>
  );
};
