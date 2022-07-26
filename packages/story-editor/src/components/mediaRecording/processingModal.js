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
import { __ } from '@googleforcreators/i18n';
import { Text } from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import Dialog from '../dialog';
import useMediaRecording from './useMediaRecording';

function ProcessingModal() {
  const isProcessingTrim = useMediaRecording(
    ({ state }) => state.isProcessingTrim
  );

  return (
    <Dialog
      isOpen={isProcessingTrim}
      contentLabel={__('Media Processing', 'web-stories')}
      title={__('Media Processing', 'web-stories')}
    >
      <Text>
        {__(
          'Video trimming in progress. Please wait up to a few minutes depending on output video length.',
          'web-stories'
        )}
      </Text>
    </Dialog>
  );
}

export default ProcessingModal;
