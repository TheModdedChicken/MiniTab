import { z } from 'zod'
import { SearchArgsSchema } from '../routes'

export enum TabType {
  Tab = 200,
  Chords = 300,
  Bass = 400,
  Ukulele = 800
}

export function formatTabType(type: string) {
  return type
    .replace('Ukulele Chords', 'Ukulele')
    .replace('Bass Tabs', 'Bass');
}

export type SearchArgs = z.infer<typeof SearchArgsSchema>

export interface UGCapo {
  fret: number
  startString: number
  lastString: number
  finger: number
}

export interface UGChord {
  listCapos: UGCapo[]
  frets: number[]
  fingers: number[]
  fret: number
}

export interface UGChordCollection {
  [key: string]: UGChord[]
}

export interface ScrapedTab {
  marketing_type: string
  tab_url: string
  artist_name: string
  song_name: string
  rating: number
  votes: number
  type: string
  difficulty?: string
  tuning?: string[]
  raw_tabs?: string
  htmlTab?: string
}

export interface Tab {
  url: string
  slug: string
  name: string
  artist: string
  numberRates: number
  rating: number
  type: string
  difficulty?: string
  tuning?: string[]
  raw_tabs?: string
  htmlTab?: string
  versions?: Tab[]
  chordsDiagrams?: UGChordCollection[]
}