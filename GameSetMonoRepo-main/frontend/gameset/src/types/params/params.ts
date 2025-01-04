import { AuthUser } from "aws-amplify/auth";
import { SearchType } from "./enums";

export interface SearchValues {
  lat: number;
  lng: number;
  distance: number;
  searchType: SearchType;
  city?: string | undefined;
}

export interface BigSearchProps {
  hideBigSearch: () => void;
  onSearchChange: (lat: number, lng: number, distance: number, searchType: SearchType) => void;
  searchType: SearchType;
  bigSearchOn: boolean;
  searchValues: SearchValues;
  setSearchValues: React.Dispatch<React.SetStateAction<SearchValues>>;
}

export interface SmallScreenProps {
  bigSearchOn?: boolean;
  setBigSearchOn?: React.Dispatch<React.SetStateAction<boolean>>;
  smallSheetOn: boolean;
  setSmallSheetOn: React.Dispatch<React.SetStateAction<boolean>>;
  user?: AuthUser;
  searchType?: SearchType;
  setSearchType?: React.Dispatch<React.SetStateAction<SearchType>>;
  setSearchValues?: React.Dispatch<React.SetStateAction<SearchValues>>;
  searchValues?: SearchValues;
  onSearchChange?: (lat: number, lng: number, distance: number, searchType: SearchType) => void;
  signOut?: any;
}
