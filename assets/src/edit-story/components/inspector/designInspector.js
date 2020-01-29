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
import styled from 'styled-components';

/**
 * WordPress dependencies
 */
import { useCallback } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { useStory } from '../../app';
import { getPanels } from '../../panels';

const Wrapper = styled.div`
  min-height: 100%;
`;

function DesignInspector() {
  const {
    state: { selectedElements },
    actions: { deleteSelectedElements, updateSelectedElements },
  } = useStory();
  const panels = getPanels(selectedElements);

  const handleSetProperties = useCallback((properties) => {
    // Filter out empty properties (empty strings specifically)
    const updatedKeys = Object.keys(properties)
      .filter((key) => properties[key] !== '');

    if (updatedKeys.length === 0) {
      // Of course abort if no keys have a value
      return;
    }

    const actualProperties = updatedKeys
      .reduce((obj, key) => ({ ...obj, [key]: properties[key] }), {});
    updateSelectedElements({ properties: actualProperties });
  }, [updateSelectedElements]);
  return (

    <Wrapper>
      { panels.map(({ Panel, type }) => (
        <Panel key={type} deleteSelectedElements={deleteSelectedElements} selectedElements={selectedElements} onSetProperties={handleSetProperties} />
      )) }
    </Wrapper>
  );
}

export default DesignInspector;
