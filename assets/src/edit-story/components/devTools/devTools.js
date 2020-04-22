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
import { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { useGlobalKeyDownEffect } from '../keyboard';
import { useStory } from '../../app/story';
import { useSnackbar } from '../../app/snackbar';

const Container = styled.div`
  position: fixed;
  z-index: 2147483646;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  width: 35%;
  height: 50%;
  border: 6px solid ${({ theme }) => theme.colors.bg.v4};
  background: ${({ theme }) => theme.colors.bg.v1};
  color: ${({ theme }) => theme.colors.fg.v2};
`;

const Textarea = styled.textarea`
  flex: 1;
  border: 0;
  background: ${({ theme }) => theme.colors.bg.v1};
  color: ${({ theme }) => theme.colors.fg.v2};
  white-space: nowrap;
  overflow: auto;
`;

const Options = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 6px;
`;

const Label = styled.label`
  margin-right: 6px;
`;

const Button = styled.button`
  margin-left: 6px;
`;

const replaceResourcesWithDummy = (state) => {
  return {
    ...state,
    pages: state.pages.map((page) => ({
      ...page,
      elements: page.elements.map((element) => {
        let newElement = { ...element };
        if ('resource' in element) {
          // const { width, height } = newElement.resource
          newElement.resource = { ...element.resource };
          if (element.type === 'video') {
            // const { length } = newElement.resource
            newElement.resource.mimeType = 'video/mp4';
            newElement.resource.src =
              'data:video/mp4;base64,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';
            newElement.resource.poster =
              'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAGElEQVQYV2NkYGD4////fwZGEMnIyMgAAEvqB/6wfXLSAAAAAElFTkSuQmCC';
            // newElement.resource.poster = `https://dummyimage.com/${width}x${height}`
            // newElement.resource.src = `https://temp.media/video/?height=${height}&width=${width}&length=${length}`

            // Reload the video
            // document.querySelectorAll('*[id^="video-"]');
            document.getElementById(`video-${newElement.id}`).load();
          }
          if (element.type === 'image') {
            newElement.resource.mimeType = 'image/png';
            newElement.resource.src =
              'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAGElEQVQYV2NkYGD4////fwZGEMnIyMgAAEvqB/6wfXLSAAAAAElFTkSuQmCC';
            // newElement.resource.src = `https://dummyimage.com/${width}x${height}`
          }
        }
        return newElement;
      }),
    })),
  };
};

function DevTools() {
  const [isVisible, setIsVisible] = useState(false);
  const [isBase64, setIsBase64] = useState(false);
  const [isDummyResources, setIsDummyResources] = useState(false);
  const { showSnackbar } = useSnackbar();
  const textareaRef = useRef();
  const {
    state: { reducerState },
    actions: { restore },
  } = useStory();
  // This will not work here
  // const {
  //   state, // stale data
  //   internal: { restore },
  // } = useStoryReducer();

  const storyData = isDummyResources
    ? replaceResourcesWithDummy(reducerState)
    : reducerState;

  const toggleDummyResources = () => setIsDummyResources((v) => !v);
  const toggleBase64 = () => setIsBase64((v) => !v);
  const toggleVisible = () => setIsVisible((v) => !v);
  const copyToClipboard = () => {
    textareaRef.current.select();
    document.execCommand('copy');
    textareaRef.current.setSelectionRange(0, 0);
    showSnackbar({ message: 'Copied to clipboard', timeout: 1200 });
  };
  const loadFromInput = () => {
    let input = output;
    try {
      input = window.atob(input);
      // eslint-disable-next-line no-empty
    } catch (e) {}
    const stateToRestore = JSON.parse(input);
    const stateWithDummyResources = isDummyResources
      ? replaceResourcesWithDummy(stateToRestore)
      : stateToRestore;
    restore(stateWithDummyResources);
  };

  useGlobalKeyDownEffect(
    { key: 'mod+shift+alt+j', editable: true },
    toggleVisible
  );

  const jsonStr = JSON.stringify(storyData, null, 2);
  const defaultOutput = isBase64 ? window.btoa(jsonStr) : jsonStr;
  const [output, setOutput] = useState(defaultOutput);
  useEffect(() => setOutput(defaultOutput), [defaultOutput]);
  const changeTextarea = (evt) => setOutput(evt.target.value);

  return isVisible ? (
    <Container>
      <Options>
        <div>
          <Label title="For easier sharing thru various channels">
            <input type="checkbox" checked={isBase64} onChange={toggleBase64} />
            {'Base64'}
          </Label>
          <Label title="Replace resources with dummy resources">
            <input
              type="checkbox"
              checked={isDummyResources}
              onChange={toggleDummyResources}
            />
            {'Dummy resources'}
          </Label>
        </div>
        <div>
          <Button title="Load data from input" onClick={loadFromInput}>
            {'Load'}
          </Button>
          <Button title="Copy data to clipboard" onClick={copyToClipboard}>
            {'Copy'}
          </Button>
          <Button title="Close DevTools" onClick={toggleVisible}>
            {'X'}
          </Button>
        </div>
      </Options>
      <Textarea
        ref={textareaRef}
        className="mousetrap"
        value={output}
        onChange={changeTextarea}
      />
    </Container>
  ) : null;
}

export default DevTools;
