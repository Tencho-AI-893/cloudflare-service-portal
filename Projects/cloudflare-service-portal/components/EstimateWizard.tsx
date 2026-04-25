'use client'

import { useState } from 'react'

interface EstimateResult {
  baseCost: number
  serviceFee: number
  total: number
}

export default function EstimateWizard() {
  const [step, setStep] = useState(1)
  const [deviceType, setDeviceType] = useState('')
  const [issueType, setIssueType] = useState('')
  const [estimate, setEstimate] = useState<EstimateResult | null>(null)

  const deviceTypes = [
    { value: 'smartphone', label: 'スマートフォン', icon: '📱' },
    { value: 'tablet', label: 'タブレット', icon: '📘' },
    { value: 'laptop', label: 'ノートパソコン', icon: '💻' },
    { value: 'smartwatch', label: 'スマートウォッチ', icon: '⌚' },
  ]

  const issueTypes: Record<string, { value: string; label: string; cost: number }[]> = {
    smartphone: [
      { value: 'screen', label: '画面交換', cost: 15000 },
      { value: 'battery', label: 'バッテリー交換', cost: 8000 },
      { value: 'water', label: '水没修理', cost: 12000 },
      { value: 'charging', label: '充電ポート修理', cost: 6000 },
    ],
    tablet: [
      { value: 'screen', label: '画面交換', cost: 20000 },
      { value: 'battery', label: 'バッテリー交換', cost: 12000 },
      { value: 'water', label: '水没修理', cost: 15000 },
    ],
    laptop: [
      { value: 'screen', label: 'ディスプレイ交換', cost: 25000 },
      { value: 'battery', label: 'バッテリー交換', cost: 15000 },
      { value: 'keyboard', label: 'キーボード交換', cost: 10000 },
      { value: 'logic', label: 'ロジックボード修理', cost: 30000 },
    ],
    smartwatch: [
      { value: 'screen', label: 'ディスプレイ交換', cost: 8000 },
      { value: 'battery', label: 'バッテリー交換', cost: 5000 },
      { value: 'band', label: 'バンド交換', cost: 3000 },
    ],
  }

  const handleNext = () => {
    if (step === 1 && deviceType) {
      setStep(2)
    }
  }

  const handleCalculate = () => {
    if (issueType && deviceType) {
      const issues = issueTypes[deviceType]
      const selectedIssue = issues.find((i) => i.value === issueType)

      if (selectedIssue) {
        const baseCost = selectedIssue.cost
        const serviceFee = Math.round(baseCost * 0.15)
        const total = baseCost + serviceFee

        setEstimate({
          baseCost,
          serviceFee,
          total,
        })
      }
    }
  }

  const handleReset = () => {
    setStep(1)
    setDeviceType('')
    setIssueType('')
    setEstimate(null)
  }

  return (
    <section id="estimate" className="py-20 bg-white">
      <div className="container">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 text-center">
            見積もり計算機
          </h2>
          <p className="text-lg text-gray-600 text-center mb-12">
            わずか2ステップで修理の見積もりを取得
          </p>

          <div className="bg-gray-50 rounded-lg shadow-lg p-8 md:p-12">
            {!estimate ? (
              <>
                {/* Progress Indicator */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`flex-1 h-2 rounded-full mx-2 transition-all duration-300 ${
                        step >= 1 ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    />
                    <div
                      className={`flex-1 h-2 rounded-full mx-2 transition-all duration-300 ${
                        step >= 2 ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    />
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span className={step >= 1 ? 'font-bold text-blue-600' : ''}>ステップ1: デバイス</span>
                    <span className={step >= 2 ? 'font-bold text-blue-600' : ''}>ステップ2: トラブル</span>
                  </div>
                </div>

                {/* Step 1: Device Type Selection */}
                {step === 1 && (
                  <div className="animate-slideIn">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">どのデバイスが故障していますか？</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                      {deviceTypes.map((device) => (
                        <button
                          key={device.value}
                          onClick={() => setDeviceType(device.value)}
                          className={`p-6 rounded-lg border-2 transition-all duration-200 flex flex-col items-center justify-center gap-3 ${
                            deviceType === device.value
                              ? 'border-blue-600 bg-blue-50'
                              : 'border-gray-200 bg-white hover:border-blue-300'
                          }`}
                        >
                          <div className="text-4xl">{device.icon}</div>
                          <p className="font-semibold text-gray-900">{device.label}</p>
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={handleNext}
                      disabled={!deviceType}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
                    >
                      次へ →
                    </button>
                  </div>
                )}

                {/* Step 2: Issue Type Selection */}
                {step === 2 && deviceType && (
                  <div className="animate-slideIn">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">トラブルの内容を選択してください</h3>
                    <div className="space-y-3 mb-8">
                      {issueTypes[deviceType].map((issue) => (
                        <button
                          key={issue.value}
                          onClick={() => setIssueType(issue.value)}
                          className={`w-full p-4 rounded-lg border-2 transition-all duration-200 flex items-center justify-between ${
                            issueType === issue.value
                              ? 'border-blue-600 bg-blue-50'
                              : 'border-gray-200 bg-white hover:border-blue-300'
                          }`}
                        >
                          <span className="font-semibold text-gray-900">{issue.label}</span>
                          <span className="text-blue-600 font-bold">¥{issue.cost.toLocaleString('ja-JP')}〜</span>
                        </button>
                      ))}
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={() => {
                          setStep(1)
                          setIssueType('')
                        }}
                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold py-3 px-6 rounded-lg transition-colors duration-200"
                      >
                        ← 戻る
                      </button>
                      <button
                        onClick={handleCalculate}
                        disabled={!issueType}
                        className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
                      >
                        見積もり計算 →
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              // Estimate Result
              <div className="animate-slideIn text-center">
                <div className="mb-8">
                  <svg className="w-16 h-16 text-green-600 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">見積もり完了</h3>
                </div>

                <div className="bg-white rounded-lg p-8 mb-8 border-2 border-green-200">
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                      <span className="text-gray-600">基本修理料金</span>
                      <span className="font-bold text-gray-900">¥{estimate.baseCost.toLocaleString('ja-JP')}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                      <span className="text-gray-600">手数料 (15%)</span>
                      <span className="font-bold text-gray-900">¥{estimate.serviceFee.toLocaleString('ja-JP')}</span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span className="text-lg font-bold text-gray-900">合計金額</span>
                      <span className="text-3xl font-bold text-blue-600">¥{estimate.total.toLocaleString('ja-JP')}</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded mb-6">
                    ✓ 1年間の保証付き | ✓ 即日対応可能 | ✓ 無料ピックアップ可能
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleReset}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold py-3 px-6 rounded-lg transition-colors duration-200"
                  >
                    別の商品を計算
                  </button>
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200">
                    修理を予約
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
