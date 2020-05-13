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
import { useMemo, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Internal dependencies
 */
import { StoryPropType } from '../../../../types';
import { ANIMATION_TYPES } from '../../../../animations/constants';
import {
  Container,
  AnimationList,
  DeleteButton,
  DeleteIcon,
  LabelButton,
  CancelButton,
  AnimationPanel,
  FormField,
  TimelineAnimation,
  TimelineLabel,
  TimelineBarContainer,
  TimelineBar,
} from './components';

function getOffsetAndWidth(totalDuration, duration, delay) {
  return {
    offset: (delay / totalDuration) * 100,
    width: (duration / totalDuration) * 100,
  };
}

function Timeline({
  story,
  activePageIndex,
  activeAnimation,
  isElementSelectable,
  isAnimationSaveable,
  onAddOrUpdateAnimation,
  onAnimationSelect,
  onAnimationDelete,
  onToggleTargetSelect,
}) {
  const animations = useMemo(
    () => story.pages[activePageIndex].animations || [],
    [story, activePageIndex]
  );

  const totalDuration = useMemo(
    () =>
      animations.reduce(
        (total, { duration, delay }) => Math.max(total, duration + delay),
        0
      ),
    [animations]
  );

  const handleAnimationSubmit = useCallback(
    (e) => {
      e.preventDefault();

      if (!isAnimationSaveable) {
        return;
      }

      const animation = {
        id: e.target.id.value || uuidv4(),
        type: e.target.type.value,
        duration: parseInt(e.target.duration.value),
        delay: parseInt(e.target.delay.value),
      };

      e.target.reset();

      onAddOrUpdateAnimation(animation);
    },
    [isAnimationSaveable, onAddOrUpdateAnimation]
  );

  const handleToggleTargetSelect = useCallback(
    (e) => {
      e.preventDefault();
      onToggleTargetSelect(!isElementSelectable);
    },
    [isElementSelectable, onToggleTargetSelect]
  );

  const handleCancelClick = useCallback(
    (e) => {
      e.preventDefault();
      onAnimationSelect('');
    },
    [onAnimationSelect]
  );

  const handleDeleteClick = useCallback(
    (animationId) => {
      if (window.confirm('Are you sure you want to delete this animation?')) {
        onAnimationDelete(animationId);
      }
    },
    [onAnimationDelete]
  );

  const handleInputFocus = useCallback((e) => e.target.select(), []);

  useEffect(() => {
    onToggleTargetSelect(false);
  }, [activeAnimation, onToggleTargetSelect]);

  return (
    <>
      <p>{`Total animation duration for this page: ${totalDuration}ms`}</p>
      <Container>
        <AnimationList>
          {animations.map((animation) => (
            <TimelineAnimation key={animation.id}>
              <TimelineLabel>
                <DeleteButton
                  title="Delete Animation"
                  onClick={(e) => {
                    e.preventDefault();
                    handleDeleteClick(animation.id);
                  }}
                >
                  <DeleteIcon />
                </DeleteButton>
                <LabelButton
                  isActive={activeAnimation.id === animation.id}
                  onClick={() => onAnimationSelect(animation.id)}
                >
                  {animation.type}
                </LabelButton>
              </TimelineLabel>
              <TimelineBarContainer>
                <TimelineBar
                  title={`${animation.duration}ms`}
                  onClick={() => onAnimationSelect(animation.id)}
                  {...getOffsetAndWidth(
                    totalDuration,
                    animation.duration,
                    animation.delay
                  )}
                />
              </TimelineBarContainer>
            </TimelineAnimation>
          ))}
        </AnimationList>
        <AnimationPanel>
          <form onSubmit={handleAnimationSubmit}>
            <FormField>
              <label>{'Animation Type'}</label>
              <select
                key={`animation-type: ${activeAnimation.id}`}
                name="type"
                defaultValue={activeAnimation.type}
              >
                {Object.values(ANIMATION_TYPES).map((animType) => (
                  <option key={animType} value={animType}>
                    {animType.toUpperCase()}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField>
              <label>{'Duration (ms)'}</label>
              <input
                key={`animation-duration: ${activeAnimation.id}`}
                name="duration"
                type="number"
                defaultValue={activeAnimation.duration || 1000}
                onFocus={handleInputFocus}
              />
            </FormField>

            <FormField>
              <label>{'Delay (ms)'}</label>
              <input
                key={`animation-delay: ${activeAnimation.id}`}
                name="delay"
                type="number"
                defaultValue={activeAnimation.delay || 0}
                onFocus={handleInputFocus}
              />
            </FormField>

            <FormField>
              <label>{'Targets'}</label>
              <button onClick={handleToggleTargetSelect}>
                {isElementSelectable
                  ? 'Target(s) Selected'
                  : 'Select Target(s)'}
              </button>
            </FormField>

            {isAnimationSaveable && (
              <>
                <input
                  key={`animation-id: ${activeAnimation.id}`}
                  name="id"
                  type="hidden"
                  defaultValue={activeAnimation.id}
                />

                {!isElementSelectable && (
                  <>
                    <input type="submit" value="Submit" />
                    {activeAnimation.id && (
                      <CancelButton onClick={handleCancelClick}>
                        {'Cancel'}
                      </CancelButton>
                    )}
                  </>
                )}
              </>
            )}
          </form>
        </AnimationPanel>
      </Container>
    </>
  );
}

Timeline.propTypes = {
  story: StoryPropType.isRequired,
  activePageIndex: PropTypes.number.isRequired,
  activeAnimation: PropTypes.object.isRequired,
  isElementSelectable: PropTypes.bool,
  isAnimationSaveable: PropTypes.bool,
  onAddOrUpdateAnimation: PropTypes.func.isRequired,
  onAnimationSelect: PropTypes.func.isRequired,
  onAnimationDelete: PropTypes.func.isRequired,
  onToggleTargetSelect: PropTypes.func.isRequired,
};

export default Timeline;
