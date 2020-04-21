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
import { useRef, useState } from 'react';
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
`;

const Options = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 6px;
`;

const Label = styled.label`
  margin-right: 10px;
`;

function DevTools() {
  const [isVisible, setIsVisible] = useState(false);
  const [isBase64, setIsBase64] = useState(false);
  const [isWholeState, setWholeState] = useState(false);
  const { state } = useStory();
  const {
    currentPageIndex,
    hasSelection,
    selectedElementIds,
    story: { stylePresets },
    pages,
  } = state;
  const storyData = isWholeState
    ? state
    : {
        currentPageIndex,
        hasSelection,
        selectedElementIds,
        story: {
          stylePresets,
        },
        pages,
      };
  const { showSnackbar } = useSnackbar();
  const textareaRef = useRef();

  const toggleWholeState = () => setWholeState((v) => !v);
  const toggleBase64 = () => setIsBase64((v) => !v);
  const toggleVisible = () => setIsVisible((v) => !v);
  const copyToClipboard = () => {
    textareaRef.current.select();
    document.execCommand('copy');
    textareaRef.current.setSelectionRange(0, 0);
    showSnackbar({ message: 'Copied to clipboard', timeout: 1200 });
  };

  useGlobalKeyDownEffect(
    { key: 'mod+shift+alt+j', editable: true },
    toggleVisible
  );

  const jsonStr = JSON.stringify(storyData, null, 2);
  const output = isBase64 ? window.btoa(jsonStr) : jsonStr;

  return isVisible ? (
    <Container>
      <Options>
        <div>
          <Label>
            <input type="checkbox" checked={isBase64} onChange={toggleBase64} />
            {'Base64'}
          </Label>
          <Label>
            <input
              type="checkbox"
              checked={isWholeState}
              onChange={toggleWholeState}
            />
            {'Whole state'}
          </Label>
        </div>
        <button onClick={copyToClipboard}>{'Copy'}</button>
      </Options>
      <Textarea ref={textareaRef} className="mousetrap" value={output} />
    </Container>
  ) : null;
}

export default DevTools;
