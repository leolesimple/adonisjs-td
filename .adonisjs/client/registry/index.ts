/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'wishes.index': {
    methods: ["GET","HEAD"],
    pattern: '/wishes',
    tokens: [[0,"wishes"]],
    types: placeholder as Registry['wishes.index']['types'],
  },
  'wishes.store': {
    methods: ["POST"],
    pattern: '/wishes',
    tokens: [[0,"wishes"]],
    types: placeholder as Registry['wishes.store']['types'],
  },
  'wishes.show': {
    methods: ["GET","HEAD"],
    pattern: '/wishes/:id',
    tokens: [[0,"wishes"],[1,"id"]],
    types: placeholder as Registry['wishes.show']['types'],
  },
  'wishes.update': {
    methods: ["PUT","PATCH"],
    pattern: '/wishes/:id',
    tokens: [[0,"wishes"],[1,"id"]],
    types: placeholder as Registry['wishes.update']['types'],
  },
  'wishes.destroy': {
    methods: ["DELETE"],
    pattern: '/wishes/:id',
    tokens: [[0,"wishes"],[1,"id"]],
    types: placeholder as Registry['wishes.destroy']['types'],
  },
  'wishes.move': {
    methods: ["POST"],
    pattern: '/wishes/:id/move',
    tokens: [[0,"wishes"],[1,"id"],[0,"move"]],
    types: placeholder as Registry['wishes.move']['types'],
  },
  'allocations.store': {
    methods: ["POST"],
    pattern: '/wishes/:wishId/allocations',
    tokens: [[0,"wishes"],[1,"wishId"],[0,"allocations"]],
    types: placeholder as Registry['allocations.store']['types'],
  },
  'allocations.destroy': {
    methods: ["DELETE"],
    pattern: '/allocations/:id',
    tokens: [[0,"allocations"],[1,"id"]],
    types: placeholder as Registry['allocations.destroy']['types'],
  },
  'sources.index': {
    methods: ["GET","HEAD"],
    pattern: '/sources',
    tokens: [[0,"sources"]],
    types: placeholder as Registry['sources.index']['types'],
  },
  'sources.store': {
    methods: ["POST"],
    pattern: '/sources',
    tokens: [[0,"sources"]],
    types: placeholder as Registry['sources.store']['types'],
  },
  'sources.update': {
    methods: ["PUT","PATCH"],
    pattern: '/sources/:id',
    tokens: [[0,"sources"],[1,"id"]],
    types: placeholder as Registry['sources.update']['types'],
  },
  'sources.destroy': {
    methods: ["DELETE"],
    pattern: '/sources/:id',
    tokens: [[0,"sources"],[1,"id"]],
    types: placeholder as Registry['sources.destroy']['types'],
  },
  'transfers.store': {
    methods: ["POST"],
    pattern: '/transfers',
    tokens: [[0,"transfers"]],
    types: placeholder as Registry['transfers.store']['types'],
  },
  'transfers.destroy': {
    methods: ["DELETE"],
    pattern: '/transfers/:id',
    tokens: [[0,"transfers"],[1,"id"]],
    types: placeholder as Registry['transfers.destroy']['types'],
  },
  'projection.index': {
    methods: ["GET","HEAD"],
    pattern: '/projection',
    tokens: [[0,"projection"]],
    types: placeholder as Registry['projection.index']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
