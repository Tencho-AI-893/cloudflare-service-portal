'use client'

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-800 py-20 md:py-32">
      {/* SVG Background Pattern */}
      <svg
        className="absolute inset-0 h-full w-full text-blue-700 opacity-10"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#grid)" />
      </svg>

      <div className="container relative z-10">
        <div className="max-w-3xl">
          <h1 className="mb-6 text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight animate-slideIn">
            迅速で信頼できるデバイス修理
          </h1>
          <p className="mb-8 text-xl text-blue-50 leading-relaxed">
            認定技術者によるプロフェッショナルな修理サービス。一部店舗では即日対応も可能です。
          </p>

          {/* 3 Key Strengths */}
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-6 border border-white border-opacity-20">
              <div className="flex items-center justify-center w-12 h-12 bg-white bg-opacity-20 rounded-full mb-4">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5.951-1.429 5.951 1.429a1 1 0 001.169-1.409l-7-14z" />
                </svg>
              </div>
              <h3 className="text-white font-bold text-lg mb-2">認定技術者</h3>
              <p className="text-blue-100 text-sm">デバイス修理の経験豊富な認定プロフェッショナル。</p>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-6 border border-white border-opacity-20">
              <div className="flex items-center justify-center w-12 h-12 bg-white bg-opacity-20 rounded-full mb-4">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-white font-bold text-lg mb-2">迅速対応</h3>
              <p className="text-blue-100 text-sm">ほとんどの修理は24時間以内に完了します。</p>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-6 border border-white border-opacity-20">
              <div className="flex items-center justify-center w-12 h-12 bg-white bg-opacity-20 rounded-full mb-4">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.433 7.418c.155.03.31.06.463.092.146.03.282.07.407.12.125.05.246.119.358.203.112.084.22.194.322.328.1.134.186.28.256.428.07.148.123.3.158.454.035.154.053.311.053.471v.05c0 .52-.211 .986-.558 1.33-.347.344-.825.516-1.338.516-.512 0-.99-.172-1.337-.516-.347-.344-.558-.81-.558-1.33v-.05c0-.16.018-.317.053-.471.035-.154.088-.306.158-.454.07-.148.156-.294.256-.428.102-.134.21-.244.322-.328.112-.084.233-.153.358-.203.125-.05.261-.09.407-.12.153-.032.308-.062.463-.092m2.122 6.856c.04.139.09.276.151.406.079.139.159.267.251.38.092.112.2.212.323.297.122.086.257.157.404.213.146.057.304.099.471.126.167.028.337.041.506.041.17 0 .34-.013.507-.041.166-.027.324-.069.471-.126.147-.056.282-.127.404-.213.123-.085.231-.185.323-.297.092-.113.172-.241.251-.38.06-.13.11-.267.15-.406m.722-7.56c-.09-.294-.296-.533-.597-.652v-.037c0-.35-.279-.629-.629-.629h-.038c-.35 0-.629.279-.629.629v.037c-.301.119-.507.358-.597.652-.182.573-.027 1.18.505 1.553.532.373 1.275.373 1.807 0 .532-.373.687-.98.505-1.553m1.18 5.866c.143.202.286.404.43.605.143.202.287.404.43.605.071.1.143.198.215.295.142.195.285.389.427.583.142.194.284.388.427.581.07.096.142.191.214.285.142.19.285.38.427.57.142.19.284.38.427.569.143.19.286.378.43.566.142.186.285.372.427.556.143.186.286.37.43.553.142.181.285.361.427.539.144.18.287.36.431.54.142.177.285.354.427.531.144.177.288.354.432.531.143.176.286.35.428.525.144.176.288.351.433.527.143.175.286.349.428.523.144.175.289.35.434.525.143.174.286.348.429.522.145.175.29.35.435.526.143.173.286.346.429.52.146.176.292.352.438.528.142.171.285.342.427.513.147.178.294.356.441.534.142.169.284.338.426.507.148.18.296.36.444.541.142.168.284.336.426.505.148.181.297.362.446.543.141.166.282.332.423.499.15.183.3.367.451.551.14.164.28.328.42.493.152.186.304.372.457.558.139.162.278.324.418.487.154.189.308.378.463.568.138.16.276.32.415.481.155.191.31.382.466.574.138.158.276.317.415.476.156.193.312.387.469.581.137.157.275.314.414.472.158.196.316.392.475.589.136.155.273.311.411.467.16.199.32.398.481.597.135.153.271.307.408.461.162.202.325.405.489.608.134.151.268.303.403.455.164.206.328.412.493.619.133.148.266.297.399.446.166.209.333.419.501.628.131.145.262.291.393.436.169.213.338.426.508.639.129.142.259.285.389.427.172.217.344.433.517.65.127.138.254.277.382.415.176.224.352.449.529.673.124.133.248.267.373.4.181.231.362.462.544.693.121.128.242.256.363.384.186.24.372.481.559.721.117.122.234.244.351.366.192.25.384.5.577.75.113.115.227.231.34.346.2.261.4.523.601.784.108.109.217.218.325.327.21.278.42.557.631.835.101.099.203.199.304.298.227.3.454.601.682.902.094.087.188.174.282.262.251.328.502.657.754.986.083.075.166.15.25.225.278.363.556.727.835 1.091.067.057.133.114.2.171" />
                </svg>
              </div>
              <h3 className="text-white font-bold text-lg mb-2">品質保証</h3>
              <p className="text-blue-100 text-sm">すべての修理と部品に1年間の保証付き。</p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="btn-primary bg-white text-blue-600 hover:bg-gray-100">
              見積もりを取得
            </button>
            <button className="btn-secondary border-2 border-white text-white hover:bg-white hover:text-blue-600">
              店舗を探す
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
