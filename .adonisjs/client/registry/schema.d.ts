/* eslint-disable prettier/prettier */
/// <reference path="../manifest.d.ts" />

import type { ExtractBody, ExtractErrorResponse, ExtractQuery, ExtractQueryForGet, ExtractRawResponse, ExtractResponse } from '@tuyau/core/types'
import type { InferInput, SimpleError } from '@vinejs/vine/types'

export type ParamValue = string | number | bigint | boolean

export interface Registry {
  'wishes.index': {
    methods: ["GET","HEAD"]
    pattern: '/wishes'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/wishes_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/wishes_controller').default['index']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/wishes_controller').default['index']>>>
    }
  }
  'wishes.store': {
    methods: ["POST"]
    pattern: '/wishes'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/wish').wishValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/wish').wishValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/wishes_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/wishes_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/wishes_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'wishes.show': {
    methods: ["GET","HEAD"]
    pattern: '/wishes/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/wishes_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/wishes_controller').default['show']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/wishes_controller').default['show']>>>
    }
  }
  'wishes.update': {
    methods: ["PUT","PATCH"]
    pattern: '/wishes/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/wish').wishValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/wish').wishValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/wishes_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/wishes_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/wishes_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'wishes.destroy': {
    methods: ["DELETE"]
    pattern: '/wishes/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/wishes_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/wishes_controller').default['destroy']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/wishes_controller').default['destroy']>>>
    }
  }
  'wishes.move': {
    methods: ["POST"]
    pattern: '/wishes/:id/move'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/wish').wishMoveValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/wish').wishMoveValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/wishes_controller').default['move']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/wishes_controller').default['move']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/wishes_controller').default['move']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'allocations.store': {
    methods: ["POST"]
    pattern: '/wishes/:wishId/allocations'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/allocation').allocationValidator)>>
      paramsTuple: [ParamValue]
      params: { wishId: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/allocation').allocationValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/allocations_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/allocations_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/allocations_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'allocations.destroy': {
    methods: ["DELETE"]
    pattern: '/allocations/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/allocations_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/allocations_controller').default['destroy']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/allocations_controller').default['destroy']>>>
    }
  }
  'sources.index': {
    methods: ["GET","HEAD"]
    pattern: '/sources'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/funding_sources_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/funding_sources_controller').default['index']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/funding_sources_controller').default['index']>>>
    }
  }
  'sources.store': {
    methods: ["POST"]
    pattern: '/sources'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/funding_source').fundingSourceValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/funding_source').fundingSourceValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/funding_sources_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/funding_sources_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/funding_sources_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'sources.update': {
    methods: ["PUT","PATCH"]
    pattern: '/sources/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/funding_source').fundingSourceValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/funding_source').fundingSourceValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/funding_sources_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/funding_sources_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/funding_sources_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'sources.destroy': {
    methods: ["DELETE"]
    pattern: '/sources/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/funding_sources_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/funding_sources_controller').default['destroy']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/funding_sources_controller').default['destroy']>>>
    }
  }
  'transfers.store': {
    methods: ["POST"]
    pattern: '/transfers'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/monthly_transfer').monthlyTransferValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/monthly_transfer').monthlyTransferValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/monthly_transfers_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/monthly_transfers_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/monthly_transfers_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'transfers.destroy': {
    methods: ["DELETE"]
    pattern: '/transfers/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/monthly_transfers_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/monthly_transfers_controller').default['destroy']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/monthly_transfers_controller').default['destroy']>>>
    }
  }
  'projection.index': {
    methods: ["GET","HEAD"]
    pattern: '/projection'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/projections_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/projections_controller').default['index']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/projections_controller').default['index']>>>
    }
  }
}
