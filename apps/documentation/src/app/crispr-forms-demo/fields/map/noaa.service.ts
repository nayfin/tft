import { Injectable } from '@angular/core';
// import { FrostDates, FrostRiskLevel, TempThreshold } from '@tft-private/gardens/util';
import { catchError, map, Observable } from 'rxjs';
import { NoaaBboxStationResponse, NoaaBboxStationResult, NoaaDataPoint, NoaaStationsResultInfo } from './noaa.model';
import { FrostDateRiskRefs } from './frost-date-risk-refs.enum';
import { GCAreaCoordinates } from './geocode.model';
import { HttpClient } from '@angular/common/http';
import { Params } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NoaaService {

  BASE_URL = 'https://www.ncei.noaa.gov';
  BASE_PATH = '/access/services';
  STATIONS_PATH = '/search/v1/data';
  DATA_PATH = '/data/v1';

  constructor(private http: HttpClient) { }

  getStationIds(gps: GCAreaCoordinates, dataTypes: string[]): Observable<any> {
  
    const urlParams: Params = { 
      dataset:'normals-annualseasonal-2006-2020',
      limit: '30',
      offset: '0',
      bbox: `${gps.ymax},${gps.xmin},${gps.ymin},${gps.xmax}`,
      // format: 'json',
      dataTypes

    }
    const url: URL = new URL(this.BASE_URL + this.BASE_PATH + this.STATIONS_PATH);
    return this.http.get<NoaaBboxStationResponse>(url.href, {params: urlParams}).pipe(
      map((data: NoaaBboxStationResponse): NoaaBboxStationResult[] => {
        console.log('NOAA Station Meta Info: ', data.results);
        return data.results;
      }),
      catchError((err) => {
        console.error('ERROR: Thrown during API call to get station meta info by geo coordinates. ', err);
        throw err;
      })
    );
  }

  getNoaaData(stationIds: string[]) {
    const params: Params = {
      dataset: 'normals-annualseasonal-2006-2020',
      startDate: '2001-01-01',
      endDate: '9996-12-31',
      format: 'json',
      stations: stationIds.join(',')
    }
    const stations = '&stations=' + stationIds
    console.log('stations', stations);
    const url: URL = new URL(this.BASE_URL + this.BASE_PATH + this.DATA_PATH );
    return this.http.get<NoaaDataPoint[]>(url.href).pipe(
      catchError((err) => {
        console.error('ERROR: Thrown during API call to get result data from NOAA. ', err, url.href, params);
        throw err;
      })
    );
  }

  getFostDateProbabilities(stationId = 'USC00237475') {
    const url = `https://www.ncei.noaa.gov/access/services/data/v1?`
    const params: Params = {
      dataset: 'normals-annualseasonal-2006-2020',
      startDate: '2001-01-01',
      endDate: '9996-12-31',
      format: 'json',
      stations: stationId
    }
    return this.http.get(url, {params}).pipe(
      map((data) => { 
        console.log('Frost Date Probabilities: ', data);
        return data;
      })
    )
  }

  /**
   * Marshalls the NOAA response returning the station ids of only stations that have the needed data.
   *
   * @param gps
   * @returns
   */
  getValidStationIds(gps: GCAreaCoordinates): Observable<NoaaBboxStationResult[]>  { // Observable<NoaaStationsResultInfo[]> {
    const dataTypes: string[] = [...Object.values(FrostDateRiskRefs)];
    console.log('dataTypes', dataTypes);
    return this.getStationIds(gps, dataTypes).pipe(
      map((noaaLocationInfo: NoaaBboxStationResult[]) => {
        // const viableStationMeta: NoaaStationsResultInfo[] = noaaLocationInfo?.length ? noaaLocationInfo.reduce((stationResults: NoaaStationsResultInfo[], location: NoaaBboxStationResult) => {
        //   const viableStations = location.stations?.filter(station => station?.id) || [];
        //   return [...stationResults, ...viableStations]
        // }, []) : [];
        // return viableStationMeta;
        return noaaLocationInfo;
      })
    );
  }

  // TODO: this is the previous implementation that gets all the data and then siphens for stations that have
  //       all required data.  This has been reversed by passing in all the datatypes to getStationIds() call.
  //       !!! Remove this before merge. !!!
  //
  //   .pipe(
  //     map((noaaLocationInfo: NoaaBboxStationResult[]) => {
  //       if (!noaaLocationInfo?.[0]?.stations?.length) return [];
  //       const stationsWithDefinedData: string[] = [];
  //       const potentialStations: NoaaStationsResultInfo[] = noaaLocationInfo[0].stations;
  //       potentialStations.forEach((stationInfo: NoaaStationsResultInfo) => {
  //         let hasAllRequiredData = false;
  //         const requiredDataTypes: string[] = [...Object.values(FrostDateRiskRefs)];
  //         if (stationInfo?.dataTypes?.length) {
  //           for (let i = 0; i < stationInfo.dataTypes.length; i++) {
  //             if (requiredDataTypes.length === 0) break;
  //             if (requiredDataTypes.includes(stationInfo.dataTypes[i].id)) {
  //               let indexToRemove: number = requiredDataTypes.indexOf(stationInfo.dataTypes[i].id);
  //               requiredDataTypes.splice(indexToRemove, 1);
  //               if (requiredDataTypes.length === 0) {
  //                 hasAllRequiredData = true;
  //               }
  //             }
  //           }
  //         }
  //         if (hasAllRequiredData) stationsWithDefinedData.push(stationInfo.id);
  //       });
  //       return stationsWithDefinedData;
  //     })
  //   );
  // }

  /**
   * Handles getting and generating a map where the key is a concatenation of the frost risk level & temperature threshold,
   * and the value is the relavent first and last frost dates.  This method is currently setup to operate off of one stationId
   * which, but the underlying NOAA api can accept multiple.  If we ever want to extend, will need to refactor this method
   * to generalize it's mapping across multiple dataPoints.
   *
   * @param stationId - USC id of the individual station for which to retreive frost dates.
   * @returns Mapping going from all possible combinations of frost risk level and temperature thresholds to their corresponding
   *          frost date first and last values.
   */
  // getFrostDates(stationId: string): Observable<Record<string,FrostDates> | null> {
  //   return this.noaaDataService.getNoaaData([stationId]).pipe(
  //     map((dataPoints: NoaaDataPoint[]): Record<string,FrostDates> | null => {
  //       const stationsFrostDatesMap: Record<string,FrostDates> = {};
  //       Object.keys(FrostRiskLevel).filter(x => this.isNumber(x)).forEach((i) => {
  //         Object.keys(TempThreshold).filter(y => this.isNumber(y)).forEach((j) => {
  //           const firstRef: string = FrostDateRiskRefs[`FIRST_RISK_${i}_TEMP_${j}` as keyof typeof FrostDateRiskRefs];
  //           const lastRef: string = FrostDateRiskRefs[`LAST_RISK_${i}_TEMP_${j}` as keyof typeof FrostDateRiskRefs];
  //           const first: string | null = this.getFormattedDate(dataPoints[0][firstRef]);
  //           const last: string | null = this.getFormattedDate(dataPoints[0][lastRef]);
  //           if (first && last) {
  //             stationsFrostDatesMap[firstRef + '+' + lastRef] = {first, last};
  //           }
  //         });
  //       });
  //       return Object.keys(stationsFrostDatesMap).length ? stationsFrostDatesMap : null;
  //     })
  //   );
  // }

  private isNumber(x: string): boolean {
    return !isNaN(+x) && x !== null;
  }

 
  /**
   * Some data coming back from NOAA stations is defined but has values like -9999.  This function ensures we have usable
   * data by checking that the data can be turned into a Date and that it has the current year.
   *
   * TODO: The year comparison probably needs to take into account the users year selection.
   *
   * @param noaaDateString - A partial date string (month and day only) returned from the NOAA api indicating a first or last frost date.
   * @returns Formatted ISO date string set with the current year or null if unable to format.
   */
  // private getFormattedDate(noaaDateString: string): string | null {
  //   const trimmedString: string = noaaDateString.replace(/\s+/g, '');
  //   // TODO: is it okay to assume that current year matches the needed year suffix for the data query?
  //   return /^(0[1-9]|1[0-2]|[1-9])\/(0[1-9]|1\d|2\d|3[01])$/.test(trimmedString) ?
  //     new Date(trimmedString + '/' + new Date().getFullYear()).toISOString() :
  //     null;
  // }
}
