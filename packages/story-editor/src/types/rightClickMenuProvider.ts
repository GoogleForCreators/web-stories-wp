export interface RightClickMenuProviderState {
  isMenuOpen: boolean;
  menuPosition: {
    x: number;
    y: number;
  };
  onCloseMenu: () => void;
  onOpenMenu: () => void,
}
