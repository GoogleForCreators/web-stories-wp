import ESM_COMPAT_Module from "node:module";
import { fileURLToPath as ESM_COMPAT_fileURLToPath } from 'node:url';
import { dirname as ESM_COMPAT_dirname } from 'node:path';
const __filename = ESM_COMPAT_fileURLToPath(import.meta.url);
const __dirname = ESM_COMPAT_dirname(__filename);
const require = ESM_COMPAT_Module.createRequire(import.meta.url);

// src/manager/globals/exports.ts
var t = {
  react: [
    "Children",
    "Component",
    "Fragment",
    "Profiler",
    "PureComponent",
    "StrictMode",
    "Suspense",
    "__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED",
    "cloneElement",
    "createContext",
    "createElement",
    "createFactory",
    "createRef",
    "forwardRef",
    "isValidElement",
    "lazy",
    "memo",
    "startTransition",
    "unstable_act",
    "useCallback",
    "useContext",
    "useDebugValue",
    "useDeferredValue",
    "useEffect",
    "useId",
    "useImperativeHandle",
    "useInsertionEffect",
    "useLayoutEffect",
    "useMemo",
    "useReducer",
    "useRef",
    "useState",
    "useSyncExternalStore",
    "useTransition",
    "version"
  ],
  "react-dom": [
    "__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED",
    "createPortal",
    "createRoot",
    "findDOMNode",
    "flushSync",
    "hydrate",
    "hydrateRoot",
    "render",
    "unmountComponentAtNode",
    "unstable_batchedUpdates",
    "unstable_renderSubtreeIntoContainer",
    "version"
  ],
  "react-dom/client": ["createRoot", "hydrateRoot"],
  "@storybook/icons": [
    "AccessibilityAltIcon",
    "AccessibilityIcon",
    "AddIcon",
    "AdminIcon",
    "AlertAltIcon",
    "AlertIcon",
    "AlignLeftIcon",
    "AlignRightIcon",
    "AppleIcon",
    "ArrowBottomLeftIcon",
    "ArrowBottomRightIcon",
    "ArrowDownIcon",
    "ArrowLeftIcon",
    "ArrowRightIcon",
    "ArrowSolidDownIcon",
    "ArrowSolidLeftIcon",
    "ArrowSolidRightIcon",
    "ArrowSolidUpIcon",
    "ArrowTopLeftIcon",
    "ArrowTopRightIcon",
    "ArrowUpIcon",
    "AzureDevOpsIcon",
    "BackIcon",
    "BasketIcon",
    "BatchAcceptIcon",
    "BatchDenyIcon",
    "BeakerIcon",
    "BellIcon",
    "BitbucketIcon",
    "BoldIcon",
    "BookIcon",
    "BookmarkHollowIcon",
    "BookmarkIcon",
    "BottomBarIcon",
    "BottomBarToggleIcon",
    "BoxIcon",
    "BranchIcon",
    "BrowserIcon",
    "ButtonIcon",
    "CPUIcon",
    "CalendarIcon",
    "CameraIcon",
    "CategoryIcon",
    "CertificateIcon",
    "ChangedIcon",
    "ChatIcon",
    "CheckIcon",
    "ChevronDownIcon",
    "ChevronLeftIcon",
    "ChevronRightIcon",
    "ChevronSmallDownIcon",
    "ChevronSmallLeftIcon",
    "ChevronSmallRightIcon",
    "ChevronSmallUpIcon",
    "ChevronUpIcon",
    "ChromaticIcon",
    "ChromeIcon",
    "CircleHollowIcon",
    "CircleIcon",
    "ClearIcon",
    "CloseAltIcon",
    "CloseIcon",
    "CloudHollowIcon",
    "CloudIcon",
    "CogIcon",
    "CollapseIcon",
    "CommandIcon",
    "CommentAddIcon",
    "CommentIcon",
    "CommentsIcon",
    "CommitIcon",
    "CompassIcon",
    "ComponentDrivenIcon",
    "ComponentIcon",
    "ContrastIcon",
    "ControlsIcon",
    "CopyIcon",
    "CreditIcon",
    "CrossIcon",
    "DashboardIcon",
    "DatabaseIcon",
    "DeleteIcon",
    "DiamondIcon",
    "DirectionIcon",
    "DiscordIcon",
    "DocChartIcon",
    "DocListIcon",
    "DocumentIcon",
    "DownloadIcon",
    "DragIcon",
    "EditIcon",
    "EllipsisIcon",
    "EmailIcon",
    "ExpandAltIcon",
    "ExpandIcon",
    "EyeCloseIcon",
    "EyeIcon",
    "FaceHappyIcon",
    "FaceNeutralIcon",
    "FaceSadIcon",
    "FacebookIcon",
    "FailedIcon",
    "FastForwardIcon",
    "FigmaIcon",
    "FilterIcon",
    "FlagIcon",
    "FolderIcon",
    "FormIcon",
    "GDriveIcon",
    "GithubIcon",
    "GitlabIcon",
    "GlobeIcon",
    "GoogleIcon",
    "GraphBarIcon",
    "GraphLineIcon",
    "GraphqlIcon",
    "GridAltIcon",
    "GridIcon",
    "GrowIcon",
    "HeartHollowIcon",
    "HeartIcon",
    "HomeIcon",
    "HourglassIcon",
    "InfoIcon",
    "ItalicIcon",
    "JumpToIcon",
    "KeyIcon",
    "LightningIcon",
    "LightningOffIcon",
    "LinkBrokenIcon",
    "LinkIcon",
    "LinkedinIcon",
    "LinuxIcon",
    "ListOrderedIcon",
    "ListUnorderedIcon",
    "LocationIcon",
    "LockIcon",
    "MarkdownIcon",
    "MarkupIcon",
    "MediumIcon",
    "MemoryIcon",
    "MenuIcon",
    "MergeIcon",
    "MirrorIcon",
    "MobileIcon",
    "MoonIcon",
    "NutIcon",
    "OutboxIcon",
    "OutlineIcon",
    "PaintBrushIcon",
    "PaperClipIcon",
    "ParagraphIcon",
    "PassedIcon",
    "PhoneIcon",
    "PhotoDragIcon",
    "PhotoIcon",
    "PinAltIcon",
    "PinIcon",
    "PlayAllHollowIcon",
    "PlayBackIcon",
    "PlayHollowIcon",
    "PlayIcon",
    "PlayNextIcon",
    "PlusIcon",
    "PointerDefaultIcon",
    "PointerHandIcon",
    "PowerIcon",
    "PrintIcon",
    "ProceedIcon",
    "ProfileIcon",
    "PullRequestIcon",
    "QuestionIcon",
    "RSSIcon",
    "RedirectIcon",
    "ReduxIcon",
    "RefreshIcon",
    "ReplyIcon",
    "RepoIcon",
    "RequestChangeIcon",
    "RewindIcon",
    "RulerIcon",
    "SaveIcon",
    "SearchIcon",
    "ShareAltIcon",
    "ShareIcon",
    "ShieldIcon",
    "SideBySideIcon",
    "SidebarAltIcon",
    "SidebarAltToggleIcon",
    "SidebarIcon",
    "SidebarToggleIcon",
    "SpeakerIcon",
    "StackedIcon",
    "StarHollowIcon",
    "StarIcon",
    "StatusFailIcon",
    "StatusPassIcon",
    "StatusWarnIcon",
    "StickerIcon",
    "StopAltHollowIcon",
    "StopAltIcon",
    "StopIcon",
    "StorybookIcon",
    "StructureIcon",
    "SubtractIcon",
    "SunIcon",
    "SupportIcon",
    "SwitchAltIcon",
    "SyncIcon",
    "TabletIcon",
    "ThumbsUpIcon",
    "TimeIcon",
    "TimerIcon",
    "TransferIcon",
    "TrashIcon",
    "TwitterIcon",
    "TypeIcon",
    "UbuntuIcon",
    "UndoIcon",
    "UnfoldIcon",
    "UnlockIcon",
    "UnpinIcon",
    "UploadIcon",
    "UserAddIcon",
    "UserAltIcon",
    "UserIcon",
    "UsersIcon",
    "VSCodeIcon",
    "VerifiedIcon",
    "VideoIcon",
    "WandIcon",
    "WatchIcon",
    "WindowsIcon",
    "WrenchIcon",
    "XIcon",
    "YoutubeIcon",
    "ZoomIcon",
    "ZoomOutIcon",
    "ZoomResetIcon",
    "iconList"
  ],
  "storybook/internal/components": [
    "A",
    "ActionBar",
    "AddonPanel",
    "Badge",
    "Bar",
    "Blockquote",
    "Button",
    "ClipboardCode",
    "Code",
    "DL",
    "Div",
    "DocumentWrapper",
    "EmptyTabContent",
    "ErrorFormatter",
    "FlexBar",
    "Form",
    "H1",
    "H2",
    "H3",
    "H4",
    "H5",
    "H6",
    "HR",
    "IconButton",
    "IconButtonSkeleton",
    "Icons",
    "Img",
    "LI",
    "Link",
    "ListItem",
    "Loader",
    "Modal",
    "OL",
    "P",
    "Placeholder",
    "Pre",
    "ResetWrapper",
    "ScrollArea",
    "Separator",
    "Spaced",
    "Span",
    "StorybookIcon",
    "StorybookLogo",
    "Symbols",
    "SyntaxHighlighter",
    "TT",
    "TabBar",
    "TabButton",
    "TabWrapper",
    "Table",
    "Tabs",
    "TabsState",
    "TooltipLinkList",
    "TooltipMessage",
    "TooltipNote",
    "UL",
    "WithTooltip",
    "WithTooltipPure",
    "Zoom",
    "codeCommon",
    "components",
    "createCopyToClipboardFunction",
    "getStoryHref",
    "icons",
    "interleaveSeparators",
    "nameSpaceClassNames",
    "resetComponents",
    "withReset"
  ],
  "@storybook/components": [
    "A",
    "ActionBar",
    "AddonPanel",
    "Badge",
    "Bar",
    "Blockquote",
    "Button",
    "ClipboardCode",
    "Code",
    "DL",
    "Div",
    "DocumentWrapper",
    "EmptyTabContent",
    "ErrorFormatter",
    "FlexBar",
    "Form",
    "H1",
    "H2",
    "H3",
    "H4",
    "H5",
    "H6",
    "HR",
    "IconButton",
    "IconButtonSkeleton",
    "Icons",
    "Img",
    "LI",
    "Link",
    "ListItem",
    "Loader",
    "Modal",
    "OL",
    "P",
    "Placeholder",
    "Pre",
    "ResetWrapper",
    "ScrollArea",
    "Separator",
    "Spaced",
    "Span",
    "StorybookIcon",
    "StorybookLogo",
    "Symbols",
    "SyntaxHighlighter",
    "TT",
    "TabBar",
    "TabButton",
    "TabWrapper",
    "Table",
    "Tabs",
    "TabsState",
    "TooltipLinkList",
    "TooltipMessage",
    "TooltipNote",
    "UL",
    "WithTooltip",
    "WithTooltipPure",
    "Zoom",
    "codeCommon",
    "components",
    "createCopyToClipboardFunction",
    "getStoryHref",
    "icons",
    "interleaveSeparators",
    "nameSpaceClassNames",
    "resetComponents",
    "withReset"
  ],
  "@storybook/core/components": [
    "A",
    "ActionBar",
    "AddonPanel",
    "Badge",
    "Bar",
    "Blockquote",
    "Button",
    "ClipboardCode",
    "Code",
    "DL",
    "Div",
    "DocumentWrapper",
    "EmptyTabContent",
    "ErrorFormatter",
    "FlexBar",
    "Form",
    "H1",
    "H2",
    "H3",
    "H4",
    "H5",
    "H6",
    "HR",
    "IconButton",
    "IconButtonSkeleton",
    "Icons",
    "Img",
    "LI",
    "Link",
    "ListItem",
    "Loader",
    "Modal",
    "OL",
    "P",
    "Placeholder",
    "Pre",
    "ResetWrapper",
    "ScrollArea",
    "Separator",
    "Spaced",
    "Span",
    "StorybookIcon",
    "StorybookLogo",
    "Symbols",
    "SyntaxHighlighter",
    "TT",
    "TabBar",
    "TabButton",
    "TabWrapper",
    "Table",
    "Tabs",
    "TabsState",
    "TooltipLinkList",
    "TooltipMessage",
    "TooltipNote",
    "UL",
    "WithTooltip",
    "WithTooltipPure",
    "Zoom",
    "codeCommon",
    "components",
    "createCopyToClipboardFunction",
    "getStoryHref",
    "icons",
    "interleaveSeparators",
    "nameSpaceClassNames",
    "resetComponents",
    "withReset"
  ],
  "storybook/internal/manager-api": [
    "ActiveTabs",
    "Consumer",
    "ManagerContext",
    "Provider",
    "RequestResponseError",
    "addons",
    "combineParameters",
    "controlOrMetaKey",
    "controlOrMetaSymbol",
    "eventMatchesShortcut",
    "eventToShortcut",
    "experimental_requestResponse",
    "isMacLike",
    "isShortcutTaken",
    "keyToSymbol",
    "merge",
    "mockChannel",
    "optionOrAltSymbol",
    "shortcutMatchesShortcut",
    "shortcutToHumanString",
    "types",
    "useAddonState",
    "useArgTypes",
    "useArgs",
    "useChannel",
    "useGlobalTypes",
    "useGlobals",
    "useParameter",
    "useSharedState",
    "useStoryPrepared",
    "useStorybookApi",
    "useStorybookState"
  ],
  "@storybook/manager-api": [
    "ActiveTabs",
    "Consumer",
    "ManagerContext",
    "Provider",
    "RequestResponseError",
    "addons",
    "combineParameters",
    "controlOrMetaKey",
    "controlOrMetaSymbol",
    "eventMatchesShortcut",
    "eventToShortcut",
    "experimental_requestResponse",
    "isMacLike",
    "isShortcutTaken",
    "keyToSymbol",
    "merge",
    "mockChannel",
    "optionOrAltSymbol",
    "shortcutMatchesShortcut",
    "shortcutToHumanString",
    "types",
    "useAddonState",
    "useArgTypes",
    "useArgs",
    "useChannel",
    "useGlobalTypes",
    "useGlobals",
    "useParameter",
    "useSharedState",
    "useStoryPrepared",
    "useStorybookApi",
    "useStorybookState"
  ],
  "@storybook/core/manager-api": [
    "ActiveTabs",
    "Consumer",
    "ManagerContext",
    "Provider",
    "RequestResponseError",
    "addons",
    "combineParameters",
    "controlOrMetaKey",
    "controlOrMetaSymbol",
    "eventMatchesShortcut",
    "eventToShortcut",
    "experimental_requestResponse",
    "isMacLike",
    "isShortcutTaken",
    "keyToSymbol",
    "merge",
    "mockChannel",
    "optionOrAltSymbol",
    "shortcutMatchesShortcut",
    "shortcutToHumanString",
    "types",
    "useAddonState",
    "useArgTypes",
    "useArgs",
    "useChannel",
    "useGlobalTypes",
    "useGlobals",
    "useParameter",
    "useSharedState",
    "useStoryPrepared",
    "useStorybookApi",
    "useStorybookState"
  ],
  "storybook/internal/router": [
    "BaseLocationProvider",
    "DEEPLY_EQUAL",
    "Link",
    "Location",
    "LocationProvider",
    "Match",
    "Route",
    "buildArgsParam",
    "deepDiff",
    "getMatch",
    "parsePath",
    "queryFromLocation",
    "stringifyQuery",
    "useNavigate"
  ],
  "@storybook/router": [
    "BaseLocationProvider",
    "DEEPLY_EQUAL",
    "Link",
    "Location",
    "LocationProvider",
    "Match",
    "Route",
    "buildArgsParam",
    "deepDiff",
    "getMatch",
    "parsePath",
    "queryFromLocation",
    "stringifyQuery",
    "useNavigate"
  ],
  "@storybook/core/router": [
    "BaseLocationProvider",
    "DEEPLY_EQUAL",
    "Link",
    "Location",
    "LocationProvider",
    "Match",
    "Route",
    "buildArgsParam",
    "deepDiff",
    "getMatch",
    "parsePath",
    "queryFromLocation",
    "stringifyQuery",
    "useNavigate"
  ],
  "storybook/internal/theming": [
    "CacheProvider",
    "ClassNames",
    "Global",
    "ThemeProvider",
    "background",
    "color",
    "convert",
    "create",
    "createCache",
    "createGlobal",
    "createReset",
    "css",
    "darken",
    "ensure",
    "ignoreSsrWarning",
    "isPropValid",
    "jsx",
    "keyframes",
    "lighten",
    "styled",
    "themes",
    "typography",
    "useTheme",
    "withTheme"
  ],
  "@storybook/theming": [
    "CacheProvider",
    "ClassNames",
    "Global",
    "ThemeProvider",
    "background",
    "color",
    "convert",
    "create",
    "createCache",
    "createGlobal",
    "createReset",
    "css",
    "darken",
    "ensure",
    "ignoreSsrWarning",
    "isPropValid",
    "jsx",
    "keyframes",
    "lighten",
    "styled",
    "themes",
    "typography",
    "useTheme",
    "withTheme"
  ],
  "@storybook/core/theming": [
    "CacheProvider",
    "ClassNames",
    "Global",
    "ThemeProvider",
    "background",
    "color",
    "convert",
    "create",
    "createCache",
    "createGlobal",
    "createReset",
    "css",
    "darken",
    "ensure",
    "ignoreSsrWarning",
    "isPropValid",
    "jsx",
    "keyframes",
    "lighten",
    "styled",
    "themes",
    "typography",
    "useTheme",
    "withTheme"
  ],
  "storybook/internal/theming/create": ["create", "themes"],
  "@storybook/theming/create": ["create", "themes"],
  "@storybook/core/theming/create": ["create", "themes"],
  "storybook/internal/channels": [
    "Channel",
    "PostMessageTransport",
    "WebsocketTransport",
    "createBrowserChannel"
  ],
  "@storybook/channels": [
    "Channel",
    "PostMessageTransport",
    "WebsocketTransport",
    "createBrowserChannel"
  ],
  "@storybook/core/channels": [
    "Channel",
    "PostMessageTransport",
    "WebsocketTransport",
    "createBrowserChannel"
  ],
  "storybook/internal/core-errors": [
    "ARGTYPES_INFO_REQUEST",
    "ARGTYPES_INFO_RESPONSE",
    "CHANNEL_CREATED",
    "CHANNEL_WS_DISCONNECT",
    "CONFIG_ERROR",
    "CREATE_NEW_STORYFILE_REQUEST",
    "CREATE_NEW_STORYFILE_RESPONSE",
    "CURRENT_STORY_WAS_SET",
    "DOCS_PREPARED",
    "DOCS_RENDERED",
    "FILE_COMPONENT_SEARCH_REQUEST",
    "FILE_COMPONENT_SEARCH_RESPONSE",
    "FORCE_REMOUNT",
    "FORCE_RE_RENDER",
    "GLOBALS_UPDATED",
    "NAVIGATE_URL",
    "PLAY_FUNCTION_THREW_EXCEPTION",
    "PRELOAD_ENTRIES",
    "PREVIEW_BUILDER_PROGRESS",
    "PREVIEW_KEYDOWN",
    "REGISTER_SUBSCRIPTION",
    "REQUEST_WHATS_NEW_DATA",
    "RESET_STORY_ARGS",
    "RESULT_WHATS_NEW_DATA",
    "SAVE_STORY_REQUEST",
    "SAVE_STORY_RESPONSE",
    "SELECT_STORY",
    "SET_CONFIG",
    "SET_CURRENT_STORY",
    "SET_FILTER",
    "SET_GLOBALS",
    "SET_INDEX",
    "SET_STORIES",
    "SET_WHATS_NEW_CACHE",
    "SHARED_STATE_CHANGED",
    "SHARED_STATE_SET",
    "STORIES_COLLAPSE_ALL",
    "STORIES_EXPAND_ALL",
    "STORY_ARGS_UPDATED",
    "STORY_CHANGED",
    "STORY_ERRORED",
    "STORY_INDEX_INVALIDATED",
    "STORY_MISSING",
    "STORY_PREPARED",
    "STORY_RENDERED",
    "STORY_RENDER_PHASE_CHANGED",
    "STORY_SPECIFIED",
    "STORY_THREW_EXCEPTION",
    "STORY_UNCHANGED",
    "TELEMETRY_ERROR",
    "TESTING_MODULE_CANCEL_TEST_RUN_REQUEST",
    "TESTING_MODULE_CANCEL_TEST_RUN_RESPONSE",
    "TESTING_MODULE_CRASH_REPORT",
    "TESTING_MODULE_PROGRESS_REPORT",
    "TESTING_MODULE_RUN_ALL_REQUEST",
    "TESTING_MODULE_RUN_REQUEST",
    "TESTING_MODULE_WATCH_MODE_REQUEST",
    "TOGGLE_WHATS_NEW_NOTIFICATIONS",
    "UNHANDLED_ERRORS_WHILE_PLAYING",
    "UPDATE_GLOBALS",
    "UPDATE_QUERY_PARAMS",
    "UPDATE_STORY_ARGS"
  ],
  "@storybook/core-events": [
    "ARGTYPES_INFO_REQUEST",
    "ARGTYPES_INFO_RESPONSE",
    "CHANNEL_CREATED",
    "CHANNEL_WS_DISCONNECT",
    "CONFIG_ERROR",
    "CREATE_NEW_STORYFILE_REQUEST",
    "CREATE_NEW_STORYFILE_RESPONSE",
    "CURRENT_STORY_WAS_SET",
    "DOCS_PREPARED",
    "DOCS_RENDERED",
    "FILE_COMPONENT_SEARCH_REQUEST",
    "FILE_COMPONENT_SEARCH_RESPONSE",
    "FORCE_REMOUNT",
    "FORCE_RE_RENDER",
    "GLOBALS_UPDATED",
    "NAVIGATE_URL",
    "PLAY_FUNCTION_THREW_EXCEPTION",
    "PRELOAD_ENTRIES",
    "PREVIEW_BUILDER_PROGRESS",
    "PREVIEW_KEYDOWN",
    "REGISTER_SUBSCRIPTION",
    "REQUEST_WHATS_NEW_DATA",
    "RESET_STORY_ARGS",
    "RESULT_WHATS_NEW_DATA",
    "SAVE_STORY_REQUEST",
    "SAVE_STORY_RESPONSE",
    "SELECT_STORY",
    "SET_CONFIG",
    "SET_CURRENT_STORY",
    "SET_FILTER",
    "SET_GLOBALS",
    "SET_INDEX",
    "SET_STORIES",
    "SET_WHATS_NEW_CACHE",
    "SHARED_STATE_CHANGED",
    "SHARED_STATE_SET",
    "STORIES_COLLAPSE_ALL",
    "STORIES_EXPAND_ALL",
    "STORY_ARGS_UPDATED",
    "STORY_CHANGED",
    "STORY_ERRORED",
    "STORY_INDEX_INVALIDATED",
    "STORY_MISSING",
    "STORY_PREPARED",
    "STORY_RENDERED",
    "STORY_RENDER_PHASE_CHANGED",
    "STORY_SPECIFIED",
    "STORY_THREW_EXCEPTION",
    "STORY_UNCHANGED",
    "TELEMETRY_ERROR",
    "TESTING_MODULE_CANCEL_TEST_RUN_REQUEST",
    "TESTING_MODULE_CANCEL_TEST_RUN_RESPONSE",
    "TESTING_MODULE_CRASH_REPORT",
    "TESTING_MODULE_PROGRESS_REPORT",
    "TESTING_MODULE_RUN_ALL_REQUEST",
    "TESTING_MODULE_RUN_REQUEST",
    "TESTING_MODULE_WATCH_MODE_REQUEST",
    "TOGGLE_WHATS_NEW_NOTIFICATIONS",
    "UNHANDLED_ERRORS_WHILE_PLAYING",
    "UPDATE_GLOBALS",
    "UPDATE_QUERY_PARAMS",
    "UPDATE_STORY_ARGS"
  ],
  "@storybook/core/core-events": [
    "ARGTYPES_INFO_REQUEST",
    "ARGTYPES_INFO_RESPONSE",
    "CHANNEL_CREATED",
    "CHANNEL_WS_DISCONNECT",
    "CONFIG_ERROR",
    "CREATE_NEW_STORYFILE_REQUEST",
    "CREATE_NEW_STORYFILE_RESPONSE",
    "CURRENT_STORY_WAS_SET",
    "DOCS_PREPARED",
    "DOCS_RENDERED",
    "FILE_COMPONENT_SEARCH_REQUEST",
    "FILE_COMPONENT_SEARCH_RESPONSE",
    "FORCE_REMOUNT",
    "FORCE_RE_RENDER",
    "GLOBALS_UPDATED",
    "NAVIGATE_URL",
    "PLAY_FUNCTION_THREW_EXCEPTION",
    "PRELOAD_ENTRIES",
    "PREVIEW_BUILDER_PROGRESS",
    "PREVIEW_KEYDOWN",
    "REGISTER_SUBSCRIPTION",
    "REQUEST_WHATS_NEW_DATA",
    "RESET_STORY_ARGS",
    "RESULT_WHATS_NEW_DATA",
    "SAVE_STORY_REQUEST",
    "SAVE_STORY_RESPONSE",
    "SELECT_STORY",
    "SET_CONFIG",
    "SET_CURRENT_STORY",
    "SET_FILTER",
    "SET_GLOBALS",
    "SET_INDEX",
    "SET_STORIES",
    "SET_WHATS_NEW_CACHE",
    "SHARED_STATE_CHANGED",
    "SHARED_STATE_SET",
    "STORIES_COLLAPSE_ALL",
    "STORIES_EXPAND_ALL",
    "STORY_ARGS_UPDATED",
    "STORY_CHANGED",
    "STORY_ERRORED",
    "STORY_INDEX_INVALIDATED",
    "STORY_MISSING",
    "STORY_PREPARED",
    "STORY_RENDERED",
    "STORY_RENDER_PHASE_CHANGED",
    "STORY_SPECIFIED",
    "STORY_THREW_EXCEPTION",
    "STORY_UNCHANGED",
    "TELEMETRY_ERROR",
    "TESTING_MODULE_CANCEL_TEST_RUN_REQUEST",
    "TESTING_MODULE_CANCEL_TEST_RUN_RESPONSE",
    "TESTING_MODULE_CRASH_REPORT",
    "TESTING_MODULE_PROGRESS_REPORT",
    "TESTING_MODULE_RUN_ALL_REQUEST",
    "TESTING_MODULE_RUN_REQUEST",
    "TESTING_MODULE_WATCH_MODE_REQUEST",
    "TOGGLE_WHATS_NEW_NOTIFICATIONS",
    "UNHANDLED_ERRORS_WHILE_PLAYING",
    "UPDATE_GLOBALS",
    "UPDATE_QUERY_PARAMS",
    "UPDATE_STORY_ARGS"
  ],
  "storybook/internal/types": ["Addon_TypesEnum"],
  "@storybook/types": ["Addon_TypesEnum"],
  "@storybook/core/types": ["Addon_TypesEnum"],
  "storybook/internal/manager-errors": [
    "Category",
    "ProviderDoesNotExtendBaseProviderError",
    "UncaughtManagerError"
  ],
  "@storybook/core-events/manager-errors": [
    "Category",
    "ProviderDoesNotExtendBaseProviderError",
    "UncaughtManagerError"
  ],
  "@storybook/core/manager-errors": [
    "Category",
    "ProviderDoesNotExtendBaseProviderError",
    "UncaughtManagerError"
  ],
  "storybook/internal/client-logger": ["deprecate", "logger", "once", "pretty"],
  "@storybook/client-logger": ["deprecate", "logger", "once", "pretty"],
  "@storybook/core/client-logger": ["deprecate", "logger", "once", "pretty"]
};

