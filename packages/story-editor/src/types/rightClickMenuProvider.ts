
export type MenuPosition = {
  x: number;
  y: number;
}

export interface RightClickMenuProviderState {
  isMenuOpen: boolean;
  menuPosition: MenuPosition;
  onCloseMenu: () => void;
  onOpenMenu: () => void,
}
