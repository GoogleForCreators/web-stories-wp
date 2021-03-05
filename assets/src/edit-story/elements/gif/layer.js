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
import { __ } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import StoryPropTypes from '../../types';
import { LayerText } from '../shared/layerText';

function GifLayerContent({ element, ...props }) {
  const { alt } = element?.resource || {};

  return <LayerText {...props}>{alt || __('GIF', 'web-stories')}</LayerText>;
}
GifLayerContent.propTypes = {
  element: StoryPropTypes.element.isRequired,
};

export default GifLayerContent;
