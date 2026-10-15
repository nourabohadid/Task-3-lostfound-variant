import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../api'

const defaults = {
  title: '',
  description: '',
  category: 'other',
  status: 'lost',
  location: ''
}

export default function ItemForm() {
  const nav = useNavigate()
  const { id } = useParams()

  const [form, setForm] = useState(defaults)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return

    async function loadItem() {
      try {
        setError('')

        const res = await api.get(`/items/${id}`)
        const item = res.data

        setForm({
          title: item.title || '',
          description: item.description || '',
          category: item.category || 'other',
          status: item.status || 'lost',
          location: item.location || ''
        })
      } catch (err) {
        setError(
          err.response?.data?.message || 'Failed to load item'
        )
      }
    }

    loadItem()
  }, [id])

  function onChange(e) {
    const { name, value } = e.target

    setForm({
      ...form,
      [name]: value
    })
  }

  async function onSubmit(e) {
    e.preventDefault()
    setError('')

    const data = {
      title: form.title,
      status: form.status,
      category: form.category,
      location: form.location,
      description: form.description
    }

    try {
      if (id) {
        await api.patch(`/items/${id}`, data)
      } else {
        await api.post('/items', data)
      }

      nav('/items')
    } catch (err) {
      setError(
        err.response?.data?.message || 'Something went wrong'
      )
    }
  }

  return (
    <div className="max-w-lg mx-auto card">
      <h1 className="text-xl font-semibold mb-4">
        {id ? 'Edit' : 'Report'} Item
      </h1>

      <form onSubmit={onSubmit} className="space-y-3">

        <div>
          <label className="block mb-1">
            Title
          </label>

          <input
            type="text"
            name="title"
            value={form.title}
            onChange={onChange}
            placeholder="Black backpack"
            className="input"
            required
          />
        </div>

        <div>
          <label className="block mb-1">
            Status
          </label>

          <select
            name="status"
            value={form.status}
            onChange={onChange}
            className="input"
          >
            <option value="lost">Lost</option>
            <option value="found">Found</option>
            <option value="claimed">Claimed</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">
            Category
          </label>

          <select
            name="category"
            value={form.category}
            onChange={onChange}
            className="input"
          >
            <option value="electronics">
              Electronics
            </option>

            <option value="clothing">
              Clothing
            </option>

            <option value="documents">
              Documents
            </option>

            <option value="accessories">
              Accessories
            </option>

            <option value="other">
              Other
            </option>
          </select>
        </div>

        <div>
          <label className="block mb-1">
            Location
          </label>

          <input
            type="text"
            name="location"
            value={form.location}
            onChange={onChange}
            placeholder="Library 2nd floor"
            className="input"
          />
        </div>

        <div>
          <label className="block mb-1">
            Description
          </label>

          <textarea
            name="description"
            value={form.description}
            onChange={onChange}
            rows="4"
            className="input"
          />
        </div>

        {error && (
          <div className="text-red-600 text-sm">
            {error}
          </div>
        )}

        <button
          className="btn"
          type="submit"
        >
          Save
        </button>

      </form>
    </div>
  )
}