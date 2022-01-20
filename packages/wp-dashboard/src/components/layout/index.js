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
import { InterfaceSkeleton } from '@googleforcreators/dashboard';

/**
 * Internal dependencies
 */
import { useAdminSubMenu } from '../../effects';
import { EditorSettingsProvider, EditorSettings } from '../editorSettings';
import TelemetryBanner from '../telemetryBanner';
import { EDITOR_SETTINGS_ROUTE } from '../../constants';

function Layout() {
  useAdminSubMenu();

  return (
    <EditorSettingsProvider>
      <InterfaceSkeleton
        additionalRoutes={[
          {
            path: EDITOR_SETTINGS_ROUTE,
            component: <EditorSettings />,
          },
        ]}
      />
      <TelemetryBanner />
    </EditorSettingsProvider>
  );
}

export default Layout;
