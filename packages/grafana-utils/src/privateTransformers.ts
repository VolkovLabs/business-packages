import { heatmapTransformer } from './grafana/transformers/calculateHeatmap/heatmap';
import { configFromDataTransformer } from './grafana/transformers/configFromQuery/configFromQuery';
import { extractFieldsTransformer } from './grafana/transformers/extractFields/extractFields';
import { joinByLabelsTransformer } from './grafana/transformers/joinByLabels/joinByLabels';
import { partitionByValuesTransformer } from './grafana/transformers/partitionByValues/partitionByValues';
import { prepareTimeSeriesTransformer } from './grafana/transformers/prepareTimeSeries/prepareTimeSeries';
import { rowsToFieldsTransformer } from './grafana/transformers/rowsToFields/rowsToFields';
import { timeSeriesTableTransformer } from './grafana/transformers/timeSeriesTable/timeSeriesTableTransformer';

/**
 * Private Transformers
 */
export const privateTransformers = {
  configFromDataTransformer,
  heatmapTransformer,
  extractFieldsTransformer,
  joinByLabelsTransformer,
  partitionByValuesTransformer,
  prepareTimeSeriesTransformer,
  rowsToFieldsTransformer,
  timeSeriesTableTransformer,
};
