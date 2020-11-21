import Ajax from '.'
import 'isomorphic-fetch'

const user1 = fetch('https://reqres.in/api/users/1').then(data => data.text())

describe('Ajax', () => {
  test('simple', async () => {
    expect(await new Ajax('https://reqres.in/api/users/1')).toBe(await user1)
  })
  describe('data', () => {
    test('field', async () => {
      const user = new Ajax('https://reqres.in/api/users/{user}', {type: 'json'})
      user.data.user = 1

      const result1 = await user

      expect(result1.data.id).toBe(1)
      expect(result1.data.first_name).toBe('George')

      user.data.user = 2
      user.update()

      const result2 = await user

      expect(result2.data.id).toBe(2)
      expect(result2.data.first_name).toBe('Janet')
    })
    test('option', async () => {
      const user = new Ajax('https://reqres.in/api/users/{user}', {type: 'json', data: {user: 1}})

      const result1 = await user

      expect(result1.data.id).toBe(1)
      expect(result1.data.first_name).toBe('George')

      user.data.user = 2
      user.update()

      const result2 = await user

      expect(result2.data.id).toBe(2)
      expect(result2.data.first_name).toBe('Janet')
    })
  })
  test('loading', async () => {
    const ajax = new Ajax('https://reqres.in/api/users/1')
    expect(ajax.loading).toBe(true)
    await ajax
    expect(ajax.loading).toBe(false)
  })
  test('loaded', async () => {
    const ajax = new Ajax('https://reqres.in/api/users/1')
    expect(ajax.loaded).toBe(false)
    await ajax
    expect(ajax.loaded).toBe(true)
  })
  test('value', async () => {
    const ajax = new Ajax('https://reqres.in/api/users/1')
    expect(ajax.value).toBe(undefined)
    await ajax
    expect(ajax.value).toBe(await user1)
  })
  test('then catch finally', async () => {
    const user = new Ajax('https://reqres.in/api/users/1')
    let f, t, c

    user
      .finally(value => f = value)
      .then(value => t = value)
      .catch(value => c = value)

    await user

    expect(f).toBe(await user1)
    expect(t).toBe(await user1)
    expect(c).toBe(undefined)
  })
  test('error', async () => {
    const user = new Ajax('https://reqres.in/api/login', {method: 'post', type: "json"})
    try { await user } catch (e) {}
    expect(user.value).toBe(undefined)
    expect(user.error).toEqual({error: 'Missing email or username'})
  })
  test('answer', async () => {
    const user = new Ajax('https://reqres.in/api/users/23')
    expect(user.answer).toBe(undefined)
    try { await user } catch (e) {}
    expect(user.answer.ok).toBe(false)
    expect(user.answer.status).toBe(404)
  })
  test('query', async () => {
    const user = new Ajax('https://reqres.in/api/users', {query: {page: 1}, type: 'json'})
    await user
    expect(user.value.page).toBe(1)

    user.query.page = 2
    user.update()

    await user

    expect(user.value.page).toBe(2)
  })
  test('resolve', async () => {
    const user = new Ajax('https://reqres.in/api/users/{user}', {data: {user: 1}, type: 'json'})
    user.resolve({data: {id: 2}})
    await user
    expect(user.value.data.id).toBe(2)

    user.update()

    await user

    expect(user.value.data.id).toBe(1)
  })
})
