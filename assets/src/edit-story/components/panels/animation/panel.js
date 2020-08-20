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
import { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Internal dependencies
 */
import { ANIMATION_EFFECTS } from '../../../../animation/constants';
import { getAnimationEffectDefaults } from '../../../../animation/parts';
import StoryPropTypes, { AnimationPropType } from '../../../types';
import { Row, DropDown } from '../../form';
import { SimplePanel } from '../panel';
import { Note } from '../shared';
import EffectPanel from './effectPanel';

const ANIMATION_OPTIONS = [
  { value: '', name: __('Add Effect', 'web-stories') },
  ...Object.values(ANIMATION_EFFECTS),
];

const ANIMATION_PROPERTY = 'animation';

function AnimationPanel({
  selectedElements,
  selectedElementAnimations,
  pushUpdateForObject,
}) {
  const handlePanelChange = useCallback(
    (animation, submitArg = false) => {
      pushUpdateForObject(ANIMATION_PROPERTY, animation, null, submitArg);
    },
    [pushUpdateForObject]
  );

  const handleRemoveEffect = useCallback(
    (animation) => {
      pushUpdateForObject(ANIMATION_PROPERTY, animation, null, true);
    },
    [pushUpdateForObject]
  );

  const handleAddEffect = useCallback(
    (type) => {
      if (!type) {
        return;
      }

      const defaults = getAnimationEffectDefaults(type);
      pushUpdateForObject(
        ANIMATION_PROPERTY,
        {
          id: uuidv4(),
          type,
          ...defaults,
        },
        null,
        true
      );
    },
    [pushUpdateForObject]
  );

  const updatedAnimations = useMemo(() => {
    // Combining local element updates with the
    // page level applied updates
    const updated = selectedElements
      .map((element) => element.animation)
      .filter(Boolean);
    return selectedElementAnimations
      .map((anim) => ({
        ...(updated.find((a) => a.id === anim.id) || anim),
      }))
      .filter((a) => !a.delete);
  }, [selectedElements, selectedElementAnimations]);

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
          onChange={handleAddEffect}
          options={ANIMATION_OPTIONS}
        />
      </SimplePanel>
      {updatedAnimations.map((animation) => (
        <EffectPanel
          key={animation.id}
          animation={animation}
          onChange={handlePanelChange}
          onRemove={handleRemoveEffect}
        />
      ))}
    </>
  );
}

AnimationPanel.propTypes = {
  selectedElements: PropTypes.arrayOf(StoryPropTypes.element).isRequired,
  selectedElementAnimations: PropTypes.arrayOf(AnimationPropType),
  pushUpdateForObject: PropTypes.func.isRequired,
};

export default AnimationPanel;
