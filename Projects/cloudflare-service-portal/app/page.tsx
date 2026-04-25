export default function Home() {
  return (
    <main style={{
      background: "#0b0f2a",
      color: "white",
      minHeight: "100vh",
      fontFamily: "sans-serif"
    }}>

      {/* ヘッダー */}
      <header style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "20px 40px",
        borderBottom: "1px solid #222"
      }}>
        <h2>TENCHO AI</h2>
        <div>
          <a href="#service" style={{marginRight: 20}}>サービス</a>
          <a href="#flow" style={{marginRight: 20}}>導入</a>
          <a href="#contact">お問い合わせ</a>
        </div>
      </header>

      {/* ヒーロー */}
      <section style={{
        padding: "80px 40px",
        textAlign: "center"
      }}>
        <h1 style={{fontSize: "40px", marginBottom: "20px"}}>
          AIで業務を自動化する
        </h1>
        <p style={{opacity: 0.7}}>
          集客・接客・管理をすべてAI化
        </p>
        <button style={{
          marginTop: "30px",
          padding: "15px 30px",
          background: "#ff4da6",
          border: "none",
          color: "white",
          borderRadius: "10px",
          cursor: "pointer"
        }}>
          無料相談する
        </button>
      </section>

      {/* サービス */}
      <section id="service" style={{padding: "60px 40px"}}>
        <h2>サービス</h2>
        <div style={{display: "flex", gap: "20px", marginTop: "20px"}}>
          <div style={{flex: 1, background:"#111", padding:"20px"}}>
            AIチャット
          </div>
          <div style={{flex: 1, background:"#111", padding:"20px"}}>
            自動予約
          </div>
          <div style={{flex: 1, background:"#111", padding:"20px"}}>
            データ分析
          </div>
        </div>
      </section>

      {/* 導入フロー */}
      <section id="flow" style={{padding: "60px 40px"}}>
        <h2>導入フロー</h2>
        <ol style={{marginTop: "20px"}}>
          <li>無料相談</li>
          <li>設計</li>
          <li>導入</li>
          <li>運用開始</li>
        </ol>
      </section>

      {/* お問い合わせ */}
      <section id="contact" style={{padding: "60px 40px"}}>
        <h2>お問い合わせ</h2>
        <button style={{
          marginTop: "20px",
          padding: "15px 30px",
          background: "#00c3ff",
          border: "none",
          color: "white",
          borderRadius: "10px"
        }}>
          今すぐ連絡
        </button>
      </section>

    </main>
  );
}