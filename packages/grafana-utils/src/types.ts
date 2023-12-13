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

/**
 * Fetch Response
 */
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

/**
 * Variable Format
 */
export enum VariableFormat {
  CSV = 'csv',
  DATE = 'date',
  DISTRIBUTED = 'distributed',
  DOUBLE_QUOTE = 'doublequote',
  GLOB = 'glob',
  HTML = 'html',
  JSON = 'json',
  LUCENE = 'lucene',
  PERCENT_ENCODE = 'percentencode',
  PIPE = 'pipe',
  QUERY_PARAM = 'queryparam',
  RAW = 'raw',
  REGEX = 'regex',
  SQL_STRING = 'sqlstring',
  SINGLE_QUOTE = 'singlequote',
  TEXT = 'text',
  URI_ENCODE = 'uriencode',
}
