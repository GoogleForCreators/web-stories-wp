/*
 * Copyright 2022 Google LLC
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
  ScaleDirection,
  AnimationDirection,
} from '@googleforcreators/animation';

/**
 * Internal dependencies
 */
import { EffectChooserDropdown } from '../effectChooserDropdown';
import {
  backgroundEffectOptions,
  foregroundEffectOptions,
} from '../effectChooserDropdown/dropdownConstants';

const allEffectTypes = [
  ...Object.keys(foregroundEffectOptions),
  ...Object.keys(backgroundEffectOptions),
];
const allDirections = [
  ...Object.values(AnimationDirection),
  ...Object.values(ScaleDirection),
];

export default {
  title: 'Stories Editor/Components/Panels/Animations/Effect Chooser',
  component: EffectChooserDropdown,
  args: {
    isBackgroundEffects: false,
  },
  argTypes: {
    selectedEffectType: {
      options: allEffectTypes,
      control: 'select',
    },
    direction: {
      options: allDirections,
      control: 'select',
    },
    onAnimationSelected: { action: 'onAnimationSelected' },
    onNoEffectSelected: { action: 'onNoEffectSelected' },
  },
};

const Container = styled.div`
  width: 276px;
  margin: 25vh 30px 0;
`;
export const _default = (args) => {
  return (
    <Container>
      <EffectChooserDropdown
        onAnimationSelected={(sender) => args.onAnimationSelected(sender)}
        onNoEffectSelected={() => args.onNoEffectSelected}
        disabledTypeOptionsMap={[]}
        {...args}
      />
    </Container>
  );
};
