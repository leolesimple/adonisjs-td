/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  wishes: {
    index: typeof routes['wishes.index']
    store: typeof routes['wishes.store']
    show: typeof routes['wishes.show']
    update: typeof routes['wishes.update']
    destroy: typeof routes['wishes.destroy']
    move: typeof routes['wishes.move']
  }
  allocations: {
    store: typeof routes['allocations.store']
    destroy: typeof routes['allocations.destroy']
  }
  sources: {
    index: typeof routes['sources.index']
    store: typeof routes['sources.store']
    update: typeof routes['sources.update']
    destroy: typeof routes['sources.destroy']
  }
  transfers: {
    store: typeof routes['transfers.store']
    destroy: typeof routes['transfers.destroy']
  }
  projection: {
    index: typeof routes['projection.index']
  }
}
