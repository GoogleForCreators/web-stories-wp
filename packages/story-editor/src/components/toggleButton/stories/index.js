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
import styled from 'styled-components';
import { Icons } from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { ToggleButton } from '..';

export default {
  title: 'Stories Editor/Components/ToggleButton',
  args: {
    ariaLabel: 'my help center label',
    isOpen: false,
    notificationCount: 0,
  },
  argTypes: {
    helpCenterClick: { action: 'help center clicked' },
    checklistClicked: { action: 'checklist clicked' },
  },
};

const Container = styled.div`
  margin: 20px;
  display: grid;
  grid-gap: 8px;
  padding: 8px;
  grid-template-columns: 200px 200px;
  background-color: ${({ theme }) => theme.colors.bg.primary};
`;

export const _default = (args) => (
  <Container>
    <ToggleButton
      label="Help"
      MainIcon={Icons.QuestionMarkOutline}
      onClick={() => args.helpCenterClick()}
      aria-owns="my popupId"
      {...args}
    />
    <ToggleButton
      label="Checklist"
      MainIcon={Icons.Checkbox}
      onClick={() => args.checklistClicked()}
      aria-owns="my popupId"
      {...args}
    />
  </Container>
);
