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
import { rgba } from 'polished';
import { useState, useCallback } from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { useMetaBoxes } from '../../integrations/wordpress/metaBoxes';
import {
  GridView as GridViewButton,
  MetaBoxes as MetaBoxesButton,
  Plain,
} from '../button';
import Modal from '../modal';
import WithTooltip from '../tooltip';
import { Placement } from '../popup';
import KeyboardShortcutsMenu from '../keyboardShortcutsMenu';
import GridView from './gridview';

const Wrapper = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  width: 100%;
  height: 100%;
`;

const MenuItems = styled.div`
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  margin: 0 16px 16px 0;
`;

const Box = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PlainStyled = styled(Plain)`
  background-color: ${({ theme }) => rgba(theme.colors.fg.white, 0.1)};
  color: ${({ theme }) => rgba(theme.colors.fg.white, 0.86)};
  &:hover {
    background-color: ${({ theme }) => rgba(theme.colors.fg.white, 0.25)};
  }
`;

const StyledGridViewButton = styled(GridViewButton).attrs({
  height: '16',
  width: '16',
})``;

const GridViewContainer = styled.section.attrs({
  'aria-label': __('Grid View', 'web-stories'),
})`
  flex: 1;
  margin: 70px 170px 70px 170px;
  pointer-events: all;
`;

const StyledMetaBoxesButton = styled(MetaBoxesButton).attrs({
  height: '24',
  width: '24',
})``;

function CarouselMenu() {
  const [isGridViewOpen, setIsGridViewOpen] = useState(false);
  const openModal = useCallback(() => setIsGridViewOpen(true), []);
  const closeModal = useCallback(() => setIsGridViewOpen(false), []);

  const { toggleMetaBoxesVisible, hasMetaBoxes } = useMetaBoxes(
    ({ state, actions }) => ({
      hasMetaBoxes: state.hasMetaBoxes,
      toggleMetaBoxesVisible: actions.toggleMetaBoxesVisible,
    })
  );

  return (
    <>
      <Wrapper>
        <MenuItems>
          {hasMetaBoxes && (
            <Box>
              <WithTooltip
                title={__('Third-Party Meta Boxes', 'web-stories')}
                placement={Placement.TOP}
              >
                <StyledMetaBoxesButton
                  onClick={toggleMetaBoxesVisible}
                  aria-label={__('Third-Party Meta Boxes', 'web-stories')}
                />
              </WithTooltip>
            </Box>
          )}
          <Box>
            <KeyboardShortcutsMenu />
          </Box>
          <Box>
            <WithTooltip
              title={__('Grid View', 'web-stories')}
              placement={Placement.TOP}
            >
              <StyledGridViewButton
                onClick={openModal}
                aria-label={__('Grid View', 'web-stories')}
              />
            </WithTooltip>
          </Box>
        </MenuItems>
      </Wrapper>
      <Modal
        open={isGridViewOpen}
        onClose={closeModal}
        contentLabel={__('Grid View', 'web-stories')}
        overlayStyles={{
          alignItems: 'flex-start',
        }}
        contentStyles={{
          pointerEvents: 'none',
          flex: 1,
        }}
      >
        <GridViewContainer>
          <PlainStyled onClick={closeModal}>
            {__('Back', 'web-stories')}
          </PlainStyled>
          <GridView />
        </GridViewContainer>
      </Modal>
    </>
  );
}

export default CarouselMenu;
