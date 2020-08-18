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
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * External dependencies
 */
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { ANIMATION_EFFECTS } from '../../../../animation/constants';
import StoryPropTypes, { AnimationPropType } from '../../../types';
import { Row, DropDown } from '../../form';
import { SimplePanel } from '../panel';
import { Note } from '../shared';
import EffectPanel from './effectPanel';

const ANIMATION_OPTIONS = [
  { value: '', name: __('Add Effect', 'web-stories') },
  ...Object.values(ANIMATION_EFFECTS),
];

function AnimationPanel({ selectedElements, selectedElementAnimations }) {
  return selectedElements.length > 1 ? (
    <SimplePanel name="animation" title={__('Animation', 'web-stories')}>
      <Row>
        <Note>{__('Group animation support coming soon.', 'web-stories')}</Note>
      </Row>
    </SimplePanel>
  ) : (
    <>
      <SimplePanel name="animation" title={__('Animation', 'web-stories')}>
        <DropDown
          value={ANIMATION_OPTIONS[0].value}
          onChange={() => {}}
          options={ANIMATION_OPTIONS}
        />
      </SimplePanel>
      {selectedElementAnimations.map((animation) => (
        <EffectPanel key={animation.id} animation={animation} />
      ))}
    </>
  );
}

AnimationPanel.propTypes = {
  selectedElements: PropTypes.arrayOf(StoryPropTypes.element),
  selectedElementAnimations: PropTypes.arrayOf(AnimationPropType),
};

export default AnimationPanel;
