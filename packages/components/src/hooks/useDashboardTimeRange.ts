import { EventBus, TimeRange } from '@grafana/data';
import { TimeRangeUpdatedEvent } from '@grafana/runtime';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

/**
 * Use Dashboard Time Range
 * @param timeRange
 * @param eventBus
 */
export const useDashboardTimeRange = ({
  initialTimeRange,
  eventBus,
}: {
  initialTimeRange: TimeRange;
  eventBus: EventBus;
}): [TimeRange, Dispatch<SetStateAction<TimeRange>>] => {
  const [value, setValue] = useState<TimeRange>(initialTimeRange);

  /**
   * Update on dashboard time range change
   */
  useEffect(() => {
    /**
     * On Time Range Updated
     */
    const subscriber = eventBus.getStream(TimeRangeUpdatedEvent).subscribe((event) => {
      setValue(event.payload);
    });

    return () => {
      subscriber.unsubscribe();
    };
  }, [eventBus]);

  return [value, setValue];
};
