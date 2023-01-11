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
import { useCallback, useEffect, useState } from '@googleforcreators/react';
import { __ } from '@googleforcreators/i18n';
import { Text, TextSize } from '@googleforcreators/design-system';
import { Dialog, useStory } from '@googleforcreators/story-editor';

function PostReviewDialog() {
  const { isFreshlyPending } = useStory(
    ({
      state: {
        meta: { isFreshlyPending },
      },
    }) => ({
      isFreshlyPending,
    })
  );

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => setIsOpen(isFreshlyPending), [isFreshlyPending]);

  const onClose = useCallback(() => setIsOpen(false), []);

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={__('Submitted for Review.', 'web-stories')}
      primaryText={__('Dismiss', 'web-stories')}
      onPrimary={onClose}
    >
      <Text.Paragraph size={TextSize.Small}>
        {__(
          'Your Story has been successfully submitted for review.',
          'web-stories'
        )}
      </Text.Paragraph>
    </Dialog>
  );
}

export default PostReviewDialog;
