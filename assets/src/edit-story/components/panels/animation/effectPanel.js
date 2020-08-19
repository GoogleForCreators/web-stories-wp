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
import { useCallback } from 'react';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { ANIMATION_EFFECTS } from '../../../../animation/constants';
import { AnimationProps } from '../../../../animation/parts/types';
import { GetAnimationEffectProps } from '../../../../animation/parts';
import { Row } from '../../form';
import { Panel, PanelTitle, PanelContent } from '../panel';
import EffectInput from './effectInput';

function getEffectName(type) {
  return (
    Object.values(ANIMATION_EFFECTS).find((o) => o.value === type)?.name || ''
  );
}

function EffectPanel({ animation: { id, type, ...config }, onChange }) {
  const { props } = GetAnimationEffectProps(type);

  const handleInputChange = useCallback(
    (updates) => {
      onChange({
        id,
        type,
        ...config,
        ...updates,
      });
    },
    [id, type, config, onChange]
  );

  const content = Object.keys(props).map((field) => (
    <Row key={field} expand>
      <EffectInput
        effectProps={props}
        effectConfig={config}
        field={field}
        onChange={(value) => handleInputChange({ [field]: value })}
      />
    </Row>
  ));

  return (
    <Panel key={id} name={type}>
      <PanelTitle>{getEffectName(type)}</PanelTitle>
      <PanelContent>{content}</PanelContent>
    </Panel>
  );
}

EffectPanel.propTypes = {
  animation: PropTypes.shape(AnimationProps),
  onChange: PropTypes.func.isRequired,
};

export default EffectPanel;
