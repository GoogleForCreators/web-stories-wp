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
 * Internal dependencies
 */
import { useKeyDownEffect } from '../keyboard';
import useFocusOut from '../../utils/useFocusOut';
import ShortcutLabel from './shortcutLabel';
import { KEYBOARD_SHORTCUTS } from './constants';
import {
  Container,
  Panel,
  HeaderRow,
  MenuHeader,
  SectionHeader,
  SectionWrapper,
  SectionContent,
  ContentWrapper,
  Column,
  Label,
  Note,
} from './components';

function ShortcutMenu({ toggleMenu }) {
  const containerRef = useRef();

  // Filter out disabled keyboard shortcuts for headers, panels, sections
  const headers = useMemo(
    () => KEYBOARD_SHORTCUTS.headers.filter((o) => !o.disabled),
    []
  );
  const panels = useMemo(
    () => KEYBOARD_SHORTCUTS.panels.filter((o) => !o.disabled),
    []
  );
  const sections = useMemo(
    () =>
      KEYBOARD_SHORTCUTS.sections.map((section) => ({
        ...section,
        commands: section.commands.filter((o) => !o.disabled),
      })),
    []
  );

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
        <SectionHeader>{title}</SectionHeader>
        <SectionContent>
          {commands.map(({ label, shortcut }) => (
            <Fragment key={label}>
              <Label>{label}</Label>
              <ShortcutLabel keys={shortcut} alignment={'left'} />
            </Fragment>
          ))}
        </SectionContent>
      </SectionWrapper>
    ),
    []
  );

  useFocusOut(containerRef, (e) => toggleMenu(e, false), [toggleMenu]);
  useKeyDownEffect(containerRef, { key: 'esc' }, (e) => toggleMenu(e, false), [
    toggleMenu,
  ]);

  useEffect(() => {
    containerRef.current.focus?.();
  }, []);

  return (
    <Container ref={containerRef}>
      {headers.map(({ label, shortcut }) => (
        <HeaderRow key={label}>
          <MenuHeader>{label}</MenuHeader>
          <ShortcutLabel keys={shortcut} />
        </HeaderRow>
      ))}
      {panels.map(({ label, shortcut }) => (
        <Panel key={label}>
          <Note>{label}</Note>
          <ShortcutLabel keys={shortcut} />
        </Panel>
      ))}
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
