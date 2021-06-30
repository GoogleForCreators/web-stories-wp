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
import PropTypes from 'prop-types';
/**
 * Internal dependencies
 */
import { getDefinitionForType } from '../../../elements';

export const LayerThumbnail = ({ page }) => {
  const { LayerIcon } = getDefinitionForType(page?.type);

  const props = { element: page };

  if (page?.type === 'video') {
    props.showVideoPreviewAsBackup = true;
  }

  return <LayerIcon {...props} />;
};

LayerThumbnail.propTypes = {
  page: PropTypes.object.isRequired,
};
