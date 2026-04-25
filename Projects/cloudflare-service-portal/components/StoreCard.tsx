'use client'

interface StoreCardProps {
  id: number
  name: string
  address: string
  phone: string
  hours: string
  area: string
}

export default function StoreCard({
  name,
  address,
  phone,
  hours,
  area,
}: StoreCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden hover:border-blue-300">
      {/* Store Header with Area Badge */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <h3 className="text-xl font-bold text-gray-900">{name}</h3>
          <span className="inline-block px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full capitalize">
            {area}
          </span>
        </div>
      </div>

      {/* Store Details */}
      <div className="px-6 py-5">
        {/* Address */}
        <div className="mb-4 flex gap-3">
          <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-sm font-medium text-gray-600">住所</p>
            <p className="text-gray-900">{address}</p>
          </div>
        </div>

        {/* Phone */}
        <div className="mb-4 flex gap-3">
          <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.23.613a16.065 16.065 0 006.837 6.837l.613-1.23a1 1 0 011.06-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-gray-600">電話</p>
            <a href={`tel:${phone}`} className="text-blue-600 hover:text-blue-800 font-semibold">
              {phone}
            </a>
          </div>
        </div>

        {/* Hours */}
        <div className="flex gap-3">
          <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00-.293.707l-.707.707a1 1 0 101.414 1.414l1-1A1 1 0 0011 10V6z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-sm font-medium text-gray-600">営業時間</p>
            <p className="text-gray-900">{hours}</p>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
          来店予約
        </button>
      </div>
    </div>
  )
}
