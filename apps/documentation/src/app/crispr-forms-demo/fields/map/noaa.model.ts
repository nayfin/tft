
interface NoaaStationsResultSet {
  offset: number;
  count: number;
  limit: number;
}
  
interface NoaaStationsMetaData {
  resultset: NoaaStationsResultSet;
}

export interface NoaaStationsResult {
  name: string; // "ST LOUIS SCIENCE CENTER, MO US",
  id: string; // "GHCND:USC00237452",
  mindate: string; // "1969-01-01",
  maxdate: string; // "2021-01-01",
  latitude: number; // 38.63079,
  longitude: number; // -90.27077
  elevation: number;
  elevationUnit: string; // "METERS",
  datacoverage: number; // 0.6599,
}

export interface NoaaStationResponse {
  metadata: NoaaStationsMetaData;
  results: NoaaStationsResult[];
}

export interface NoaaDataPoint {
  [key: string]: string; // 'ann-tmin-prblst-t32fp70': '     09/01'
}


export interface NoaaDataTypeBucket {
  docCount: number;
  key: string; // // the id we need for station ---> USC00237452 when bucket is in stations prop at root (NoaaStationsMetaProperties)
}

export interface NoaaDataType {
    docCountError: number;
    buckets: NoaaDataTypeBucket[];
    sumOfOtherDocCounts: number;
}

export interface NoaaBoundDefinition {
  lat: number;
  lon: number;
  geohash: string;
  fragment: false;
}

export interface NoaaBounds {
  bottomRight: NoaaBoundDefinition;
  topLeft: NoaaBoundDefinition;  
}

export interface NoaaStationsMetaProperties {
  docCountError: number;
  buckets: NoaaDataTypeBucket[];
  sumOfOtherDocCounts: number;
}

export interface NoaaStationDataTypeMeta  {
  coverage: number;
  endDate: string; // 9996-12-31T23:59:59,
  dateRange: NoaaDateRange;
  searchWeight: number;
  id: string; // ANN-TMIN-PRBLST-T32FP80,
  startDate: string; // 0001-01-01T00:00:00
}

export interface NoaaDateRange {
  start: string; // 0001-01-01T00:00:00,
  end: string; // 9996-12-31T23:59:59
}

export interface NoaaBoundingPoint {
  point: number[];
}

export interface NoaaStationsResultInfo {
  dateRange?: NoaaDateRange;
  searchWeight?: number;
  name: string; // 80% probability date of last 32F occurrence or later,    ||    // ST LOUIS SCI CTR, MO US,
  id: string; // ANN-TMIN-PRBLST-T32FP80    ||    // USC00237452
  dataTypes?: NoaaStationDataTypeMeta[];
}

export interface NoaaStationsResultLocation {
  coordinates: number[];
  type: string; // point
}

export interface NoaaBboxStationResult {
  tar: string; // "us-climate-normals_2006-2020_annualseasonal_multivariate_by-station_c20210609.tar.gz",
  endDate: string; // 9996-12-31T23:59:59,
  location: NoaaStationsResultLocation;
  boundingPoints: NoaaBoundingPoint[];
  filePath: string;
  stations: NoaaStationsResultInfo[];
  dataTypes: NoaaStationsResultInfo[];
  fileSize: number;
  centroid: NoaaBoundingPoint;
  name: string; // USC00237452.csv,
  id: string; // us-climate-normals_2006-2020_annualseasonal_multivariate_by-station_c20210609.tar.gz:USC00237452.csv,
  dataTypesCount: number;
  startDate: string; // 0001-01-01T00:00:00
}

export interface NoaaBboxStationResponse {
  dataTypes: NoaaDataType;
  count: number;
  bounds: NoaaBounds;
  totalFileSize: number;
  stations: NoaaStationsMetaProperties;
  totalCount: number;
  results: NoaaBboxStationResult[];
}