/*      GET /suggest supporting interfaces      */

export interface GCSuggestResponse {
    suggestions: GCStationSuggestion[]
}

export interface GCStationSuggestion {
    /**
     * descriptive label of the suggested station
     * e.g.
     * text:  "90210, Beverly Hills, CA, USA" 
     */
    text: string;
    /**
     * base64 encoded key that allows for lookup of stations in the Geocode API
     * e.g. 
     * magicKey: dHA9MCNsb2M9NjgyMTQ2MyNsbmc9MzQjcGw9MTI3Njg1MiNsYnM9MTQ6MzAyOTg4Nw==
     * decodes to below:
     * tp=0#loc=6821463#lng=34#pl=1276852#lbs=14:3029887
     */ 
    magicKey: string,
    isCollection: boolean;
}



/*      GET /findAddressCandidates supporting interfaces      */

export interface GCFindAddressCandidatesResponse {
    spatialReference: GCSpatialReference;
    candidates: GCCandidate[];
}

export interface GCCandidate {
    address: string; // "63116, Saint Louis, Missouri",
    location: GCGeoLocation;
    score: number; // 100,
    attributes: any; // {};
    extent: GCAreaCoordinates;
}

export interface GCAreaCoordinates {
    xmin: number;
    xmax: number;
    ymin: number;
    ymax: number;
}

interface GCGeoLocation {
    x: number; // -90.252264999999966,
    y: number; // 38.589220000000068
}

interface GCSpatialReference {
    wkid: number; // 4326,
    latestWkid: number; // 4326
}
