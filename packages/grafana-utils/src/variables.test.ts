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
});
