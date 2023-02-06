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
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import {
  Button,
  ButtonSize,
  ButtonType,
  ButtonVariant,
  Icons,
  Text,
  TextSize,
  themeHelpers,
  useLiveRegion,
} from '@googleforcreators/design-system';
import { useState, useCallback } from '@googleforcreators/react';
import { __ } from '@googleforcreators/i18n';

/**
 * Internal dependencies
 */
import { Row } from '../../../form';
import Tooltip from '../../../tooltip';
import DropDownMenu from './dropDownMenu';

const InputRow = styled.div`
  flex-grow: 1;
  margin: 0 8px;
  min-width: 0;
`;

const ReplaceIcon = styled(Icons.Rotate)`
  vertical-align: bottom;
`;

const LinkIcon = styled(Icons.Link)`
  width: 24px;
  height: 24px;
  vertical-align: bottom;
`;

const UploadIcon = styled(Icons.ArrowOutline)`
  width: 24px;
  height: 24px;
  vertical-align: bottom;
`;

const Link = styled.a`
  ${({ theme }) => css`
    color: ${theme.colors.fg.primary};
    text-decoration: none;
    cursor: pointer;

    :hover,
    :active,
    :focus {
      text-decoration: underline;
      /* Override WordPress's common css */
      color: ${theme.colors.fg.primary} !important;
    }

    ${themeHelpers.focusableOutlineCSS(theme.colors.border.focus)}
  `};
`;

const StyledButton = styled(Button)`
  ${({ theme }) =>
    themeHelpers.focusableOutlineCSS(
      theme.colors.border.focus,
      theme.colors.bg.secondary
    )};
`;

const FileName = styled(Text.Paragraph).attrs({
  size: TextSize.Small,
})`
  color: ${({ theme }) => theme.colors.fg.primary};
  text-overflow: ellipsis;
  overflow: hidden;
`;

function FileRow({
  id,
  isExternal,
  src,
  title,
  options,
  removeItemLabel,
  onRemove,
  children,
}) {
  const groups = [
    {
      options,
    },
  ];

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const speak = useLiveRegion();

  const onMenuOpen = () => setIsMenuOpen(true);
  const onMenuClose = () => setIsMenuOpen(false);
  const onMenuSelected = useCallback(
    (value) => {
      setIsMenuOpen(false);
      options.find((item) => item.value === value)?.onClick();
    },
    [options]
  );

  const onItemRemove = useCallback(() => {
    onRemove(id);
    speak(__('File removed', 'web-stories'));
  }, [id, onRemove, speak]);

  const label = isExternal
    ? __('External file', 'web-stories')
    : __('Local file', 'web-stories');

  return (
    <Row key={`row-filename-${id}`}>
      <Tooltip title={label}>
        {isExternal ? <LinkIcon title={label} /> : <UploadIcon title={label} />}
      </Tooltip>
      <InputRow>
        <FileName>
          <Link href={src} rel="noreferrer" target="_blank">
            {title}
          </Link>
        </FileName>
      </InputRow>
      {children}
      {options.length > 0 && (
        <DropDownMenu
          onMenuOpen={onMenuOpen}
          isMenuOpen={isMenuOpen}
          onMenuSelected={onMenuSelected}
          display
          onMenuClose={onMenuClose}
          groups={groups}
          ariaLabel={__('Replace file', 'web-stories')}
        >
          <Tooltip title={__('Replace', 'web-stories')}>
            <ReplaceIcon />
          </Tooltip>
        </DropDownMenu>
      )}
      <Tooltip hasTail title={removeItemLabel}>
        <StyledButton
          aria-label={removeItemLabel}
          type={ButtonType.Tertiary}
          size={ButtonSize.Small}
          variant={ButtonVariant.Square}
          onClick={onItemRemove}
        >
          <Icons.Trash />
        </StyledButton>
      </Tooltip>
    </Row>
  );
}

FileRow.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isExternal: PropTypes.bool,
  src: PropTypes.string,
  title: PropTypes.string,
  options: PropTypes.array,
  removeItemLabel: PropTypes.string,
  onRemove: PropTypes.func,
  children: PropTypes.node,
};

export default FileRow;
