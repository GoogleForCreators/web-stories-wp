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
import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
/**
 * Internal dependencies
 */
import {
  clamp,
  getAnimationProps,
  getTotalDuration,
  ANIMATION_TYPES,
  FIELD_TYPES,
} from '../../../../../animation';
import { StoryPropType } from '../../../../types';
import {
  AnimationList,
  AnimationPanel,
  CancelButton,
  Container,
  DeleteButton,
  DeleteIcon,
  FormField,
  LabelButton,
  ScrubBar,
  ScrubBarContainer,
  TimelineAnimation,
  TimelineBar,
  TimelineBarContainer,
  TimelineLabel,
} from './components';

function handleInputFocus(e) {
  e.target.select();
}

function getOffsetAndWidth(totalDuration, duration, delay) {
  return {
    offset: (delay / totalDuration) * 100,
    width: (duration / totalDuration) * 100,
  };
}

function renderFormField(name, type, value, options, onChange) {
  switch (type) {
    case FIELD_TYPES.HIDDEN:
      return (
        value && (
          <input name={name} readOnly type={FIELD_TYPES.HIDDEN} value={value} />
        )
      );

    case FIELD_TYPES.CHECKBOX:
      return (
        <input
          name={name}
          readOnly
          type={FIELD_TYPES.CHECKBOX}
          onChange={onChange}
          defaultChecked={value}
        />
      );

    case FIELD_TYPES.DROPDOWN:
      return (
        <select name={name} value={value} onBlur={onChange} onChange={onChange}>
          {options.map((option) => (
            <option key={option} value={option}>
              {option.toUpperCase()}
            </option>
          ))}
        </select>
      );

    case FIELD_TYPES.FLOAT:
      return (
        <input
          name={name}
          type="number"
          value={value}
          onFocus={handleInputFocus}
          onChange={onChange}
        />
      );

    default:
      return (
        <input
          name={name}
          type={type}
          value={value}
          onFocus={handleInputFocus}
          onChange={onChange}
        />
      );
  }
}

