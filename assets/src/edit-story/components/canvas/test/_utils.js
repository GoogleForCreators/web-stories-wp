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
import { ThemeProvider } from 'styled-components';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import FrameElement from '../frameElement';
import CanvasProvider from '../canvasProvider';
import ConfigProvider from '../../../app/config/configProvider';
import StoryContext from '../../../app/story/context';
import theme from '../../../theme';
import useEditingElement from '../useEditingElement';

jest.mock('../useEditingElement');

export function TestFrameElement({
  element,
  configContext: inputConfigContext,
  storyContext: inputStoryContext,
  editingElementContext: inputEditingElementContext,
}) {
  const configContext = {
    ...inputConfigContext,
    allowedMimeTypes: {
      image: [],
      video: [],
      ...(inputConfigContext && inputConfigContext.allowedMimeTypes),
    },
  };
  const storyContext = {
    ...inputStoryContext,
    state: {
      selectedElements: [],
      selectedElementIds: [],
      ...(inputStoryContext && inputStoryContext.state),
    },
    actions: {
      toggleElementInSelection: () => {},
      setSelectedElementsById: () => {},
      ...(inputStoryContext && inputStoryContext.actions),
    },
  };
  const editingElementContext = {
    nodesById: {},
    setNodeForElement: () => {},
    setEditingElementWithState: () => {},
    ...inputEditingElementContext,
  };
  useEditingElement.mockImplementation(() => editingElementContext);
  return (
    <ThemeProvider theme={theme}>
      <ConfigProvider config={configContext}>
        <StoryContext.Provider value={storyContext}>
          <CanvasProvider>
            <FrameElement element={element} />
          </CanvasProvider>
        </StoryContext.Provider>
      </ConfigProvider>
    </ThemeProvider>
  );
}

TestFrameElement.propTypes = {
  element: PropTypes.object.isRequired,
  configContext: PropTypes.object,
  storyContext: PropTypes.object,
  editingElementContext: PropTypes.object,
};
