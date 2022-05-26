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
import {
  useEffect,
  usePrevious,
  useRef,
  useState,
} from '@googleforcreators/react';
import { __, sprintf } from '@googleforcreators/i18n';
import { trackScreenView } from '@googleforcreators/tracking';
import { Snackbar, useSnackbar } from '@googleforcreators/design-system';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { ExploreTemplatesView, MyStoriesView } from '../../app/views';
import { APP_ROUTES, ROUTE_TITLES } from '../../constants';
import { Route, useRouteHistory } from '../../app/router';
import { AppFrame, LeftRail, PageContent } from '../pageStructure';
import useApiAlerts from '../../app/api/useApiAlerts';
import FiltersProvider from '../../app/views/myStories/filters/provider';
import useApi from '../../app/api/useApi';
import { useConfig } from '../../app/config';

const InterfaceSkeleton = ({ additionalRoutes }) => {
  const { currentPath, templateId, availableRoutes } = useRouteHistory(
    ({ state }) => ({
      ...state,
      templateId: state.queryParams.id,
    })
  );
  const { push, setAvailableRoutes } = useRouteHistory(
    ({ actions }) => actions
  );

  const {
    canViewDefaultTemplates,
    leftRailSecondaryNavigation = [],
    documentTitleSuffix = __('Web Stories', 'web-stories'),
  } = useConfig();

  const { addInitialFetchListener } = useApi(
    ({
      actions: {
        storyApi: { addInitialFetchListener },
      },
      state: {
        templates: { templates },
      },
    }) => ({
      currentTemplate:
        templateId !== undefined ? templates[templateId]?.title : undefined,
      addInitialFetchListener,
    })
  );
  const isFirstLoadOnMyStories = useRef(currentPath === APP_ROUTES.DASHBOARD);
  const [isRedirectComplete, setIsRedirectComplete] = useState(
    !isFirstLoadOnMyStories.current
  );

  // Direct user to templates on first load if they
  // have no stories created.
  useEffect(() => {
    return addInitialFetchListener?.((storyStatuses) => {
      if (
        storyStatuses?.all <= 0 &&
        isFirstLoadOnMyStories.current &&
        canViewDefaultTemplates
      ) {
        push(APP_ROUTES.TEMPLATES_GALLERY);
      }
      setIsRedirectComplete(true);
    });
  }, [addInitialFetchListener, push, currentPath, canViewDefaultTemplates]);

  // Only set the available routes & default route on initial mount
  useEffect(() => {
    if (availableRoutes.length > 0) {
      return;
    }
    const additionalPaths = additionalRoutes
      ? additionalRoutes.map(({ path }) => path)
      : [];
    setAvailableRoutes([...Object.values(APP_ROUTES), ...additionalPaths]);
  }, [additionalRoutes, availableRoutes.length, setAvailableRoutes]);

  useEffect(() => {
    if (!isRedirectComplete) {
      return;
    }

    const additionalRouteTitle = leftRailSecondaryNavigation.find(
      (config) => config.value === currentPath
    );
    const dynamicPageTitle =
      ROUTE_TITLES[currentPath] ||
      additionalRouteTitle?.label ||
      ROUTE_TITLES.DEFAULT;

    document.title = sprintf(
      /* translators: Admin screen title. 1: Admin screen name, 2: Network or site name. */
      __('%1$s \u2039 %2$s', 'web-stories'),
      dynamicPageTitle,
      documentTitleSuffix
    );

    trackScreenView(dynamicPageTitle);
  }, [
    currentPath,
    isRedirectComplete,
    leftRailSecondaryNavigation,
    documentTitleSuffix,
  ]);

  useApiAlerts();
  const { clearSnackbar, removeSnack, placement, currentSnacks } =
    useSnackbar();

  // if the current path changes clear the snackbar
  const prevPath = usePrevious(currentPath);

  useEffect(() => {
    if (currentPath !== prevPath) {
      clearSnackbar();
    }
  }, [clearSnackbar, currentPath, prevPath]);

  return (
    <>
      <AppFrame>
        <LeftRail />
        <PageContent>
          <Route
            exact
            isDefault
            path={APP_ROUTES.DASHBOARD}
            component={
              <FiltersProvider>
                <MyStoriesView />
              </FiltersProvider>
            }
          />
          {canViewDefaultTemplates && (
            <Route
              path={APP_ROUTES.TEMPLATES_GALLERY}
              component={<ExploreTemplatesView />}
            />
          )}
          {additionalRoutes &&
            additionalRoutes.map((routeProps) => (
              <Route key={routeProps.path} {...routeProps} />
            ))}
        </PageContent>
      </AppFrame>
      <Snackbar.Container
        notifications={currentSnacks}
        onRemove={removeSnack}
        placement={placement}
        max={1}
      />
    </>
  );
};

InterfaceSkeleton.propTypes = {
  additionalRoutes: PropTypes.array,
};

export default InterfaceSkeleton;
