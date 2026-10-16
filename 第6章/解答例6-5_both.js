// PC・モバイル両対応：イベント名を両方に登録し、APIは画面に応じて切り替えます。
// PC用とスマートフォン用の、両方の欄に同じファイルを追加してください。
(() => {
  "use strict";
 
  /* ===== 文分割 ===== */
  function splitSentences(text) {
    return text
      .replace(/\n/g, "")
      .split(/。|！|!|？|\?/)
      .map(s => s.trim())
      .filter(s => s.length > 5);
  }
 
  /* ===== 単語ベクトル化（簡易） ===== */
  function sentenceVector(sentence) {
    const words = sentence.split(/[\s、,]+/);
    const freq = {};
    words.forEach(w => { freq[w] = (freq[w] || 0) + 1; });
    return freq;
  }
 
  /* ===== コサイン類似度 ===== */
  function cosineSimilarity(v1, v2) {
    const allWords = new Set([...Object.keys(v1), ...Object.keys(v2)]);
    let dot = 0, mag1 = 0, mag2 = 0;
    allWords.forEach(w => {
      const a = v1[w] || 0, b = v2[w] || 0;
      dot += a * b; mag1 += a * a; mag2 += b * b;
    });
    if (mag1 === 0 || mag2 === 0) return 0;
    return dot / (Math.sqrt(mag1) * Math.sqrt(mag2));
  }
 
  /* ===== TextRank計算（文同士の重要度を相互採点） ===== */
  function textrank(sentences) {
    const N = sentences.length;
    const vectors = sentences.map(sentenceVector);
    const scores = new Array(N).fill(1);
    const d = 0.85;
 
    for (let iter = 0; iter < 20; iter++) {
      const newScores = new Array(N).fill(1 - d);
      for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
          if (i === j) continue;
          const sim = cosineSimilarity(vectors[i], vectors[j]);
          if (sim > 0) newScores[i] += d * sim * scores[j];
        }
      }
      for (let i = 0; i < N; i++) scores[i] = newScores[i];
    }
    return scores;
  }
 
  /* ===== 要約生成（自力アルゴリズム版） ===== */
  function summarize(text, sentenceCount = 3) {
    const sentences = splitSentences(text);
    if (sentences.length <= sentenceCount) return sentences.join("。");
 
    const scores = textrank(sentences);
    const ranked = sentences
      .map((s, i) => ({ sentence: s, score: scores[i], index: i }))
      .sort((a, b) => b.score - a.score)
      .slice(0, sentenceCount)
      .sort((a, b) => a.index - b.index);
 
    return ranked.map(r => r.sentence).join("。") + "。";
  }
 
  /* ===== AIを使用した要約の生成（kintone AI） ===== */
  async function summarizeAI(text) {
    // APIキーは不要。kintoneの生成AI用API（検討中のAPI）を呼び出す
    const { textStream } = await kintone.ai.generateText({
      model: 'claude-4-6-sonnet-v1',
      messages: [
        {
          role: 'system',
          content: 'あなたは、会議の議事録を要約するアシスタントです。'
        },
        {
          role: 'user',
          content: `次の議事録を要約してください。
          ・要点
          ・決定事項
          ・次のアクション
          議事録:
          ${text}`
        }
      ],
      maxTokens: 1000
    });

    // 生成されたテキストは、差分ごとに届く。つなぎ合わせて、1つの文字列にする
    let summary = '';
    for await (const part of textStream) {
      summary += part;
    }
    return summary;
  }

  /* ===== 🟩 議事録の文字数に応じて、要約の文数を決める ===== */
  function decideSentenceCount(text) {
    if (text.length < 500) return 2;
    if (text.length >= 1000) return 4;
    return 3;
  }

  /* ===== kintoneイベント ===== */
  kintone.events.on([
      "app.record.create.submit",
      "mobile.app.record.create.submit",
      "app.record.edit.submit",
      "mobile.app.record.edit.submit"
  ], async (event) => {
      const record = event.record;
      const minutes = record['minutes'].value;
      if (!minutes) return event;

      // 🟩 固定の「3」ではなく、文字数に応じた文数で要約する
      const count = decideSentenceCount(minutes);
      record['summary_textrank'].value = summarize(minutes, count);

      try {
        record['summary_ai'].value = await summarizeAI(minutes);
      } catch (error) {
        console.log(error);
        // 🟥 AI要約が失敗しても、利用者が状況を把握できるようにする
        record['summary_ai'].value =
          'AI要約は生成できませんでした'
          + '（TextRank要約をご確認ください）';
      }

      return event;
    }
  );
})();
