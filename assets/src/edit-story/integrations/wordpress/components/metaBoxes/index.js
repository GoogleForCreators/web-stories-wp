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
import { useFeature } from 'flagged';
import { useEffect } from 'react';

/**
 * Internal dependencies
 */
import { useConfig } from '../../../../app/config';
import MetaBoxesArea from './metaBoxesArea';

const Wrapper = styled.div``;

function MetaBoxes() {
  const isFeatureEnabled = useFeature('customMetaBoxes');

  const { postType, metaBoxes = {} } = useConfig();

  useEffect(() => {
    // Allow toggling metaboxes panels.
    // We need to wait for all scripts to load.
    // If the meta box loads the post script, it will already trigger this.
    // See https://github.com/WordPress/gutenberg/blob/148e2b28d4cdd4465c4fe68d97fcee154a6b209a/packages/edit-post/src/store/effects.js#L25-L35
    const timeout = setTimeout(() => {
      if (window.postboxes?.page !== postType) {
        window.postboxes?.add_postbox_toggles(postType);
      }
    });

    return () => {
      clearTimeout(timeout);
    };
  }, [postType]);

  if (!isFeatureEnabled) {
    return null;
  }

  const locations = Object.keys(metaBoxes);

  return (
    <Wrapper>
      {locations.map((location) => {
        const isVisible = Boolean(metaBoxes[location]?.length);
        return (
          isVisible && <MetaBoxesArea key={location} location={location} />
        );
      })}
    </Wrapper>
  );
}

export default MetaBoxes;
