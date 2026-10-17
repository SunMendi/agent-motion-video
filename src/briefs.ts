import type {Brief, Timing} from './model';
import devsolutionsBrief from '../briefs/devsolutions.json';
import devsolutionsTiming from '../briefs/devsolutions.timing.json';

export type Entry = {brief: Brief; timing: Timing};

/** One entry per ad. Add a new ad by adding its brief and timing here. */
export const entries: Entry[] = [
  {
    brief: devsolutionsBrief as unknown as Brief,
    timing: devsolutionsTiming as unknown as Timing,
  },
];
