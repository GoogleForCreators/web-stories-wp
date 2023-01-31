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
import type { PropsWithChildren } from 'react';

/**
 * Internal dependencies
 */
import GroupLabel from './groupLabel';
import { ListGroup } from './components';

interface ListProps {
  isManyGroups?: boolean;
  label?: string;
  listId?: string;
  role?: 'menu' | 'listbox' | 'group';
}

const List = ({
  isManyGroups,
  label,
  listId,
  children,
  role = 'group',
}: PropsWithChildren<ListProps>) => {
  const groupAria = isManyGroups
    ? { 'aria-label': label }
    : { 'aria-labelledby': listId };

  return (
    <ListGroup role={role} {...groupAria}>
      {label && <GroupLabel label={label} />}
      {children}
    </ListGroup>
  );
};

export default List;
