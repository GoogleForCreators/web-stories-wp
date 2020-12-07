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
import { useCallback, useMemo, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import { shallowEqual } from 'react-pure-render';

/**
 * Internal dependencies
 */
import {
  BACKGROUND_ANIMATION_EFFECTS,
  BG_MAX_SCALE,
  BG_MIN_SCALE,
  DIRECTION,
  progress,
  hasOffsets,
  STORY_ANIMATION_STATE,
} from '../../../../animation';
import { getAnimationEffectDefaults } from '../../../../animation/parts';
import StoryPropTypes, { AnimationPropType } from '../../../types';
import { Row } from '../../form';
import { SimplePanel } from '../panel';
import { Note } from '../shared';
import EffectPanel, { getEffectName } from './effectPanel';
import EffectChooserDropdown from './effectChooserDropdown';

const ANIMATION_PROPERTY = 'animation';

function AnimationPanel({
  selectedElements,
  selectedElementAnimations,
  pushUpdateForObject,
  updateAnimationState,
}) {
  const playUpdatedAnimation = useRef(false);

  const isBackground =
    selectedElements.length === 1 && selectedElements[0].isBackground;
  const backgroundScale = isBackground && selectedElements[0].scale;
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

  const elAnimationId = updatedAnimations[0]?.id;

  const handlePanelChange = useCallback(
    (animation, submitArg = false) => {
      if (shallowEqual(animation, updatedAnimations[0])) {
        return;
      }
      pushUpdateForObject(ANIMATION_PROPERTY, animation, null, submitArg);
      playUpdatedAnimation.current = true;
    },
    [pushUpdateForObject, updatedAnimations]
  );

  const handleAddOrUpdateElementEffect = useCallback(
    ({ animation, ...options }) => {
      if (!animation) {
        return;
      }

      const id = elAnimationId || uuidv4();
      const defaults = getAnimationEffectDefaults(animation);

      // Background Zoom's `scale from` initial value should match
      // the current background's scale slider
      if (
        isBackground &&
        animation === BACKGROUND_ANIMATION_EFFECTS.ZOOM.value
      ) {
        defaults.normalizedScaleFrom =
          progress(backgroundScale, [BG_MIN_SCALE, BG_MAX_SCALE]) ||
          defaults.normalizedScaleFrom;
      }

      pushUpdateForObject(
        ANIMATION_PROPERTY,
        {
          id,
          type: animation,
          ...defaults,
          ...options,
        },
        null,
        true
      );

      // There's nothing unique to the animation data to signify that it
      // was changed by the effect chooser, so we track it here.
      playUpdatedAnimation.current = true;
    },
    [elAnimationId, isBackground, pushUpdateForObject, backgroundScale]
  );

  // Play animation of selected elements when effect chooser signals
  // that it has changed the data and the data comes back changed.
  useEffect(() => {
    if (playUpdatedAnimation.current) {
      updateAnimationState({
        animationState: STORY_ANIMATION_STATE.PLAYING_SELECTED,
      });
      playUpdatedAnimation.current = false;
    }
  }, [selectedElementAnimations, updateAnimationState]);

  const handleRemoveEffect = useCallback(() => {
    pushUpdateForObject(
      ANIMATION_PROPERTY,
      {
        ...updatedAnimations[0],
        delete: true,
      },
      null,
      true
    );
  }, [pushUpdateForObject, updatedAnimations]);

  // Figure out if any options are disabled
  // for an animation type input
  const disabledTypeOptionsMap = useMemo(() => {
    if (selectedElements[0]?.isBackground) {
      const hasOffset = hasOffsets({ element: selectedElements[0] });
      return {
        [BACKGROUND_ANIMATION_EFFECTS.PAN.value]: [
          !hasOffset.bottom && DIRECTION.TOP_TO_BOTTOM,
          !hasOffset.left && DIRECTION.RIGHT_TO_LEFT,
          !hasOffset.top && DIRECTION.BOTTOM_TO_TOP,
          !hasOffset.right && DIRECTION.LEFT_TO_RIGHT,
        ].filter(Boolean),
      };
    }
    return {};
  }, [selectedElements]);

  return selectedElements.length > 1 ? (
    <SimplePanel name="animation" title={__('Animation', 'web-stories')}>
      <Row>
        <Note>{__('Group animation support coming soon.', 'web-stories')}</Note>
      </Row>
    </SimplePanel>
  ) : (
    <SimplePanel name="animation" title={__('Animation', 'web-stories')}>
      <Row>
        <EffectChooserDropdown
          onAnimationSelected={handleAddOrUpdateElementEffect}
          selectedEffectTitle={getEffectName(updatedAnimations[0]?.type)}
          onNoEffectSelected={handleRemoveEffect}
          isBackgroundEffects={isBackground}
          disabledTypeOptionsMap={disabledTypeOptionsMap}
        />
      </Row>
      {updatedAnimations[0] && (
        <EffectPanel
          animation={updatedAnimations[0]}
          onChange={handlePanelChange}
          disabledTypeOptionsMap={disabledTypeOptionsMap}
        />
      )}
    </SimplePanel>
  );
}

AnimationPanel.propTypes = {
  selectedElements: PropTypes.arrayOf(StoryPropTypes.element).isRequired,
  selectedElementAnimations: PropTypes.arrayOf(AnimationPropType),
  pushUpdateForObject: PropTypes.func.isRequired,
  updateAnimationState: PropTypes.func,
};

export default AnimationPanel;
