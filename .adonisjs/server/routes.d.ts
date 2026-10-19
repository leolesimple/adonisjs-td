import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'wishes.index': { paramsTuple?: []; params?: {} }
    'wishes.store': { paramsTuple?: []; params?: {} }
    'wishes.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'wishes.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'wishes.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'wishes.move': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'allocations.store': { paramsTuple: [ParamValue]; params: {'wishId': ParamValue} }
    'allocations.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'sources.index': { paramsTuple?: []; params?: {} }
    'sources.store': { paramsTuple?: []; params?: {} }
    'sources.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'sources.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'transfers.store': { paramsTuple?: []; params?: {} }
    'transfers.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'projection.index': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'wishes.index': { paramsTuple?: []; params?: {} }
    'wishes.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'sources.index': { paramsTuple?: []; params?: {} }
    'projection.index': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'wishes.index': { paramsTuple?: []; params?: {} }
    'wishes.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'sources.index': { paramsTuple?: []; params?: {} }
    'projection.index': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'wishes.store': { paramsTuple?: []; params?: {} }
    'wishes.move': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'allocations.store': { paramsTuple: [ParamValue]; params: {'wishId': ParamValue} }
    'sources.store': { paramsTuple?: []; params?: {} }
    'transfers.store': { paramsTuple?: []; params?: {} }
  }
  PUT: {
    'wishes.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'sources.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  PATCH: {
    'wishes.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'sources.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  DELETE: {
    'wishes.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'allocations.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'sources.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'transfers.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}