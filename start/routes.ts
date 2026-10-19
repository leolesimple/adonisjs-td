/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

const WishesController = () => import('#controllers/wishes_controller')
const FundingSourcesController = () => import('#controllers/funding_sources_controller')
const AllocationsController = () => import('#controllers/allocations_controller')
const MonthlyTransfersController = () => import('#controllers/monthly_transfers_controller')
const ProjectionsController = () => import('#controllers/projections_controller')

router.get('/', ({ response }) => response.redirect().toRoute('wishes.index'))

router.resource('wishes', WishesController).except(['create', 'edit']).params({ wishes: 'id' })
router
  .resource('sources', FundingSourcesController)
  .only(['index', 'store', 'update', 'destroy'])
  .params({ sources: 'id' })

router.post('/wishes/:id/move', [WishesController, 'move']).as('wishes.move')
router.get('/projection', [ProjectionsController, 'index']).as('projection.index')
router.post('/transfers', [MonthlyTransfersController, 'store']).as('transfers.store')
router.delete('/transfers/:id', [MonthlyTransfersController, 'destroy']).as('transfers.destroy')

router.post('/wishes/:wishId/allocations', [AllocationsController, 'store']).as('allocations.store')
router.delete('/allocations/:id', [AllocationsController, 'destroy']).as('allocations.destroy')
