export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="text-lg font-bold tracking-wide">TENCHO AI</div>
        <nav className="flex gap-6 text-sm text-slate-300">
          <a href="#service">サービス</a>
          <a href="#flow">導入フロー</a>
          <a href="#contact">お問い合わせ</a>
        </nav>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-24 text-center">
        <div className="mx-auto mb-6 w-fit rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200">
          AI導入・業務自動化・運用改善
        </div>

        <h1 className="mx-auto max-w-4xl text-5xl font-bold leading-tight tracking-tight md:text-7xl">
          現場の業務を、
          <span className="bg-gradient-to-r from-cyan-300 to-fuchsia-400 bg-clip-text text-transparent">
            AIで軽くする。
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
          集客、問い合わせ対応、予約導線、社内管理まで。
          小さな会社でも使えるAIサービス基盤を、最短で設計・導入します。
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <a
            href="#contact"
            className="rounded-2xl bg-white px-8 py-4 font-bold text-slate-950 shadow-xl shadow-cyan-500/20"
          >
            無料相談する
          </a>
          <a
            href="#service"
            className="rounded-2xl border border-white/20 px-8 py-4 font-bold text-white"
          >
            サービスを見る
          </a>
        </div>
      </section>

      <section id="service" className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-3xl font-bold">できること</h2>
        <p className="mt-3 text-slate-400">
          まずは売上と時間削減に直結するところからAI化します。
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            ["AIチャット", "問い合わせ対応、FAQ、初回ヒアリングを自動化。"],
            ["予約・導線設計", "LINE、フォーム、予約ページまで一気通貫で設計。"],
            ["業務ダッシュボード", "顧客情報、進捗、売上確認を見える化。"],
          ].map(([title, body]) => (
            <div
              key={title}
              className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl"
            >
              <div className="mb-5 h-12 w-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-fuchsia-500" />
              <h3 className="text-xl font-bold">{title}</h3>
              <p className="mt-4 leading-7 text-slate-300">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="flow" className="mx-auto max-w-6xl px-6 py-20">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 p-10">
          <h2 className="text-3xl font-bold">導入フロー</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {["無料相談", "業務整理", "AI設計", "運用開始"].map((step, i) => (
              <div key={step} className="rounded-2xl bg-white/5 p-6">
                <div className="text-sm text-cyan-300">STEP {i + 1}</div>
                <div className="mt-3 font-bold">{step}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-6xl px-6 py-24 text-center">
        <h2 className="text-4xl font-bold">まずは小さく、動かす。</h2>
        <p className="mt-5 text-slate-300">
          大きなシステムより、今日から使える導線を作ります。
        </p>
        <a
          href="mailto:example@example.com"
          className="mt-8 inline-block rounded-2xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-10 py-4 font-bold text-white shadow-xl"
        >
          お問い合わせする
        </a>
      </section>
    </main>
  );
}