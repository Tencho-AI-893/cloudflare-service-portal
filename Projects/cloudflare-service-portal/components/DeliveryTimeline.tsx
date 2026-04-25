'use client'

import { useState } from 'react'

export default function DeliveryTimeline() {
  const [selectedArea, setSelectedArea] = useState('tokyo')

  const deliveryInfo = {
    tokyo: {
      name: '東京都内',
      fee: '¥500',
      days: '1-2日',
      description: '¥5,000以上の注文で送料無料',
    },
    osaka: {
      name: '大阪府内',
      fee: '¥600',
      days: '1-2日',
      description: '¥5,000以上の注文で送料無料',
    },
    kyoto: {
      name: '京都府内',
      fee: '¥700',
      days: '2-3日',
      description: '¥8,000以上の注文で送料無料',
    },
    nagoya: {
      name: '名古屋周辺',
      fee: '¥700',
      days: '2-3日',
      description: '¥8,000以上の注文で送料無料',
    },
    fukuoka: {
      name: '福岡周辺',
      fee: '¥800',
      days: '2-3日',
      description: '¥10,000以上の注文で送料無料',
    },
    other: {
      name: 'その他の地域',
      fee: '¥1,000+',
      days: '3-5日',
      description: 'お見積り後のご連絡となります',
    },
  }

  const currentInfo = deliveryInfo[selectedArea as keyof typeof deliveryInfo] || deliveryInfo.tokyo

  return (
    <section id="delivery" className="py-20 bg-gray-50">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 text-center">
            配送と修理サービスの流れ
          </h2>
          <p className="text-lg text-gray-600 text-center mb-12">
            お住まいの地域を選択して、配送料金と納期をご確認ください
          </p>

          {/* Area Selector */}
          <div className="mb-10">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(deliveryInfo).map(([key, info]) => (
                <button
                  key={key}
                  onClick={() => setSelectedArea(key)}
                  className={`p-4 rounded-lg font-semibold transition-all duration-200 ${
                    selectedArea === key
                      ? 'bg-blue-600 text-white shadow-lg scale-105'
                      : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-300'
                  }`}
                >
                  {info.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Info Card */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-12 border-l-4 border-blue-600">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">{currentInfo.name}</h3>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-sm text-gray-600 font-medium mb-2">配送料金</p>
                <p className="text-3xl font-bold text-blue-600">{currentInfo.fee}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium mb-2">納期の目安</p>
                <p className="text-3xl font-bold text-green-600">{currentInfo.days}</p>
              </div>
            </div>
            <p className="text-gray-700 bg-blue-50 p-4 rounded-lg">{currentInfo.description}</p>
          </div>

          {/* Process Steps */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">修理サービスの流れ</h3>

            <div className="relative">
              {/* Timeline Line */}
              <div className="hidden md:block absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-600 to-gray-300"></div>

              {/* Steps */}
              <div className="space-y-8">
                {[
                  { icon: '📋', title: 'ステップ1: 見積もり', description: 'デバイスの詳細を送信し、即座に見積もりを取得' },
                  { icon: '🚚', title: 'ステップ2: 配送', description: 'ご自宅からのピックアップまたは店舗へのご来店' },
                  { icon: '🔧', title: 'ステップ3: 修理', description: '認定技術者が迅速にデバイスを修理' },
                  { icon: '✅', title: 'ステップ4: 返送', description: '1年間の保証付きでデバイスをご返却' },
                ].map((step, index) => (
                  <div key={index} className="flex gap-6">
                    <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full text-2xl font-bold relative z-10">
                      {step.icon}
                    </div>
                    <div className="flex-grow pt-2">
                      <h4 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h4>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
