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

/**
 * Global Variable Name
 */
export enum GlobalVariableName {
  DASHBOARD = '__dashboard',
  FROM = '__from',
  TO = '__to',
  INTERVAL = '__interval',
  INTERVAL_MS = '__interval_ms',
  ORG = '__org',
  USER = '__user',
  RANGE = '__range',
  RANGE_MS = '__range_ms',
  RANGE_S = '__range_s',
  RATE_INTERVAL = '__rate_interval',
  RATE_INTERVAL_MS = '__rate_interval_ms',
  TIME_FILTER = 'timeFilter',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  _TIME_FILTER = '__timeFilter',
  TIMEZONE = '__timezone',
}
