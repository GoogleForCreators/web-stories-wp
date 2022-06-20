/*
 * Copyright 2022 Google LLC
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
import { ContextMenuComponents } from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { useFeature } from 'flagged';
import { RIGHT_CLICK_MENU_LABELS } from '../constants';
import { states, useHighlights } from '../../highlights';
import { MediaUploadButton } from '../../../components/form';
import useOnMediaSelect from '../../../components/library/panes/media/local/useOnMediaSelect';
import LibraryProvider from '../../../components/library/libraryProvider';
import { useMediaRecording } from '../../../components/mediaRecording';
import useFFmpeg from '../../media/utils/useFFmpeg';
import { MenuPropType } from './shared';

const MediaButton = () => {
  const { onSelect } = useOnMediaSelect();

  return (
    <MediaUploadButton
      renderButton={(open) => (
        <ContextMenuComponents.MenuButton onClick={open}>
          {RIGHT_CLICK_MENU_LABELS.UPLOAD_IMAGE_OR_VIDEO}
        </ContextMenuComponents.MenuButton>
      )}
      onInsert={onSelect}
    />
  );
};

function EmptyStateMenu() {
  const { setHighlights } = useHighlights(({ setHighlights }) => ({
    setHighlights,
  }));
  const { toggleRecordingMode } = useMediaRecording(({ actions }) => ({
    toggleRecordingMode: actions.toggleRecordingMode,
  }));
  const enableMediaRecording = useFeature('mediaRecording');
  const { isTranscodingEnabled } = useFFmpeg();

  return (
    <>
      <ContextMenuComponents.MenuButton
        onClick={() => {
          setHighlights({
            highlight: states.MEDIA,
          });
        }}
      >
        {RIGHT_CLICK_MENU_LABELS.CHOOSE_IMAGE_OR_VIDEO}
      </ContextMenuComponents.MenuButton>
      <LibraryProvider>
        <MediaButton />
      </LibraryProvider>
      {/* `isTranscodingEnabled` already checks for `hasUploadMediaAction` */}
      {enableMediaRecording && isTranscodingEnabled && (
        <ContextMenuComponents.MenuButton onClick={toggleRecordingMode}>
          {RIGHT_CLICK_MENU_LABELS.RECORD_VIDEO}
        </ContextMenuComponents.MenuButton>
      )}
      <ContextMenuComponents.MenuButton
        onClick={() => {
          setHighlights({
            highlight: states.PAGE_TEMPLATES,
          });
        }}
      >
        {RIGHT_CLICK_MENU_LABELS.BROWSE_PAGE_TEMPLATES}
      </ContextMenuComponents.MenuButton>
      <ContextMenuComponents.MenuButton
        onClick={() => {
          setHighlights({
            highlight: states.MEDIA3P,
          });
        }}
      >
        {RIGHT_CLICK_MENU_LABELS.BROWSE_STOCK_IMAGES_AND_VIDEO}
      </ContextMenuComponents.MenuButton>
    </>
  );
}
EmptyStateMenu.propTypes = MenuPropType;

export default EmptyStateMenu;
