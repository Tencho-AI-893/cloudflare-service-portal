'use client'

import { useEffect, useState } from 'react'
import StoreCard from './StoreCard'

interface Shop {
  id: number
  name: string
  address: string
  phone: string
  hours: string
  area: string
}

export default function StoreGrid() {
  const [shops, setShops] = useState<Shop[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedArea, setSelectedArea] = useState('all')

  useEffect(() => {
    const fetchShops = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/shops')

        if (!response.ok) {
          throw new Error('Failed to fetch shops')
        }

        const data = await response.json()
        setShops(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchShops()
  }, [])

  const uniqueAreas = ['all', ...new Set(shops.map((shop) => shop.area))]
  const filteredShops = selectedArea === 'all' ? shops : shops.filter((shop) => shop.area === selectedArea)

  return (
    <section id="shops" className="py-20 bg-white">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 text-center">
            店舗を探す
          </h2>
          <p className="text-lg text-gray-600 text-center mb-12">
            迅速な修理とエキスパートサポートのため、お近くのサービスセンターへお越しください
          </p>

          {/* Area Filter */}
          {!loading && (
            <div className="flex flex-wrap gap-3 justify-center mb-12">
              {uniqueAreas.map((area) => (
                <button
                  key={area}
                  onClick={() => setSelectedArea(area)}
                  className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 capitalize ${
                    selectedArea === area
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {area === 'all' ? 'すべての店舗' : area}
                </button>
              ))}
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
              <p className="mt-4 text-gray-600">店舗情報を読み込んでいます...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-600 font-semibold">エラー: {error}</p>
              <p className="text-red-500 mt-2 text-sm">ページを更新してお試しください</p>
            </div>
          )}

          {/* Store Grid */}
          {!loading && !error && (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {filteredShops.map((shop) => (
                  <StoreCard key={shop.id} {...shop} />
                ))}
              </div>

              {filteredShops.length === 0 && (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="text-gray-600 text-lg">このエリアには店舗がありません</p>
                </div>
              )}

              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 text-center">
                <h3 className="text-lg font-bold text-gray-900 mb-2">お探しの場所が見つかりませんか？</h3>
                <p className="text-gray-600 mb-4">只今、拡大中です。郵送修理サービスについてお問い合わせください。</p>
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200">
                  お問い合わせ
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
