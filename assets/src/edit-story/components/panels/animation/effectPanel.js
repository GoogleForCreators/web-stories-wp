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
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import {
  ANIMATION_EFFECTS,
  ANIMATION_PARTS,
  BACKGROUND_ANIMATION_EFFECTS,
  FIELD_TYPES,
} from '../../../../animation';
import {
  getAnimationEffectProps,
  AnimationProps,
} from '../../../../animation/parts';
import EffectInput from './effectInput';

export function getEffectName(type) {
  return (
    [
      ...Object.values(ANIMATION_EFFECTS),
      ...Object.values(ANIMATION_PARTS),
      ...Object.values(BACKGROUND_ANIMATION_EFFECTS),
    ].find((o) => o.value === type)?.name || ''
  );
}

export function getEffectDirection(effect = {}) {
  if (effect.zoomFrom || effect.zoomFrom === 0) {
    return effect.zoomFrom;
  } else if (effect.zoomDir) {
    return effect.zoomDir;
  } else if (effect.flyInDir) {
    return effect.flyInDir;
  } else if (effect.rotateInDir) {
    return effect.rotateInDir;
  } else if (effect.whooshInDir) {
    return effect.whooshInDir;
  } else if (effect.panDir) {
    return effect.panDir;
  }
  return false;
}
const AnimationGrid = styled.div`
  display: grid;
  grid-gap: 15px;
  grid-template-columns: auto auto;
  grid-auto-rows: 32px;
`;

const AnimationGridField = styled.div(
  ({ isRotationComponent, isHalfWidthField }) => [
    {
      gridColumn: '1/3',
    },
    isRotationComponent && {
      gridRow: '1/3',
      gridColumn: 'auto',
    },
    isHalfWidthField && {
      gridColumn: 'auto',
    },
  ]
);

function EffectPanel({
  animation: { id, type, ...config },
  onChange,
  disabledTypeOptionsMap,
}) {
  const { props } = getAnimationEffectProps(type);

  const handleInputChange = useCallback(
    (updates, submitArg) => {
      onChange(
        {
          id,
          type,
          ...config,
          ...updates,
        },
        submitArg
      );
    },
    [id, type, config, onChange]
  );

  const containsVisualPicker = useMemo(() => {
    return Object.keys(props).reduce((memo, current) => {
      return (
        props[current].type === FIELD_TYPES.DIRECTION_PICKER ||
        props[current].type === FIELD_TYPES.ROTATION_PICKER ||
        memo
      );
    }, false);
  }, [props]);

  const content = Object.keys(props).map((field, index) => (
    <AnimationGridField
      key={field}
      isRotationComponent={containsVisualPicker && index === 0}
      isHalfWidthField={containsVisualPicker && (index === 1 || index === 2)}
    >
      <EffectInput
        effectProps={props}
        effectConfig={config}
        field={field}
        onChange={(value, submitArg) =>
          handleInputChange({ [field]: value }, submitArg)
        }
        disabledOptions={disabledTypeOptionsMap[type] || []}
      />
    </AnimationGridField>
  ));

  return <AnimationGrid>{content}</AnimationGrid>;
}

EffectPanel.propTypes = {
  animation: PropTypes.shape(AnimationProps),
  onChange: PropTypes.func.isRequired,
  disabledTypeOptionsMap: PropTypes.objectOf(
    PropTypes.arrayOf(PropTypes.string)
  ),
};

export default EffectPanel;
