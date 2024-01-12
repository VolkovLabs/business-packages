import { VariableFormat } from './types';
import { templateService } from './variables';

describe('Template Service', () => {
  describe('containsVariable', () => {
    it('Should be true if some of variables are unknown', () => {
      expect(templateService.containsVariable('$myVar, $unknownVar', ['myVar'])).toBeTruthy();
    });

    it('Should be true for variables with ${var}', () => {
      expect(
        templateService.containsVariable(
          'irate(process_cpu_user_seconds_total{instance=~"${instance}"}[${__rate_interval}]) * 100',
          ['instance', '__rate_interval']
        )
      ).toBeTruthy();
    });

    it('Should be true for variables with $var', () => {
      expect(
        templateService.containsVariable(
          'irate(process_cpu_user_seconds_total{instance=~"$instance"}[$__rate_interval]) * 100',
          ['instance', '__rate_interval']
        )
      ).toBeTruthy();
    });
  });

  describe('getUsedVariables', () => {
    it('Should return variables for ${var}', () => {
      expect(
        templateService.getUsedVariables(
          'irate(process_cpu_user_seconds_total{instance=~"${instance}"}[${__rate_interval}]) * 100'
        )
      ).toEqual(['instance']);
      expect(
        templateService.getUsedVariables(
          'irate(process_cpu_user_seconds_total{instance=~"${instance}"}[${__rate_interval}]) * 100',
          true
        )
      ).toEqual(['instance', '__rate_interval']);
    });

    it('Should find variables for $var', () => {
      expect(
        templateService.getUsedVariables(
          'irate(process_cpu_user_seconds_total{instance=~"$instance"}[$__rate_interval]) * 100'
        )
      ).toEqual(['instance']);
      expect(
        templateService.getUsedVariables(
          'irate(process_cpu_user_seconds_total{instance=~"$instance"}[$__rate_interval]) * 100',
          true
        )
      ).toEqual(['instance', '__rate_interval']);
    });
  });

  describe('replace', () => {
    it('Should replace variables', () => {
      expect(
        templateService.replace(
          '$instance, $app',
          {
            instance: {
              value: '1',
            },
            app: {
              value: '2',
            },
          },
          VariableFormat.GLOB
        )
      ).toEqual('1, 2');
    });

    it('Should pass variable in replacer', () => {
      expect(
        templateService.replace(
          '$instance',
          {
            instance: {
              value: ['1', '2'],
            },
          },
          (value, variable) => {
            return variable.name === 'instance' ? 'found' : 'notFound';
          },
          undefined,
          {
            instance: {
              name: 'instance',
              type: 'custom',
            },
            another: {
              name: 'another',
              type: 'custom',
            },
          }
        )
      ).toEqual('found');
    });
  });
});
