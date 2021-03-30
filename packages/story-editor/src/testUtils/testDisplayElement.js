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
import { ThemeProvider } from 'styled-components';
import PropTypes from 'prop-types';
import { TransformProvider } from '@web-stories-wp/transform';
import { DisplayElement } from '@web-stories-wp/preview';

/**
 * Internal dependencies
 */
import ConfigProvider from '../app/config/configProvider';
import StoryContext from '../app/story/context';
import { LayoutProvider } from '../app/layout';
import { CanvasProvider } from '../app/canvas';
import useEditingElement from '../app/canvas/useEditingElement';
import theme from '../theme';
import WithRefs from './withRefs';

function TestDisplayElement({
  element,
  refs,
  configContext: inputConfigContext,
  storyContext: inputStoryContext,
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
  };
  useEditingElement.mockImplementation(() => editingElementContext);
  return (
    <ThemeProvider theme={theme}>
      <ConfigProvider config={configContext}>
        <StoryContext.Provider value={storyContext}>
          <LayoutProvider>
            <CanvasProvider>
              <TransformProvider>
                <WithRefs refs={refs}>
                  <DisplayElement element={element} page={null} />
                </WithRefs>
              </TransformProvider>
            </CanvasProvider>
          </LayoutProvider>
        </StoryContext.Provider>
      </ConfigProvider>
    </ThemeProvider>
  );
}

TestDisplayElement.propTypes = {
  element: PropTypes.object.isRequired,
  refs: PropTypes.object,
  configContext: PropTypes.object,
  storyContext: PropTypes.object,
};

export default TestDisplayElement;
