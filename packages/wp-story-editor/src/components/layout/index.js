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
import { InterfaceSkeleton } from '@googleforcreators/story-editor';
import { __ } from '@googleforcreators/i18n';

/**
 * Internal dependencies
 */
import { default as Header } from '../header';
import { MetaBoxes, MetaBoxesProvider } from '../metaBoxes';
import DocumentPane, {
  PublishModalDocumentPane,
  IsolatedStatusPanel,
} from '../documentPane';
import { Priority, Design, Accessibility } from '../checklist';
import { Footer } from '../helpCenter';

function Layout() {
  return (
    <MetaBoxesProvider>
      <InterfaceSkeleton
        header={<Header />}
        footer={{
          secondaryMenu: {
            helpCenter: {
              Footer,
            },
            checklist: {
              Priority,
              Design,
              Accessibility,
            },
          },
        }}
        sidebarTabs={{
          document: {
            title: __('Document', 'web-stories'),
            Pane: DocumentPane,
          },
          publishModal: {
            DocumentPane: PublishModalDocumentPane,
            IsolatedStatusPanel: IsolatedStatusPanel,
          },
        }}
      >
        <MetaBoxes />
      </InterfaceSkeleton>
    </MetaBoxesProvider>
  );
}

export default Layout;
