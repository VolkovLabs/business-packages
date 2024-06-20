import { FieldType, toDataFrame } from '@grafana/data';

import { findField, getFieldValues, getLastFieldValue } from './frame';

describe('Frame utils', () => {
  describe('findField', () => {
    it('Should find first suitable field', () => {
      const frame1 = toDataFrame({
        fields: [
          {
            name: 'field',
            type: FieldType.number,
          },
        ],
      });
      const frame2 = toDataFrame({
        fields: [
          {
            name: 'field',
            type: FieldType.string,
          },
        ],
      });

      const result = findField([frame1, frame2], (field) => field.name === 'field');

      expect(result).toBeDefined();
      expect(result?.name).toEqual('field');
      expect(result?.type).toEqual(FieldType.number);
    });

    it('Should return nothing if no field found', () => {
      const frame1 = toDataFrame({
        fields: [
          {
            name: 'field',
            type: FieldType.number,
          },
        ],
      });

      const result = findField([frame1], (field) => field.name === '123');

      expect(result).not.toBeDefined();
    });
  });

  describe('getFieldValues', () => {
    it('Should return field values', () => {
      const series = [
        toDataFrame({
          fields: [
            { name: 'name', type: FieldType.string, values: ['file1.png', 'file1.png', ''] },
            {
              name: 'media',
              type: FieldType.string,
              values: ['1', '2', ''],
            },
          ],
        }),
      ];

      const mediaData = getFieldValues(series, 'media');
      expect(mediaData).toHaveLength(3);
      expect(mediaData[0]).toEqual(series[0].fields[1].values[0]);
      expect(mediaData[1]).toEqual(series[0].fields[1].values[1]);
    });

    it('Should take field with specified type or name', () => {
      const dataFrames = [
        toDataFrame({
          fields: [
            { name: 'name', type: FieldType.string, values: ['file1.png', 'file1.png', ''] },
            {
              name: 'media',
              type: FieldType.number,
              values: [1, 2, 0],
            },
          ],
        }),
      ];

      const mediaData = getFieldValues(dataFrames, 'media', FieldType.string);

      expect(mediaData).toHaveLength(0);
      expect(mediaData).toEqual([]);
    });
  });

  describe('getLastFieldValue', () => {
    it('Should return last field value', () => {
      const frame = toDataFrame({
        fields: [
          {
            name: 'value',
            values: [1, 2, 3],
          },
        ],
      });

      expect(getLastFieldValue([frame], 'value')).toEqual(3);
    });

    it('Should return nothing if no values', () => {
      const frame = toDataFrame({
        fields: [
          {
            name: 'value',
            values: [],
          },
        ],
      });

      expect(getLastFieldValue([frame], 'value')).not.toBeDefined();
    });

    it('Should return nothing if no field', () => {
      const frame = toDataFrame({
        fields: [
          {
            name: 'value',
            values: [1, 2],
          },
        ],
      });

      expect(getLastFieldValue([frame], '')).not.toBeDefined();
    });
  });
});
