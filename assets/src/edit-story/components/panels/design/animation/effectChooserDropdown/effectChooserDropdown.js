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
import { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { __ } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import { useFeatures } from 'flagged';
import { DropDown, PLACEMENT } from '../../../../../../design-system';

import {
  backgroundEffectOptions,
  NO_ANIMATION,
  foregroundEffectOptions,
  experimentalEffects,
  getDirectionalEffect,
} from './dropdownConstants';
import { ANIMATION_DIRECTION_PROP_TYPE } from './types';
import getDisabledBackgroundEffects from './utils/getDisabledBackgroundEffects';
import generateDynamicProps from './utils/generateDynamicProps';
import {
  styleOverrideForSelectButton,
  styleOverrideForAnimationEffectMenu,
} from './styles';
import DropDownItem from './dropdownItem';

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

  // Determine if any background effects are disabled due to element positioning
  const disabledBackgroundEffects = useMemo(
    () =>
      isBackgroundEffects &&
      getDisabledBackgroundEffects(
        backgroundEffectOptions,
        disabledTypeOptionsMap
      ),
    [disabledTypeOptionsMap, isBackgroundEffects]
  );

  // Set up dropdown options by effect type (background vs foreground)
  const expandedPlacement = isBackgroundEffects
    ? PLACEMENT.BOTTOM
    : PLACEMENT.TOP;
  const animationOptionsObject = isBackgroundEffects
    ? backgroundEffectOptions
    : foregroundEffectOptions;

  // remove experiments if needed
  const availableAnimationOptions = useMemo(
    () =>
      enableExperimentalAnimationEffects
        ? Object.values(animationOptionsObject)
        : Object.values(animationOptionsObject).filter(({ value }) => {
            return experimentalEffects.indexOf(value) === -1;
          }),
    [animationOptionsObject, enableExperimentalAnimationEffects]
  );

  const assembledOptions = useMemo(
    () =>
      availableAnimationOptions?.map((option) => {
        const isDisabled =
          isBackgroundEffects &&
          disabledBackgroundEffects.includes(option.value);
        return {
          ...option,
          disabled: isDisabled,
          tooltip:
            isDisabled &&
            disabledTypeOptionsMap[option.animation?.value]?.tooltip,
        };
      }),
    [
      availableAnimationOptions,
      isBackgroundEffects,
      disabledBackgroundEffects,
      disabledTypeOptionsMap,
    ]
  );

  const handleSelect = useCallback(
    (event, value) => {
      event.preventDefault();
      if (value === NO_ANIMATION) {
        onNoEffectSelected();
        return;
      }

      const selectedAnimation = animationOptionsObject[value]?.animation;
      const animationWithDynamicProps = generateDynamicProps({
        animation: selectedAnimation,
        disabledTypeOptionsMap,
      });
      onAnimationSelected({
        animation: animationWithDynamicProps.value,
        panDir: animationWithDynamicProps?.panDirection,
        zoomDirection: animationWithDynamicProps?.zoomDirection,
        flyInDir: animationWithDynamicProps?.flyInDirection,
        rotateInDir: animationWithDynamicProps?.rotateInDirection,
        whooshInDir: animationWithDynamicProps?.whooshInDirection,
        scaleDirection: animationWithDynamicProps?.scaleDirection,
      });
    },
    [
      animationOptionsObject,
      onAnimationSelected,
      onNoEffectSelected,
      disabledTypeOptionsMap,
    ]
  );

  return (
    <DropDown
      options={assembledOptions}
      placeholder={__('None', 'web-stories')}
      selectedValue={selectedValue}
      ariaLabel={__('Animation: Effect Chooser', 'web-stories')}
      menuStylesOverride={styleOverrideForAnimationEffectMenu}
      renderItem={DropDownItem}
      onMenuItemClick={handleSelect}
      placement={expandedPlacement}
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
  direction: ANIMATION_DIRECTION_PROP_TYPE,
  isBackgroundEffects: PropTypes.bool,
  selectedEffectType: PropTypes.string,
  onNoEffectSelected: PropTypes.func.isRequired,
  disabledTypeOptionsMap: PropTypes.objectOf(
    PropTypes.shape({
      tooltip: PropTypes.string,
      options: PropTypes.arrayOf(PropTypes.string),
    })
  ),
};
