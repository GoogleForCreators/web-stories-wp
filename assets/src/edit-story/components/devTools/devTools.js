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
import { dummyImage, dummyVideo } from './dummyData';

const Container = styled.div`
  position: fixed;
  z-index: 2147483646;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  width: 35%;
  height: 50%;
  border: 6px solid ${({ theme }) => theme.colors.bg.panel};
  background: ${({ theme }) => theme.colors.bg.workspace};
  color: ${({ theme }) => theme.colors.fg.v2};
`;

const Textarea = styled.textarea`
  flex: 1;
  border: 0;
  background: ${({ theme }) => theme.colors.bg.workspace};
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
  let videosToReload = [];
  const newState = {
    ...state,
    pages: state.pages.map((page) => ({
      ...page,
      elements: page.elements.map((element) => {
        let newElement = { ...element };
        if ('resource' in element) {
          newElement.resource = { ...element.resource };
          if (element.type === 'video') {
            newElement.resource.mimeType = 'video/mp4';
            newElement.resource.src = dummyVideo;
            newElement.resource.poster = dummyImage;
            videosToReload.push(newElement.id);
          }
          if (element.type === 'image') {
            newElement.resource.mimeType = 'image/png';
            newElement.resource.src = dummyImage;
          }
        }
        return newElement;
      }),
    })),
  };

  return [newState, videosToReload];
};

function DevTools() {
  const [isVisible, setIsVisible] = useState(false);
  const [isBase64, setIsBase64] = useState(false);
  const [isDummyResources, setIsDummyResources] = useState(false);
  const { showSnackbar } = useSnackbar();
  const textareaRef = useRef();
  const {
    internal: { reducerState, restore },
  } = useStory();

  const {
    pages,
    current,
    selection,
    story: { stylePresets },
  } = reducerState;
  const reducerStateSlice = {
    current,
    selection,
    story: { stylePresets },
    pages,
  };
  const storyData = isDummyResources
    ? replaceResourcesWithDummy(reducerStateSlice)[0]
    : reducerStateSlice;

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
    const inputState = JSON.parse(input);
    const stateToRestore = {
      ...inputState,
      story: { ...reducerState.story, ...inputState.story },
      capabilities: reducerState.capabilities,
    };
    const [stateWithDummyResources, videosToReload] = isDummyResources
      ? replaceResourcesWithDummy(stateToRestore)
      : [stateToRestore];
    restore(stateWithDummyResources);
    if (videosToReload.length > 0) {
      videosToReload.forEach((videoId) => {
        const videoEl = document.getElementById(`video-${videoId}`);
        if (videoEl) {
          videoEl.load();
        }
      });
    }
    showSnackbar({ message: 'Story restored from input', timeout: 1200 });
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
