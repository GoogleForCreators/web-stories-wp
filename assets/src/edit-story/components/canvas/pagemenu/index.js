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

/**
 * WordPress dependencies
 */
import { useCallback } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { useStory, useHistory } from '../../../app';
import { createPage } from '../../../elements';
import { ReactComponent as Delete } from '../../../icons/delete_icon.svg';
import { ReactComponent as Duplicate } from '../../../icons/duplicate_icon.svg';
import { ReactComponent as Undo } from '../../../icons/undo_icon.svg';
import { ReactComponent as Redo } from '../../../icons/redo_icon.svg';
import { ReactComponent as Add } from '../../../icons/add_page.svg';
import { ReactComponent as Layout } from '../../../icons/layout_helper.svg';
import { ReactComponent as Text } from '../../../icons/text_helper.svg';

const HEIGHT = 28;

const Wrapper = styled.div`
  display: flex;
  align-items: flex-end;
  height: ${20 + HEIGHT}px;
`;

const Box = styled.div`
  background-color: ${({ theme }) => theme.colors.bg.v1};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: ${HEIGHT}px;
  width: 100%;
`;

const PageCount = styled.div`
  color: ${({ theme }) => theme.colors.fg.v1};
  width: 62px;
  font-family: ${({ theme }) => theme.fonts.body1.family};
  font-size: ${({ theme }) => theme.fonts.body1.size};
  line-height: 24px;
`;

const Options = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.fg.v2};
`;

const Divider = styled.span`
  background-color: ${({ theme }) => theme.colors.fg.v1};
  opacity: 0.3;
  height: ${HEIGHT}px;
  width: 1px;
`;

const Space = styled.div`
  width: ${({ isDouble }) => (isDouble ? 20 : 10)}px;
`;

const Icon = styled.button`
  cursor: pointer;
  background: transparent;
  border: 0;
  padding: 0;
  display: block;
  color: ${({ theme }) => theme.colors.fg.v1};

  ${({ disabled }) =>
    disabled &&
    `
	opacity: .3;
	pointer-events: none;
	`}

  svg {
    width: 28px;
    height: 28px;
    display: block;
  }
`;

function PageMenu() {
  const {
    state: { canUndo, canRedo },
    actions: { undo, redo },
  } = useHistory();
  const {
    state: { currentPageNumber, currentPage },
    actions: { deleteCurrentPage, addPage },
  } = useStory();

  const handleDeletePage = useCallback(() => deleteCurrentPage(), [
    deleteCurrentPage,
  ]);

  const handleAddPage = useCallback(() => addPage({ page: createPage() }), [
    addPage,
  ]);

  const handleDuplicatePage = useCallback(
    () => addPage({ page: createPage(currentPage) }),
    [addPage, currentPage]
  );

  const handleUndo = useCallback(() => undo(), [undo]);

  const handleRedo = useCallback(() => redo(), [redo]);

  if (!currentPage) {
    return null;
  }

  return (
    <Wrapper>
      <Box>
        <Options>
          <PageCount>{`Page ${currentPageNumber}`}</PageCount>
          <Space />
          <Icon onClick={handleDeletePage}>
            <Delete />
          </Icon>
          <Space />
          <Icon onClick={handleDuplicatePage}>
            <Duplicate />
          </Icon>
          <Space />
          <Icon onClick={handleAddPage}>
            <Add />
          </Icon>
          <Space />
          <Divider />
          <Space />
          <Icon disabled={!canUndo} onClick={handleUndo}>
            <Undo />
          </Icon>
          <Space />
          <Icon disabled={!canRedo} onClick={handleRedo}>
            <Redo />
          </Icon>
        </Options>
        <Options>
          <Icon disabled>
            <Layout />
          </Icon>
          <Space isDouble />
          <Icon disabled>
            <Text />
          </Icon>
        </Options>
      </Box>
    </Wrapper>
  );
}

export default PageMenu;
