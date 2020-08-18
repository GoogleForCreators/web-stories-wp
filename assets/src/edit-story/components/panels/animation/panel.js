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
// import styled from 'styled-components';

/**
 * Internal dependencies
 */
import {
  ANIMATION_EFFECTS,
  FIELD_TYPES,
} from '../../../../animation/constants';
import { GetAnimationEffectProps } from '../../../../animation/parts';
import StoryPropTypes, { AnimationPropType } from '../../../types';
import { Row, DropDown, BoxedNumeric } from '../../form';
import { SimplePanel, Panel, PanelTitle, PanelContent } from '../panel';
import { Note } from '../shared';

const ANIMATION_OPTIONS = [
  { value: '', name: __('Add Effect', 'web-stories') },
  ...Object.values(ANIMATION_EFFECTS),
];

function getEffectName(type) {
  return (
    Object.values(ANIMATION_EFFECTS).find((o) => o.value === type)?.name || ''
  );
}

function renderEffectInput(effectProps, effectConfig, field) {
  switch (effectProps[field].type) {
    case FIELD_TYPES.DROPDOWN:
      return (
        <DropDown
          value={effectConfig[field] || effectProps[field].defaultValue}
          onChange={() => {}}
          options={effectProps[field].values.map((v) => ({
            value: v,
            name: v,
          }))}
        />
      );
    default:
      return (
        <BoxedNumeric
          aria-label={effectProps[field].label}
          suffix={effectProps[field].label}
          symbol={effectProps[field].unit}
          value={effectConfig[field] || effectProps[field].defaultValue}
          min={0}
          onChange={() => {}}
          canBeNegative={false}
          flexBasis={'100%'}
        />
      );
  }
}

function renderEffectsPanel({ id, type, ...config }) {
  const { props } = GetAnimationEffectProps(type);

  const content = Object.keys(props).map((field) => (
    <Row key={field} expand>
      {renderEffectInput(props, config, field)}
    </Row>
  ));

  return (
    <Panel key={id} name={type}>
      <PanelTitle>{getEffectName(type)}</PanelTitle>
      <PanelContent>{content}</PanelContent>
    </Panel>
  );
}

function AnimationPanel({ selectedElements, selectedElementAnimations }) {
  return selectedElements.length > 1 ? (
    <SimplePanel name="animation" title={__('Animation', 'web-stories')}>
      <Row>
        <Note>{'Group animation support coming soon.'}</Note>
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
      {selectedElementAnimations.map((animation) =>
        renderEffectsPanel(animation)
      )}
    </>
  );
}

AnimationPanel.propTypes = {
  selectedElements: PropTypes.arrayOf(StoryPropTypes.element),
  selectedElementAnimations: PropTypes.arrayOf(AnimationPropType),
};

export default AnimationPanel;
