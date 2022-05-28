export default function useFlightRadar() {
  const scan = async (x1, y1, x2, y2) => {
    const url = `https://data-cloud.flightradar24.com/zones/fcgi/feed.js?${new URLSearchParams(
      {
        faa: 1,
        bounds: `${x1},${x2},${y1},${y2}`,
        satellite: 1,
        mlat: 1,
        flarm: 1,
        adsb: 1,
        gnd: 1,
        air: 1,
        vehicles: 0,
        estimated: 1,
        maxage: 14400,
        gliders: 1,
        stats: 1,
      }
    )}`

    const response = await fetch(
      `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`
    )
      .then((r) => r.json())
      .then((r) => JSON.parse(r.contents))

    const { full_count, stats, version, ...rest } = response
    const planes = Object.entries(rest).map((entry) => {
      const id = entry[0]
      const data = entry[1]

      return {
        id,
        icao: data[0],
        lat: data[1],
        lng: data[2],
        track: data[3],
        altitude: data[4],
        speed: data[5],
        unknow1: data[6],
        unknow2: data[7],
        type: data[8],
        registration: data[9],
        unknow3: data[10],
        from: data[11],
        to: data[12],
        code: data[13],
        unknow4: data[14],
        unknow5: data[15],
        plate: data[16],
        unknow6: data[17],
        company: data[18],
      }
    })

    return planes
  }

  return { scan }
}
