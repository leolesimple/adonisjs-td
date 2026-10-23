import { controllers } from '#generated/controllers'
import router from '@adonisjs/core/services/router'

router.get('/', ({ response }) => response.redirect().toRoute('wishes.index'))

router.resource('wishes', controllers.Wishes).except(['create', 'edit']).params({ wishes: 'id' })
router.post('/wishes/:id/move', [controllers.Wishes, 'move']).as('wishes.move')
router
  .post('/wishes/:wishId/allocations', [controllers.Allocations, 'store'])
  .as('allocations.store')
router.delete('/allocations/:id', [controllers.Allocations, 'destroy']).as('allocations.destroy')

router
  .resource('sources', controllers.FundingSources)
  .only(['index', 'store', 'update', 'destroy'])
  .params({ sources: 'id' })
router.post('/transfers', [controllers.MonthlyTransfers, 'store']).as('transfers.store')
router.delete('/transfers/:id', [controllers.MonthlyTransfers, 'destroy']).as('transfers.destroy')

router.get('/projection', [controllers.Projections, 'index']).as('projection.index')
