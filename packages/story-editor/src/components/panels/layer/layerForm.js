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
import { __ } from '@googleforcreators/i18n';
import { memo, useState, useEffect } from '@googleforcreators/react';

/**
 * Internal dependencies
 */
import { useCanvas } from '../../../app';
import { LayerInputForm, LayerInput } from './layerComponents';

// We need to prevent the pointer-down event from propagating to the
// reorderable when you click on the input. If not, the reorderable will
// move focus, which will blur the input, which will cancel renaming.
const stopPropagation = (evt) => evt.stopPropagation();

function LayerForm({ layerName, handleNewLayerName }) {
  const [newLayerName, setNewLayerName] = useState(layerName);

  const setRenamableLayer = useCanvas(
    ({ actions }) => actions.setRenamableLayer
  );

  useEffect(() => {
    setNewLayerName(layerName);
  }, [layerName]);

  const handleChange = (evt) => {
    setNewLayerName(evt.target.value);
  };

  const handleKeyDown = (evt) => {
    if (evt.key === 'Escape') {
      setNewLayerName(layerName);
      setRenamableLayer(null);
    }
  };

  const updateLayerName = () => {
    setRenamableLayer(null);
    const trimmedLayerName = newLayerName.trim();
    // Only update name if trimmed layer name is not empty.
    if (trimmedLayerName) {
      handleNewLayerName(trimmedLayerName);
    }
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    updateLayerName();
  };

  return (
    <LayerInputForm onSubmit={handleSubmit}>
      <LayerInput
        tabIndex={-1}
        aria-label={__('Layer Name', 'web-stories')}
        value={newLayerName}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={updateLayerName}
        onPointerDown={stopPropagation}
        hasFocus
      />
      <button hidden />
    </LayerInputForm>
  );
}

LayerForm.propTypes = {
  layerName: PropTypes.string.isRequired,
  handleNewLayerName: PropTypes.func.isRequired,
};

export default memo(LayerForm);