// src/manager/globals/globals.ts
var e = {
  react: "__REACT__",
  "react-dom": "__REACT_DOM__",
  "react-dom/client": "__REACT_DOM_CLIENT__",
  "@storybook/icons": "__STORYBOOK_ICONS__",
  "storybook/internal/manager-api": "__STORYBOOK_API__",
  "@storybook/manager-api": "__STORYBOOK_API__",
  "@storybook/core/manager-api": "__STORYBOOK_API__",
  "storybook/internal/components": "__STORYBOOK_COMPONENTS__",
  "@storybook/components": "__STORYBOOK_COMPONENTS__",
  "@storybook/core/components": "__STORYBOOK_COMPONENTS__",
  "storybook/internal/channels": "__STORYBOOK_CHANNELS__",
  "@storybook/channels": "__STORYBOOK_CHANNELS__",
  "@storybook/core/channels": "__STORYBOOK_CHANNELS__",
  "storybook/internal/core-errors": "__STORYBOOK_CORE_EVENTS__",
  "@storybook/core-events": "__STORYBOOK_CORE_EVENTS__",
  "@storybook/core/core-events": "__STORYBOOK_CORE_EVENTS__",
  "storybook/internal/manager-errors": "__STORYBOOK_CORE_EVENTS_MANAGER_ERRORS__",
  "@storybook/core-events/manager-errors": "__STORYBOOK_CORE_EVENTS_MANAGER_ERRORS__",
  "@storybook/core/manager-errors": "__STORYBOOK_CORE_EVENTS_MANAGER_ERRORS__",
  "storybook/internal/router": "__STORYBOOK_ROUTER__",
  "@storybook/router": "__STORYBOOK_ROUTER__",
  "@storybook/core/router": "__STORYBOOK_ROUTER__",
  "storybook/internal/theming": "__STORYBOOK_THEMING__",
  "@storybook/theming": "__STORYBOOK_THEMING__",
  "@storybook/core/theming": "__STORYBOOK_THEMING__",
  "storybook/internal/theming/create": "__STORYBOOK_THEMING_CREATE__",
  "@storybook/theming/create": "__STORYBOOK_THEMING_CREATE__",
  "@storybook/core/theming/create": "__STORYBOOK_THEMING_CREATE__",
  "storybook/internal/client-logger": "__STORYBOOK_CLIENT_LOGGER__",
  "@storybook/client-logger": "__STORYBOOK_CLIENT_LOGGER__",
  "@storybook/core/client-logger": "__STORYBOOK_CLIENT_LOGGER__",
  "storybook/internal/types": "__STORYBOOK_TYPES__",
  "@storybook/types": "__STORYBOOK_TYPES__",
  "@storybook/core/types": "__STORYBOOK_TYPES__"
}, n = Object.keys(e);

// src/manager/globals/globals-module-info.ts
var S = n.reduce(
  (r, o) => (r[o] = {
    type: "esm",
    varName: e[o],
    namedExports: t[o],
    defaultExport: !0
  }, r),
  {}
);
export {
  S as globalsModuleInfoMap
};
