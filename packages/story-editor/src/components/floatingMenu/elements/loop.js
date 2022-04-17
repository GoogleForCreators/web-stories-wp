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
import styled from 'styled-components';
import { trackEvent } from '@googleforcreators/tracking';

/**
 * Internal dependencies
 */
import { useStory } from '../../../app';
import LoopPanelContent from '../../panels/shared/loopPanelContent';
import { useProperties } from './shared';

const StyledLoopContent = styled(LoopPanelContent)`
  gap: 8px;
`;

function Loop() {
  const { loop } = useProperties(['loop']);
  const updateSelectedElements = useStory(
    (state) => state.actions.updateSelectedElements
  );

  const handleChange = () => {
    trackEvent('floating_menu', {
      name: 'set_loop',
    });

    updateSelectedElements({
      properties: ({ loop: oldLoop }) => ({ loop: !oldLoop }),
    });
  };

  return (
    <StyledLoopContent tabIndex={-1} loop={loop} onChange={handleChange} />
  );
}

export default Loop;
