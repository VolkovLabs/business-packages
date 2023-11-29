import { dataFrameFromJSON, DataQueryError, DataQueryResponse, LoadingState, toDataFrame } from '@grafana/data';

import { FetchResponse, ResponseData } from './types';

/**
 * To Data Query Error
 * @param err
 */
export function toDataQueryError(err: DataQueryError | string | unknown): DataQueryError {
  const error: DataQueryError = err || {};

  if (!error.message) {
    if (typeof err === 'string') {
      return { message: err };
    }

    let message = 'Query error';
    if (error.message) {
      message = error.message;
    } else if (error.data && error.data.message && error.data?.message !== 'Query data error') {
      message = error.data.message;
    } else if (error?.data?.message === 'Query data error' && error?.data?.error) {
      message = error.data.error;
    } else if (error.data && error.data.error) {
      message = error.data.error;
    } else if (error.status) {
      message = `Query error: ${error.status} ${error.statusText}`;
    }
    error.message = message;
  }

  return error;
}

/**
 * To Data Query Response
 * @param res
 */
export function toDataQueryResponse(res: FetchResponse): DataQueryResponse {
  const rsp: DataQueryResponse = { data: [], state: LoadingState.Done };

  // If the response isn't in a correct shape we just ignore the data and pass empty DataQueryResponse.
  if ('results' in res.data) {
    const results = res.data.results;
    const refIds = Object.keys(results);
    const data: ResponseData[] = [];

    for (const refId of refIds) {
      const dr = results[refId];
      if (!dr) {
        continue;
      }
      dr.refId = refId;
      data.push(dr);
    }

    for (const dr of data) {
      if (dr.error) {
        const errorObj: DataQueryError = {
          refId: dr.refId,
          message: dr.error,
          status: dr.status,
        };
        if (!rsp.error) {
          rsp.error = { ...errorObj };
        }
        if (rsp.errors) {
          rsp.errors.push({ ...errorObj });
        } else {
          rsp.errors = [{ ...errorObj }];
        }
        rsp.state = LoadingState.Error;
      }

      if (dr.frames?.length) {
        for (const js of dr.frames) {
          const df = dataFrameFromJSON(js);
          if (!df.refId) {
            df.refId = dr.refId;
          }
          rsp.data.push(df);
        }
        continue; // the other tests are legacy
      }

      if (dr.series?.length) {
        for (const s of dr.series) {
          if (!s.refId) {
            s.refId = dr.refId;
          }
          rsp.data.push(toDataFrame(s));
        }
      }

      if (dr.tables?.length) {
        for (const s of dr.tables) {
          if (!s.refId) {
            s.refId = dr.refId;
          }
          rsp.data.push(toDataFrame(s));
        }
      }
    }
  }

  // When it is not an OK response, make sure the error gets added
  if (res.status && res.status !== 200) {
    if (rsp.state !== LoadingState.Error) {
      rsp.state = LoadingState.Error;
    }
    if (!rsp.error) {
      rsp.error = toDataQueryError(res);
    }
  }

  return rsp;
}
