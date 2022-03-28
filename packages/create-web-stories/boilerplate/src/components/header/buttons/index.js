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
import { useStory } from '@googleforcreators/story-editor';
import { CircularProgress } from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { SaveButton } from './saveButton';
import { PreviewButton } from './preview';

const ButtonList = styled.nav`
  display: flex;
  justify-content: flex-end;
  padding: 1em;
  height: 100%;
`;

const List = styled.div`
  display: flex;
  align-items: center;
`;

const Space = styled.div`
  width: 8px;
`;

const Spinner = styled.div`
  position: absolute;
  top: 0;
`;

const IconWithSpinner = styled.div`
  position: relative;
`;

function Loading() {
  return (
    <Spinner>
      <CircularProgress size={32} />
    </Spinner>
  );
}

function Buttons() {
  const { isSaving } = useStory(
    ({
      state: {
        meta: { isSaving },
      },
    }) => ({ isSaving })
  );

  return (
    <ButtonList>
      <List>
        <IconWithSpinner>
          <PreviewButton />
          {isSaving && <Loading />}
        </IconWithSpinner>
        <Space />
        <SaveButton />
      </List>
    </ButtonList>
  );
}

export { Buttons };
