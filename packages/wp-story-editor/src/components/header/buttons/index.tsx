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
import {
  useStory,
  RedoButton,
  PreviewButton,
  SwitchToDraftButton,
  UndoButton,
  UpdateButton,
  PublishButton,
} from '@googleforcreators/story-editor';
import { CircularProgress } from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import useMetaBoxes from '../../metaBoxes/useMetaBoxes';

const ButtonList = styled.nav`
  display: flex;
  justify-content: flex-end;
  padding: 1em;
  height: 100%;
`;

const List = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
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

interface DraftButtonsProps {
  forceIsSaving: boolean;
  hasUpdates: boolean;
}

function DraftButtons({ forceIsSaving, hasUpdates }: DraftButtonsProps) {
  return (
    <>
      <UpdateButton hasUpdates={hasUpdates} forceIsSaving={forceIsSaving} />
      <PublishButton forceIsSaving={forceIsSaving} />
    </>
  );
}

interface PendingButtonsProps {
  forceIsSaving: boolean;
  hasUpdates: boolean;
  canPublish: boolean;
}

function PendingButtons({
  forceIsSaving,
  hasUpdates,
  canPublish,
}: PendingButtonsProps) {
  return (
    <>
      <SwitchToDraftButton forceIsSaving={forceIsSaving} />
      {canPublish && (
        <UpdateButton hasUpdates={hasUpdates} forceIsSaving={forceIsSaving} />
      )}
      <PublishButton forceIsSaving={forceIsSaving} />
    </>
  );
}

interface PublishedButtons {
  forceIsSaving: boolean;
  hasUpdates: boolean;
}

function PublishedButtons({ forceIsSaving, hasUpdates }: PublishedButtons) {
  return (
    <>
      <SwitchToDraftButton forceIsSaving={forceIsSaving} />
      <UpdateButton hasUpdates={hasUpdates} forceIsSaving={forceIsSaving} />
    </>
  );
}

function Buttons() {
  const { status, canPublish, isSaving } = useStory(
    ({
      state: {
        story: { status },
        meta: { isSaving },
        capabilities,
      },
    }) => ({
      status,
      isSaving,
      canPublish: Boolean(capabilities?.publish),
    })
  );

  const isPending = 'pending' === status;
  const isDraft = ['draft', 'auto-draft'].includes(status) || !status;
  const isDraftOrPending = isDraft || isPending;

  const { hasMetaBoxes, isSavingMetaBoxes } = useMetaBoxes(
    ({ state: { hasMetaBoxes, isSavingMetaBoxes } }) => ({
      hasMetaBoxes,
      isSavingMetaBoxes,
    })
  );

  return (
    <ButtonList>
      <List>
        <UndoButton />
        <RedoButton />
        <IconWithSpinner>
          <PreviewButton forceIsSaving={isSavingMetaBoxes} />
          {isSaving && <Loading />}
        </IconWithSpinner>
        {isDraft && (
          <DraftButtons
            forceIsSaving={isSavingMetaBoxes}
            hasUpdates={hasMetaBoxes}
          />
        )}
        {isPending && (
          <PendingButtons
            forceIsSaving={isSavingMetaBoxes}
            hasUpdates={hasMetaBoxes}
            canPublish={canPublish}
          />
        )}
        {!isDraftOrPending && (
          <PublishedButtons
            forceIsSaving={isSavingMetaBoxes}
            hasUpdates={hasMetaBoxes}
          />
        )}
      </List>
    </ButtonList>
  );
}

export default Buttons;
