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
 * Internal dependencies
 */
import useVideoTrim from './useVideoTrim';

const Menu = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: black;
  height: 100%;
`;

const DummyLabel = styled.label`
  display: flex;
  flex-direction: column;
  color: white;
  font-size: 80%;
`;

const DummyInput = styled.input.attrs({ type: 'range' })`
  border: 1px solid white;
  background-color: black;
  color: white;
  width: 100px;
  text-align: center;
  margin-right: 20px;
`;

function VideoTrimmer() {
  const {
    currentTime,
    startOffset,
    endOffset,
    maxOffset,
    setStartOffset,
    setEndOffset,
  } = useVideoTrim(
    ({
      state: { currentTime, startOffset, endOffset, maxOffset },
      actions: { setStartOffset, setEndOffset },
    }) => ({
      currentTime,
      startOffset,
      endOffset,
      maxOffset,
      setStartOffset,
      setEndOffset,
    })
  );

  return (
    <Menu>
      <DummyLabel>{'Start: '}</DummyLabel>
      <DummyInput
        max={maxOffset}
        value={startOffset}
        onChange={(evt) => setStartOffset(evt.target.valueAsNumber)}
      />

      <DummyLabel>{'Current: '}</DummyLabel>
      <DummyInput disabled value={currentTime} max={maxOffset} />

      <DummyLabel>{'End: '}</DummyLabel>
      <DummyInput
        value={endOffset}
        max={maxOffset}
        onChange={(evt) => setEndOffset(evt.target.valueAsNumber)}
      />
    </Menu>
  );
}

export default VideoTrimmer;
