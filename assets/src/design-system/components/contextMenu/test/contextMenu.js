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

/**
 * Internal dependencies
 */
import { ContextMenu } from '..';
import { MenuItem, linkOrButtonValidator } from '../menuItem';
import { renderWithProviders } from '../../../testUtils/renderWithProviders';
import { noop } from '../../../utils';

const items = [
  { label: 'this is a button', onClick: noop },
  { label: 'this is a link', href: 'my-link' },
  { label: 'this is neither a button nor a link' },
];

describe('ContextMenu', () => {
  it('contextMenu should be invisible', () => {
    const { queryByRole } = renderWithProviders(<ContextMenu items={items} />);

    expect(queryByRole('button')).not.toBeInTheDocument();
    expect(queryByRole('link')).not.toBeInTheDocument();
  });

  it('contextMenu should be visible', () => {
    const { getByRole } = renderWithProviders(
      <ContextMenu items={items} isOpen />
    );

    expect(getByRole('button')).toBeInTheDocument();
    expect(getByRole('link')).toBeInTheDocument();
  });
});

describe('MenuItem', () => {
  it('should render a button if `onClick` is passed as a prop', () => {
    const { queryByRole, getByText } = renderWithProviders(
      <MenuItem label="my label" onClick={noop} />
    );

    expect(getByText('my label')).toBeInTheDocument();
    expect(queryByRole('button')).toBeInTheDocument();
    expect(queryByRole('link')).not.toBeInTheDocument();
  });

  it('should render a link if `href` is passed as a prop', () => {
    const { queryByRole, getByText } = renderWithProviders(
      <MenuItem label="my label" href="test" />
    );

    expect(getByText('my label')).toBeInTheDocument();
    expect(queryByRole('button')).not.toBeInTheDocument();
    expect(queryByRole('link')).toBeInTheDocument();
  });

  it('should render a div if neither `onClick` nor `href` are passed as props', () => {
    const { queryByRole, getByText } = renderWithProviders(
      <MenuItem label="my label" />
    );

    expect(getByText('my label')).toBeInTheDocument();
    expect(queryByRole('button')).not.toBeInTheDocument();
    expect(queryByRole('link')).not.toBeInTheDocument();
  });
});

describe('linkOrButtonValidator', () => {
  it('should return null only `onClick` or `href` included', () => {
    expect(linkOrButtonValidator({ onClick: noop }, '', 'Test')).toBeNull();
    expect(linkOrButtonValidator({ href: 'test' }, '', 'Test')).toBeNull();
  });

  it('should throw an error if `onClick` and `href` both included', () => {
    expect(
      linkOrButtonValidator({ onClick: noop, href: 'test' }, '', 'Test')
    ).toStrictEqual(expect.any(Error));
  });

  it('should throw an error if `href` and `disabled` are both included', () => {
    expect(
      linkOrButtonValidator({ disabled: true, href: 'test' }, '', 'Test')
    ).toStrictEqual(expect.any(Error));
  });
});
