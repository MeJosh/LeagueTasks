import type { LeagueConfig } from '../types/league'

/**
 * Registry of all supported leagues, in chronological order.
 * The last entry is used as the default.
 *
 * To add League 6: push a new entry to the end of this array.
 */
export const LEAGUES: LeagueConfig[] = [
  {
    id: 1,
    name: 'Twisted League',
    slug: 'league-1-twisted',
    dataPath: 'data/league1.json',
  },
  {
    id: 2,
    name: 'Trailblazer League',
    slug: 'league-2-trailblazer',
    dataPath: 'data/league2.json',
  },
  {
    id: 3,
    name: 'Shattered Relics League',
    slug: 'league-3-shattered-relics',
    dataPath: 'data/league3.json',
  },
  {
    id: 4,
    name: 'Trailblazer Reloaded League',
    slug: 'league-4-trailblazer-reloaded',
    dataPath: 'data/league4.json',
  },
  {
    id: 5,
    name: 'Raging Echoes League',
    slug: 'league-5-raging-echoes',
    dataPath: 'data/league5.json',
  },
]

/** The default league — always the most recent entry. */
export const DEFAULT_LEAGUE = LEAGUES[LEAGUES.length - 1]
