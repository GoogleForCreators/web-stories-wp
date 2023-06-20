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
import { useState } from '@googleforcreators/react';
import styled from 'styled-components';
import {
  AnimationDirection,
  Rotation,
  ScaleDirection,
} from '@googleforcreators/animation';

/**
 * Internal dependencies
 */
import { DirectionRadioInput } from '../directionRadioInput';

export default {
  title: 'Stories Editor/Components/Panels/Animations/Direction Radio Input',
  component: DirectionRadioInput,
};

const Panel = styled.div`
  padding: 20px;
  background-color: #1c1c1c;
`;

export const _default = {
  render: function Render() {
    return (
      <Panel>
        <DirectionRadioInput
          directions={Object.values(AnimationDirection)}
          defaultChecked={AnimationDirection.TopToBottom}
        />
      </Panel>
    );
  },
};

export const WithRotation = {
  render: function Render() {
    return (
      <Panel>
        <DirectionRadioInput
          directions={[Rotation.Clockwise, Rotation.CounterClockwise]}
          defaultChecked={Rotation.Clockwise}
        />
      </Panel>
    );
  },
};

export const Scale = {
  render: function Render() {
    const [value, setValue] = useState(ScaleDirection.ScaleIn);
    return (
      <Panel>
        <DirectionRadioInput
          value={value}
          onChange={({ target }) => setValue(target.value)}
          directions={[ScaleDirection.ScaleIn, ScaleDirection.ScaleOut]}
          defaultChecked={ScaleDirection.ScaleIn}
        />
      </Panel>
    );
  },
};
