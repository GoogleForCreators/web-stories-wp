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
import { Fragment, useMemo, useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Close as CloseIcon } from '../../icons';
import { useKeyDownEffect } from '../keyboard';
import getKeyboardShortcuts from './getKeyboardShortcuts';
import ShortcutLabel from './shortcutLabel';
import {
  Container,
  PanelsWrapper,
  Panel,
  HeaderWrapper,
  HeaderRow,
  MenuHeaderContainer,
  MenuHeader,
  SectionHeader,
  SectionWrapper,
  SectionContent,
  ContentWrapper,
  Column,
  Label,
  PanelLabel,
  CloseButton,
} from './styled';
import { TOGGLE_SHORTCUTS_MENU } from './constants';

function ShortcutMenu({ toggleMenu }) {
  const containerRef = useRef();
  const closeRef = useRef();
  const keyboardShortcuts = useMemo(() => getKeyboardShortcuts(), []);

  // Filter out disabled keyboard shortcuts for headers, panels, sections
  const headers = useMemo(
    () => keyboardShortcuts.headers.filter((o) => !o.disabled),
    [keyboardShortcuts]
  );
  const panels = useMemo(
    () => keyboardShortcuts.panels.filter((o) => !o.disabled),
    [keyboardShortcuts]
  );
  const sections = useMemo(
    () =>
      keyboardShortcuts.sections.map((section) => ({
        ...section,
        commands: section.commands.filter((o) => !o.disabled),
      })),
    [keyboardShortcuts]
  );

  const headerLabels = useMemo(() => headers.map((h) => h.label).join(' '), [
    headers,
  ]);

  const leftHalfCount = Math.ceil(sections.length / 2);
  const { leftSideSections, rightSideSections } = useMemo(
    () =>
      sections.reduce(
        ({ leftSideSections, rightSideSections }, section, index) => {
          if (index < leftHalfCount) {
            return {
              leftSideSections: [...leftSideSections, section],
              rightSideSections,
            };
          } else {
            return {
              leftSideSections,
              rightSideSections: [...rightSideSections, section],
            };
          }
        },
        {
          leftSideSections: [],
          rightSideSections: [],
        }
      ),
    [sections, leftHalfCount]
  );

  const renderSection = useCallback(
    ({ title, commands }) => (
      <SectionWrapper key={title}>
        <SectionHeader id={title}>{title}</SectionHeader>
        <SectionContent role="group" aria-labelledby={title}>
          {commands.map(({ label, shortcut }) => (
            <Fragment key={label}>
              <Label role="listitem">{label}</Label>
              <ShortcutLabel
                role="listitem"
                keys={shortcut}
                alignment={'left'}
              />
            </Fragment>
          ))}
        </SectionContent>
      </SectionWrapper>
    ),
    []
  );

  const handleCloseClick = useCallback((e) => toggleMenu(e, false), [
    toggleMenu,
  ]);

  useEffect(() => {
    closeRef.current.focus?.();
  }, []);

  useKeyDownEffect(containerRef, TOGGLE_SHORTCUTS_MENU, toggleMenu, [
    toggleMenu,
  ]);

  return (
    <Container ref={containerRef} role="list" aria-labelledby={headerLabels}>
      <CloseButton
        ref={closeRef}
        onClick={handleCloseClick}
        title={__('Close menu', 'web-stories')}
        aria-label={__('Close menu', 'web-stories')}
      >
        <CloseIcon width="14px" height="14px" />
      </CloseButton>
      <HeaderWrapper role="group">
        {headers.map(({ label, shortcut }) => (
          <HeaderRow key={label}>
            <MenuHeaderContainer role="listitem">
              <MenuHeader id={label}>{label}</MenuHeader>
            </MenuHeaderContainer>
            <ShortcutLabel role="listitem" keys={shortcut} />
          </HeaderRow>
        ))}
      </HeaderWrapper>
      <PanelsWrapper role="group">
        {panels.map(({ label, shortcut }) => (
          <Panel key={label}>
            <PanelLabel role="listitem">{label}</PanelLabel>
            <ShortcutLabel keys={shortcut} role="listitem" />
          </Panel>
        ))}
      </PanelsWrapper>
      <ContentWrapper>
        <Column>{leftSideSections.map(renderSection)}</Column>
        <Column>{rightSideSections.map(renderSection)}</Column>
      </ContentWrapper>
    </Container>
  );
}

ShortcutMenu.propTypes = {
  toggleMenu: PropTypes.func.isRequired,
};

export default ShortcutMenu;
