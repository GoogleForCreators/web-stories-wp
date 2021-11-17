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
  useMemo,
  usePrevious,
  useRef,
  useState,
} from '@web-stories-wp/react';
import { __, sprintf } from '@web-stories-wp/i18n';
import { trackScreenView } from '@web-stories-wp/tracking';
import { Snackbar, useSnackbar } from '@web-stories-wp/design-system';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import {
  ExploreTemplatesView,
  MyStoriesView,
  TemplateDetailsView,
} from '../../app/views';
import {
  ADMIN_TITLE,
  APP_ROUTES,
  NESTED_APP_ROUTES,
  ROUTE_TITLES,
} from '../../constants';
import { matchPath, Route, useRouteHistory } from '../../app/router';
import { AppFrame, LeftRail, PageContent } from '../pageStructure';
import useApiAlerts from '../../app/api/useApiAlerts';
import useApi from '../../app/api/useApi';

const InterfaceSkeleton = ({ additionalRoutes }) => {
  const {
    state: {
      currentPath,
      queryParams: { id: templateId },
    },
    actions: { push },
  } = useRouteHistory();
  const { currentTemplate, addInitialFetchListener } = useApi(
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
      if (storyStatuses?.all <= 0 && isFirstLoadOnMyStories.current) {
        push(APP_ROUTES.TEMPLATES_GALLERY);
      }
      setIsRedirectComplete(true);
    });
  }, [addInitialFetchListener, push, currentPath]);

  const fullPath = useMemo(() => {
    return currentPath.includes(APP_ROUTES.TEMPLATE_DETAIL) &&
      templateId &&
      currentTemplate
      ? `${currentPath}/${templateId}`
      : currentPath;
    // Disable reason: avoid sending duplicate tracking events.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPath, currentTemplate]);

  useEffect(() => {
    if (!isRedirectComplete) {
      return;
    }

    if (currentPath.includes(APP_ROUTES.TEMPLATE_DETAIL) && !currentTemplate) {
      return;
    }

    let dynamicPageTitle = ROUTE_TITLES[currentPath] || ROUTE_TITLES.DEFAULT;
    if (currentPath.includes(APP_ROUTES.TEMPLATE_DETAIL)) {
      dynamicPageTitle = sprintf(
        /* translators: %s: Template name. */
        __('Template: %s', 'web-stories'),
        currentTemplate
      );
    }

    document.title = sprintf(
      /* translators: Admin screen title. 1: Admin screen name, 2: Network or site name. */
      __('%1$s \u2039 %2$s \u2212 WordPress', 'web-stories'),
      dynamicPageTitle,
      ADMIN_TITLE
    );

    trackScreenView(dynamicPageTitle);

    // Disable reason: avoid sending duplicate tracking events.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullPath, isRedirectComplete]);

  const hideLeftRail = matchPath(
    currentPath,
    NESTED_APP_ROUTES.TEMPLATES_GALLERY_DETAIL
  );

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
        {!hideLeftRail && <LeftRail />}
        <PageContent fullWidth={hideLeftRail}>
          <Route
            exact
            path={APP_ROUTES.DASHBOARD}
            component={<MyStoriesView />}
          />
          <Route
            exact
            path={APP_ROUTES.TEMPLATES_GALLERY}
            component={<ExploreTemplatesView />}
          />
          <Route
            path={NESTED_APP_ROUTES.TEMPLATES_GALLERY_DETAIL}
            component={<TemplateDetailsView />}
          />
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
