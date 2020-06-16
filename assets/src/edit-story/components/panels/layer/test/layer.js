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
import { generateImage } from 'jsdom-screenshot';

/**
 * Internal dependencies
 */
import StoryContext from '../../../../app/story/context';
import Layer from '../layer';
import { INSPECTOR_MAX_WIDTH } from '../../../../constants';
import { renderWithTheme } from '../../../../testUtils';

// Prevents white text on white background.
// Sets max-width to force overflow.
const Wrapper = styled.div`
  background-color: #333;
  width: ${INSPECTOR_MAX_WIDTH}px;
`;

function setupLayer({ layer }) {
  const setSelectedElementsById = jest.fn();
  const toggleElementInSelection = jest.fn();

  const storyContextValue = {
    state: {
      currentPage: {
        elements: [{ id: '123' }],
      },
      selectedElementIds: [],
    },
    actions: { setSelectedElementsById, toggleElementInSelection },
  };
  const { container } = renderWithTheme(
    <StoryContext.Provider value={storyContextValue}>
      <Wrapper>
        <Layer layer={layer} />
      </Wrapper>
    </StoryContext.Provider>
  );

  return {
    container,
  };
}

describe('Layer', () => {
  describe('Text', () => {
    it('should show ellipsis for overflowing text', async () => {
      const layer = {
        type: 'text',
        content:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur tincidunt egestas velit quis tincidunt.',
        id: 'foo',
        textAlign: 'normal',
        fontSize: 30,
        fontFamily: 'ABeeZee',
        fontWeight: 400,
        x: 0,
        y: 0,
        height: 100,
        width: 120,
        rotationAngle: 0,
        padding: { vertical: 0, horizontal: 0, locked: false },
      };

      setupLayer({ layer });
      expect(await generateImage()).toMatchImageSnapshot({
        failureThreshold: 0.01,
        failureThresholdType: 'percent',
      });
    }, 10000);
  });
});
