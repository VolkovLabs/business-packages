import { DataFrameJSON } from '@grafana/data';

/**
 * Query Result
 */
export interface QueryResult {
  /**
   * Status
   *
   * @type {number}
   */
  status: number;

  /**
   * Frames
   *
   * @type {DataFrameJSON[]}
   */
  frames: DataFrameJSON[];

  /**
   * Ref ID
   *
   * @type {string}
   */
  refId?: string;
}

/**
 * Fetch Data Query Response
 */
export interface FetchDataQueryResponse {
  /**
   * Results
   */
  results: Record<string, QueryResult>;
}

/**
 * Response Data
 */
export interface ResponseData {
  error?: string;
  refId?: string;
  frames?: DataFrameJSON[];
  status?: number;

  // Legacy TSDB format...
  series?: any[];
  tables?: any[];
}

export interface FetchResponse<T = FetchDataQueryResponse> {
  data: T;
  readonly status: number;
  readonly statusText: string;
  readonly ok?: boolean;
  readonly headers: object;
  readonly redirected?: boolean;
  readonly type?: ResponseType;
  readonly url?: string;
  readonly traceId?: string;
}
