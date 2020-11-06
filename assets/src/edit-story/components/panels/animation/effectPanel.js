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
import { useCallback } from 'react';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import {
  ANIMATION_EFFECTS,
  ANIMATION_PARTS,
} from '../../../../animation/constants';
import {
  getAnimationEffectProps,
  AnimationProps,
} from '../../../../animation/parts';
import { Row, Button } from '../../form';
import { Panel, PanelTitle, PanelContent } from '../panel';
import EffectInput from './effectInput';

function getEffectName(type) {
  return (
    [
      ...Object.values(ANIMATION_EFFECTS),
      ...Object.values(ANIMATION_PARTS),
    ].find((o) => o.value === type)?.name || ''
  );
}

function EffectPanel({
  animation: { id, type, ...config },
  onChange,
  onRemove,
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

  const handleRemoveClick = useCallback(() => {
    onRemove({
      id,
      type,
      ...config,
      delete: true,
    });
  }, [id, type, config, onRemove]);

  const content = Object.keys(props).map((field) => (
    <Row key={field} expand>
      <EffectInput
        effectProps={props}
        effectConfig={config}
        field={field}
        onChange={(value, submitArg) =>
          handleInputChange({ [field]: value }, submitArg)
        }
      />
    </Row>
  ));

  return (
    <Panel key={id} name={type}>
      <PanelTitle
        secondaryAction={
          <Button onClick={handleRemoveClick}>
            {__('Delete', 'web-stories')}
          </Button>
        }
      >
        {getEffectName(type)}
      </PanelTitle>
      <PanelContent>{content}</PanelContent>
    </Panel>
  );
}

EffectPanel.propTypes = {
  animation: PropTypes.shape(AnimationProps),
  onChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default EffectPanel;
