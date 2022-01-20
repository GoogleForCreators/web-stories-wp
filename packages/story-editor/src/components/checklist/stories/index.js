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
import styled from 'styled-components';
/**
 * Internal dependencies
 */
import { Checklist } from '..';
import { noop } from '../../../utils/noop';
import Popup, { NavigationWrapper, TopNavigation } from '../../secondaryPopup';
import { EmptyContent } from '../checklistContent';

export default {
  title: 'Stories Editor/Components/Checklist',
  component: Checklist,
};

const Page = styled.div`
  position: relative;
  display: flex;
  align-items: flex-end;
  height: 300px;
  width: 900px;
  background-color: ${({ theme }) => theme.colors.bg.primary};
`;

const Container = styled.div`
  position: relative;
  margin-left: 20px;
  margin-bottom: 10px;
`;

export const EmptyState = () => {
  return (
    <Page>
      <Container>
        <Popup
          popupId={'1234'}
          isOpen
          ariaLabel={__('Checklist', 'web-stories')}
        >
          <NavigationWrapper>
            <TopNavigation
              onClose={noop}
              label={__('Checklist', 'web-stories')}
              popupId={'1234'}
            />
            <EmptyContent />
          </NavigationWrapper>
        </Popup>
      </Container>
    </Page>
  );
};
