
export interface RefinementListState {
  canRefine: boolean;
  createURL: Function;
  items: RefinementListItem[];
  refine: Function;
  searchForItems: Function;
  isFormSearch: boolean;
}

export interface FilterListState extends RefinementListState {
  canToggleShowMore: boolean;
  toggleShowMore: Function;
  isShowingMore: boolean;
}

export interface RefinementListItem {
  count: number;
  label: string;
  highlighted: string;
  isRefined: boolean;
  value: string;
}
