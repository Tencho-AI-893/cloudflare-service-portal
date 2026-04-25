export const revalidate = 3600 // Revalidate every hour

export async function GET() {
  // Mock store data - in production, this would come from Cloudflare D1 or KV
  const shops = [
    {
      id: 1,
      name: '梅田店',
      address: '大阪府大阪市北区梅田1-2-3',
      phone: '06-1234-5678',
      hours: '10:00 AM - 8:00 PM',
      area: 'osaka',
    },
    {
      id: 2,
      name: '新宿店',
      address: '東京都新宿区新宿1-1-1',
      phone: '03-9876-5432',
      hours: '9:00 AM - 9:00 PM',
      area: 'tokyo',
    },
    {
      id: 3,
      name: '京都店',
      address: '京都府京都市下京区下京2-5-10',
      phone: '075-2222-3333',
      hours: '10:00 AM - 7:00 PM',
      area: 'kyoto',
    },
    {
      id: 4,
      name: '名古屋店',
      address: '愛知県名古屋市中区3-4-5',
      phone: '052-1111-2222',
      hours: '10:00 AM - 8:00 PM',
      area: 'nagoya',
    },
    {
      id: 5,
      name: '福岡店',
      address: '福岡県福岡市博多区1-1-10',
      phone: '092-3333-4444',
      hours: '10:00 AM - 8:00 PM',
      area: 'fukuoka',
    },
    {
      id: 6,
      name: '札幌店',
      address: '北海道札幌市中央区2-2-2',
      phone: '011-5555-6666',
      hours: '10:00 AM - 7:00 PM',
      area: 'sapporo',
    },
  ]

  return Response.json(shops, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'max-age=3600, s-maxage=86400',
    },
  })
}
