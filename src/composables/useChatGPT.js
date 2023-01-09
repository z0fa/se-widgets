export default function useChatGPT(openaiToken, pasteeeToken, imgurToken) {
  const speak = async (message, maxTokens = 50) => {
    const response = await fetch("https://api.openai.com/v1/completions", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiToken}`,
      },
      body: JSON.stringify({
        model: "text-davinci-003",
        prompt: message,
        max_tokens: maxTokens,
        temperature: 1.0,
      }),
    }).then((r) => r.json())

    let toRet = response?.choices?.[0]?.text ?? ""

    if (toRet.length > 200) {
      const url = await fetch("https://api.paste.ee/v1/pastes", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": pasteeeToken,
        },
        body: JSON.stringify({
          sections: [{ contents: toRet }],
        }),
      })
        .then((r) => r.json())
        .then((r) => r.link)

      toRet = `La risposta è troppo lunga, l'ho caricata qui: ${url}`
    }

    return toRet
  }

  const draw = async (message) => {
    const longUrl = await fetch(
      "https://api.openai.com/v1/images/generations",
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiToken}`,
        },
        body: JSON.stringify({
          prompt: message,
          n: 1,
          size: "512x512",
        }),
      }
    )
      .then((r) => r.json())
      .then((r) => r.data[0].url)

    const formData = new FormData()
    formData.append("image", longUrl)

    const url = await fetch("https://api.imgur.com/3/image", {
      method: "post",
      headers: {
        Authorization: `Client-ID ${imgurToken}`,
      },
      body: formData,
    })
      .then((r) => r.json())
      .then((r) => r.data.link)

    return url
  }

  return {
    speak,
    draw,
  }
}
