import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import Wish from '#models/wish'

const valid = {
  name: 'Écran 4K',
  price: 599.99,
  priority: 'high',
  status: 'wished',
  fundingMode: 'monthly',
}

test.group('Wishes CRUD', (group) => {
  group.each.setup(() => testUtils.db().truncate())

  test('index lists wishes with their funding summary', async ({ client, assert }) => {
    await Wish.create({
      name: 'Casque',
      priceCents: 10000,
      priority: 'low',
      status: 'wished',
      fundingMode: 'monthly',
    })
    const response = await client.get('/wishes').withInertia()

    response.assertStatus(200)
    assert.equal(response.inertiaComponent, 'wishes/index')
    assert.lengthOf(response.inertiaProps.wishes, 1)
    assert.equal(response.inertiaProps.wishes[0].funding.remainingCents, 10000)
  })

  test('index filters by status and ignores unknown statuses', async ({ client, assert }) => {
    await Wish.createMany([
      { name: 'A', priceCents: 100, priority: 'low', status: 'wished', fundingMode: 'monthly' },
      { name: 'B', priceCents: 100, priority: 'low', status: 'bought', fundingMode: 'monthly' },
    ])
    const filtered = await client.get('/wishes?status=bought').withInertia()
    assert.deepEqual(
      filtered.inertiaProps.wishes.map((w: { name: string }) => w.name),
      ['B']
    )

    const unknown = await client.get('/wishes?status=nope').withInertia()
    assert.lengthOf(unknown.inertiaProps.wishes, 2)
  })

  test('store creates a wish and converts euros to cents', async ({ client, assert }) => {
    const response = await client.post('/wishes').form(valid).redirects(0)

    response.assertStatus(302)
    const wish = await Wish.firstOrFail()
    assert.equal(wish.priceCents, 59999)
    assert.equal(wish.priority, 'high')
    assert.isNull(wish.category)
  })

  test('store rejects invalid data', async ({ client, assert }) => {
    const response = await client
      .post('/wishes')
      .form({ ...valid, name: '', price: -5 })
      .redirects(0)

    response.assertStatus(302)
    assert.isNull(await Wish.first())
  })

  test('store requires a target date in deadline mode', async ({ client, assert }) => {
    await client
      .post('/wishes')
      .form({ ...valid, fundingMode: 'deadline' })
      .redirects(0)
    assert.isNull(await Wish.first())

    await client
      .post('/wishes')
      .form({ ...valid, fundingMode: 'deadline', targetDate: '2026-11-10' })
      .redirects(0)
    const wish = await Wish.firstOrFail()
    assert.equal(wish.targetDate?.toISODate(), '2026-11-10')
  })

  test('show returns the wish and the available sources', async ({ client, assert }) => {
    const wish = await Wish.create({
      name: 'Casque',
      priceCents: 10000,
      priority: 'low',
      status: 'wished',
      fundingMode: 'monthly',
    })
    const response = await client.get(`/wishes/${wish.id}`).withInertia()

    response.assertStatus(200)
    assert.equal(response.inertiaComponent, 'wishes/show')
    assert.equal(response.inertiaProps.wish.name, 'Casque')
  })

  test('show returns 404 for an unknown wish', async ({ client }) => {
    const response = await client.get('/wishes/999').withInertia()
    response.assertStatus(404)
  })

  test('update changes fields and clears optional ones', async ({ client, assert }) => {
    const wish = await Wish.create({
      name: 'Ancien nom',
      priceCents: 1000,
      category: 'Setup',
      priority: 'low',
      status: 'wished',
      fundingMode: 'monthly',
    })
    const response = await client
      .put(`/wishes/${wish.id}`)
      .form({ ...valid, name: 'Nouveau nom', category: '' })
      .redirects(0)

    response.assertStatus(302)
    await wish.refresh()
    assert.equal(wish.name, 'Nouveau nom')
    assert.equal(wish.priceCents, 59999)
    assert.isNull(wish.category)
  })

  test('destroy deletes the wish', async ({ client, assert }) => {
    const wish = await Wish.create({
      name: 'À supprimer',
      priceCents: 1000,
      priority: 'low',
      status: 'wished',
      fundingMode: 'monthly',
    })
    const response = await client.delete(`/wishes/${wish.id}`).redirects(0)

    response.assertStatus(302)
    assert.isNull(await Wish.find(wish.id))
  })
})
