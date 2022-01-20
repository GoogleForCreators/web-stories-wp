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
import { action } from '@storybook/addon-actions';
import { boolean, select } from '@storybook/addon-knobs';
import styled from 'styled-components';
import { SCALE_DIRECTION, DIRECTION } from '@googleforcreators/animation';

/**
 * Internal dependencies
 */
import { EffectChooserDropdown } from '../effectChooserDropdown';
import {
  backgroundEffectOptions,
  foregroundEffectOptions,
} from '../effectChooserDropdown/dropdownConstants';

export default {
  title: 'Stories Editor/Components/Panels/Animations/Effect Chooser',
  component: EffectChooserDropdown,
};

const Container = styled.div`
  width: 276px;
  margin: 25vh 30px 0;
`;
export const _default = () => {
  const allEffectTypes = [
    ...Object.keys(foregroundEffectOptions),
    ...Object.keys(backgroundEffectOptions),
  ];
  const allDirections = [
    ...Object.values(DIRECTION),
    ...Object.values(SCALE_DIRECTION),
  ];
  return (
    <Container>
      <EffectChooserDropdown
        onAnimationSelected={(sender) => action('onAnimationSelected', sender)}
        onNoEffectSelected={() => action('onNoEffectSelected')}
        isBackgroundEffects={boolean('isBackgroundEffects', false)}
        selectedEffectType={select('selectedEffectType', allEffectTypes)}
        disabledTypeOptionsMap={[]}
        direction={select('direction', allDirections)}
      />
    </Container>
  );
};
