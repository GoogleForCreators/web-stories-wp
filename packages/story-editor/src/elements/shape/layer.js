/*
 * Copyright 2021 Google LLC
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
import { __ } from '@googleforcreators/i18n';
/**
 * Internal dependencies
 */
import { getMaskByType } from '../../masks';
import StoryPropTypes from '../../types';
import { LayerText } from '../shared/layerText';

function ShapeLayerContent({ element }) {
  const maskDef = getMaskByType(element.mask.type);

  return <LayerText>{maskDef.name || __('Shape', 'web-stories')}</LayerText>;
}
ShapeLayerContent.propTypes = {
  element: StoryPropTypes.element.isRequired,
};

export default ShapeLayerContent;
