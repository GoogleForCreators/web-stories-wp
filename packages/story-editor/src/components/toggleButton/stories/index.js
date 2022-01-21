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
import { action } from '@storybook/addon-actions';
import { boolean, number, text } from '@storybook/addon-knobs';
import styled from 'styled-components';
import { Icons } from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { ToggleButton } from '..';

export default {
  title: 'Stories Editor/Components/ToggleButton',
};

const Container = styled.div`
  margin: 20px;
  display: grid;
  grid-gap: 8px;
  padding: 8px;
  grid-template-columns: 200px 200px;
  background-color: ${({ theme }) => theme.colors.bg.primary};
`;
const HelpCenterIcon = styled(Icons.QuestionMarkOutline)`
  height: 32px;
  width: auto;
  display: block;
`;

const ChecklistIcon = styled(Icons.Checkbox)`
  height: 32px;
  width: auto;
  display: block;
`;

export const _default = () => (
  <Container>
    <ToggleButton
      label="Help"
      MainIcon={HelpCenterIcon}
      onClick={() => action('help center clicked')()}
      aria-owns="my popupId"
      aria-label={text('help center aria-label', 'my help center label')}
      isOpen={boolean('help center is open', false)}
      notificationCount={number('help center notification count', 0)}
    />
    <ToggleButton
      label="Checklist"
      MainIcon={ChecklistIcon}
      onClick={() => action('checklist clicked')()}
      aria-owns="my popupId"
      aria-label={text('checklist aria-label', 'my checklist label')}
      isOpen={boolean('checklist is open', false)}
      notificationCount={number('checklist notification count', 0)}
    />
  </Container>
);