const animationTypes = Object.values(ANIMATION_TYPES);
const scrubBarWidth = 10;

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
  emitGlobalTime,
  canScrub,
}) {
  const scrubContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [formFields, setFormFields] = useState({});

  const { type: selectedAnimationType, props: animationProps } = useMemo(
    () => getAnimationProps(formFields.type || animationTypes[0]),
    [formFields.type]
  );

  const defaultFieldValues = useMemo(
    () =>
      Object.keys(animationProps).reduce(
        (acc, prop) => ({
          ...acc,
          [prop]:
            typeof animationProps[prop].defaultValue !== 'undefined'
              ? animationProps[prop].defaultValue
              : '',
        }),
        {}
      ),
    [animationProps]
  );

  const animations = useMemo(
    () => story.pages[activePageIndex].animations || [],
    [story, activePageIndex]
  );

  const totalDuration = useMemo(() => getTotalDuration({ animations }), [
    animations,
  ]);

  useEffect(() => {
    if (!(canScrub && isDragging && scrubContainerRef.current)) {
      return () => {};
    }
    const containerBoundingBox = scrubContainerRef.current.getBoundingClientRect();
    const handleMouseMove = (e) => {
      const delta = clamp(e.clientX - containerBoundingBox.left, [
        0,
        containerBoundingBox.width - scrubBarWidth,
      ]);
      emitGlobalTime((delta / containerBoundingBox.width) * totalDuration);
      scrubContainerRef.current.style.setProperty('--scrub-offset', delta);
    };
    const handleMouseUp = () => setIsDragging(false);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, emitGlobalTime, totalDuration, canScrub]);

  const handleAnimationSubmit = useCallback(
    (e) => {
      e.preventDefault();

      if (!isAnimationSaveable) {
        return;
      }

      // defaultFieldValues will always have the correct
      // fields to save off, so using as the source of keys
      const animation = {
        ...Object.keys(defaultFieldValues).reduce((acc, name) => {
          const type = animationProps[name].type;
          let formatter = (value) => value;

          if (type === FIELD_TYPES.NUMBER) {
            formatter = parseInt;
          } else if (type === FIELD_TYPES.FLOAT) {
            formatter = parseFloat;
          }

          return {
            ...acc,
            [name]: formatter(formFields[name]),
          };
        }, {}),
        // iterations can have numbers or the word 'infinity' as
        // valid values
        iterations: isNaN(parseInt(formFields.iterations))
          ? formFields.iterations
          : parseInt(formFields.iterations),
        id: formFields.id || uuidv4(),
        type: formFields.type,
      };

      onAddOrUpdateAnimation(
        Object.keys(animation)
          .filter(
            (name) =>
              typeof animation[name] !== 'undefined' && animation[name] !== ''
          )
          .reduce(
            (acc, name) => ({
              ...acc,
              [name]: animation[name],
            }),
            {}
          )
      );

      setFormFields(defaultFieldValues);
    },
    [
      formFields,
      isAnimationSaveable,
      onAddOrUpdateAnimation,
      animationProps,
      defaultFieldValues,
    ]
  );

  const createHandleOnChange = useCallback(
    (isCheckbox = false) => (e) => {
      const { name, value, checked } = e.target;

      setFormFields((prevFormFields) => ({
        ...prevFormFields,
        [name]: isCheckbox ? checked : value,
      }));
    },
    []
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
      setFormFields(defaultFieldValues);
    },
    [onAnimationSelect, defaultFieldValues]
  );

  const handleDeleteClick = useCallback(
    (animationId) => {
      if (window.confirm('Are you sure you want to delete this animation?')) {
        onAnimationDelete(animationId);
      }
    },
    [onAnimationDelete]
  );

  useEffect(() => {
    onToggleTargetSelect(false);
  }, [activeAnimation, onToggleTargetSelect]);

  useEffect(() => {
    setFormFields((prevFormFields) => ({
      ...defaultFieldValues,
      ...prevFormFields,
      type: selectedAnimationType,
    }));
  }, [selectedAnimationType, defaultFieldValues]);

  useEffect(() => {
    setFormFields((prevFormFields) => ({
      ...prevFormFields,
      ...activeAnimation,
    }));
  }, [activeAnimation]);

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
          <ScrubBarContainer ref={scrubContainerRef}>
            <ScrubBar
              opacity={canScrub ? 1 : 0}
              width={scrubBarWidth}
              onMouseDown={() => setIsDragging(true)}
              isDragging={isDragging}
            />
          </ScrubBarContainer>
        </AnimationList>
        <AnimationPanel>
          {Object.keys(formFields).length > 0 && (
            <form onSubmit={handleAnimationSubmit}>
              {Object.keys(animationProps).map((name) => (
                <FormField key={formFields.id + name}>
                  {animationProps[name].type !== FIELD_TYPES.HIDDEN && (
                    <label title={animationProps[name].tooltip}>
                      {animationProps[name].label || name}
                    </label>
                  )}
                  {renderFormField(
                    name,
                    animationProps[name].type,
                    formFields[name],
                    animationProps[name].values,
                    createHandleOnChange(
                      animationProps[name].type === FIELD_TYPES.CHECKBOX
                    )
                  )}
                </FormField>
              ))}

              <FormField>
                <label>{'Targets'}</label>
                <button onClick={handleToggleTargetSelect}>
                  {isElementSelectable
                    ? 'Target(s) Selected'
                    : 'Select Target(s)'}
                </button>
              </FormField>

              {isAnimationSaveable && !isElementSelectable && (
                <>
                  <input type="submit" readOnly value="Submit" />
                  {activeAnimation.id && (
                    <CancelButton onClick={handleCancelClick}>
                      {'Cancel'}
                    </CancelButton>
                  )}
                </>
              )}
            </form>
          )}
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
  emitGlobalTime: PropTypes.func,
  canScrub: PropTypes.bool,
};

export default Timeline;
