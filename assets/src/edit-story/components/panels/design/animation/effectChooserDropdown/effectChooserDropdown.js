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
import { useCallback, useMemo, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { __ } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import { DropDown, Tooltip } from '../../../../../../design-system';

import {
  backgroundEffectOptions,
  NO_ANIMATION,
  foregroundEffectOptions,
  experimentalEffects,
} from './dropdownConstants';
import { getDirectionalEffect } from './utils';
import {
  AnimationListItem,
  ContentWrapper,
  NoEffect,
  styleOverrideForSelectButton,
  styleOverrideForAnimationEffectMenu,
} from './styles';
import { useFeatures } from 'flagged';

const AnimationDropDownItem = forwardRef(({ option, ...rest }, ref) => {
  return (
    <AnimationListItem
      ref={ref}
      disabled={option.disabled}
      size={option.animation?.size}
      gridSpace={option.animation?.gridSpace}
      {...rest}
    >
      <Tooltip title={option?.tooltip || ''}>
        <ContentWrapper>{option.label}</ContentWrapper>
        {option.animation?.Effect ? (
          <option.animation.Effect>{option.label}</option.animation.Effect>
        ) : (
          <NoEffect>{option.label}</NoEffect>
        )}
      </Tooltip>
    </AnimationListItem>
  );
});
export default function EffectChooserDropdown({
  onAnimationSelected,
  onNoEffectSelected,
  isBackgroundEffects = false,
  selectedEffectType,
  disabledTypeOptionsMap,
  direction,
}) {
  const { enableExperimentalAnimationEffects } = useFeatures();

  const selectedValue = useMemo(
    () => getDirectionalEffect(selectedEffectType, direction),
    [selectedEffectType, direction]
  );
  // BACKGROUND EFFECT SET UP
  const getDisabledBackgroundEffects = useCallback(() => {
    const disabledDirectionalEffects = Object.entries(disabledTypeOptionsMap)
      .map(([effect, val]) => [effect, val.options])
      .reduce(
        (directionalEffects, [effect, directions]) => [
          ...directionalEffects,
          ...(directions || []).map((dir) => getDirectionalEffect(effect, dir)),
        ],
        []
      );
    return Object.keys(backgroundEffectOptions).filter((directionalEffect) =>
      disabledDirectionalEffects.includes(directionalEffect)
    );
  }, [disabledTypeOptionsMap]);

  const disabledBackgroundEffects = getDisabledBackgroundEffects();

  // END BACKGROUND EFFECT SET UP
  const animationOptionsObject = isBackgroundEffects
    ? backgroundEffectOptions
    : foregroundEffectOptions;

  // remove experiments if needed
  const availableAnimationOptions = useMemo(() => {
    return enableExperimentalAnimationEffects
      ? Object.values(animationOptionsObject)
      : Object.values(animationOptionsObject).filter(({ value }) => {
          return experimentalEffects.indexOf(value) === -1;
        });
  }, [animationOptionsObject, enableExperimentalAnimationEffects]);

  console.log(availableAnimationOptions);
  const assembledOptions = availableAnimationOptions?.map((option) => {
    const isDisabled =
      isBackgroundEffects && disabledBackgroundEffects.includes(option.value);
    return {
      ...option,
      disabled: isDisabled,
      tooltip:
        isDisabled && disabledTypeOptionsMap[option.animation?.value]?.tooltip,
    };
  });

  const handleSelect = useCallback((event, value) => {
    event.preventDefault();
    if (value === NO_ANIMATION) {
      onNoEffectSelected();
    }

    const selectedAnimation = animationOptionsObject[value].animation;
    onAnimationSelected({
      animation: selectedAnimation.value,
      panDir: selectedAnimation.panDirection,
      zoomDirection: selectedAnimation.zoomDirection,
      flyInDir: selectedAnimation.flyInDirection,
      rotateInDir: selectedAnimation.rotateInDirection,
      whooshInDir: selectedAnimation.whooshInDirection,
      scaleDirection: selectedAnimation.scaleDirection,
    });
  });

  return (
    <DropDown
      options={assembledOptions}
      placeholder={'None'}
      selectedValue={selectedValue}
      ariaLabel={__('Animation: Effect Chooser', 'web-stories')}
      menuStylesOverride={styleOverrideForAnimationEffectMenu}
      renderItem={AnimationDropDownItem}
      onMenuItemClick={handleSelect}
      isKeepMenuOpenOnSelection
      selectButtonStylesOverride={
        selectedValue &&
        selectedValue !== NO_ANIMATION &&
        styleOverrideForSelectButton
      }
    />
  );
}

EffectChooserDropdown.propTypes = {
  onAnimationSelected: PropTypes.func.isRequired,
  direction: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
    PropTypes.number,
  ]),
  isBackgroundEffects: PropTypes.bool,
  selectedEffectTitle: PropTypes.string,
  selectedEffectType: PropTypes.string,
  onNoEffectSelected: PropTypes.func.isRequired,
  disabledTypeOptionsMap: PropTypes.objectOf(
    PropTypes.shape({
      tooltip: PropTypes.string,
      options: PropTypes.arrayOf(PropTypes.string),
    })
  ),
};
