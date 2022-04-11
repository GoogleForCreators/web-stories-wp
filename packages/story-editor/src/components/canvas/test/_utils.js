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
import { PAGE_WIDTH, PAGE_RATIO } from '@googleforcreators/units';
import { TransformProvider, useTransform } from '@googleforcreators/transform';

/**
 * Internal dependencies
 */
import FrameElement from '../frameElement';
import DisplayElement from '../displayElement';
import { CanvasProvider } from '../../../app/canvas';
import LayoutContext from '../../../app/layout/context';
import ConfigProvider from '../../../app/config/configProvider';
import StoryContext from '../../../app/story/context';
import theme from '../../../theme';
import useEditingElement from '../../../app/canvas/useEditingElement';
import { DropTargetsProvider } from '../../dropTargets';
import { MediaProvider } from '../../../app/media';
import EditLayerFocusManager from '../editLayerFocusManager';

jest.mock('../../../app/canvas/useEditingElement');

const LAYOUT_CONTEXT = {
  state: {
    pageWidth: PAGE_WIDTH,
    pageHeight: PAGE_WIDTH / PAGE_RATIO,
  },
  actions: {},
};

export function TestFrameElement({
  element,
  refs,
  configContext: inputConfigContext,
  storyContext: inputStoryContext,
  editingElementContext: inputEditingElementContext,
}) {
  const configContext = {
    ...inputConfigContext,
    allowedMimeTypes: {
      audio: [],
      image: [],
      caption: [],
      vector: [],
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
      currentPage: {
        ...(inputStoryContext.state?.currentPage || {}),
        elements: [
          element,
          ...(inputStoryContext.state?.currentPage?.elements || []),
        ],
      },
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
          <LayoutContext.Provider value={LAYOUT_CONTEXT}>
            <CanvasProvider>
              <TransformProvider>
                <DropTargetsProvider>
                  <WithRefs refs={refs}>
                    <EditLayerFocusManager>
                      <FrameElement id={element.id} />
                    </EditLayerFocusManager>
                  </WithRefs>
                </DropTargetsProvider>
              </TransformProvider>
            </CanvasProvider>
          </LayoutContext.Provider>
        </StoryContext.Provider>
      </ConfigProvider>
    </ThemeProvider>
  );
}

TestFrameElement.propTypes = {
  element: PropTypes.object.isRequired,
  refs: PropTypes.object,
  configContext: PropTypes.object,
  storyContext: PropTypes.object,
  editingElementContext: PropTypes.object,
};

export function TestDisplayElement({
  element,
  refs,
  configContext: inputConfigContext,
  storyContext: inputStoryContext,
}) {
  const configContext = {
    ...inputConfigContext,
    allowedMimeTypes: {
      audio: [],
      image: [],
      caption: [],
      vector: [],
      video: [],
      ...(inputConfigContext && inputConfigContext.allowedMimeTypes),
    },
    capabilities: { hasUploadMediaAction: true },
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
          <LayoutContext.Provider value={LAYOUT_CONTEXT}>
            <CanvasProvider>
              <MediaProvider>
                <TransformProvider>
                  <WithRefs refs={refs}>
                    <DisplayElement element={element} page={null} />
                  </WithRefs>
                </TransformProvider>
              </MediaProvider>
            </CanvasProvider>
          </LayoutContext.Provider>
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

function WithRefs({ refs, children }) {
  const transformContext = useTransform();
  if (refs) {
    Object.assign(refs, {
      transformContext,
    });
  }
  return children;
}

WithRefs.propTypes = {
  refs: PropTypes.object,
  children: PropTypes.node,
};
