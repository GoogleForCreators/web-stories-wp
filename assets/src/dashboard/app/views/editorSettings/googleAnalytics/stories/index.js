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
import { action } from '@storybook/addon-actions';
import { boolean, text } from '@storybook/addon-knobs';

/**
 * Internal dependencies
 */
import GoogleAnalyticsSettings from '../';

export default {
  title: 'Dashboard/Views/EditorSettings/GoogleAnalytics',
  component: GoogleAnalyticsSettings,
};

export const _default = () => {
  return (
    <GoogleAnalyticsSettings
      onUpdateGoogleAnalyticsId={action('update google analytics id submitted')}
      googleAnalyticsId={text('googleAnalyticsId', 'UA-000000-98')}
      siteKitStatus={{
        installed: boolean('installed', false),
        active: boolean('siteKitActive', false),
        analyticsActive: boolean('analyticsActive', false),
        link: text('link', ''),
      }}
    />
  );
};
