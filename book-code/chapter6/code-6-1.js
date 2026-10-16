(() => {
  'use strict';
 
  // 住所検索API連携
  kintone.events.on([
    'app.record.create.change.zip_code',
    'app.record.edit.change.zip_code',
  ], async (event) => {
    // 郵便番号フィールドから、入力されている文字列を取得
    const zip = event.record['zip_code'].value;
 
    // 数字が7桁でなければ郵便番号ではないと判断して即終了
    if (zip?.length !== 7) return event;
 
    // 郵便番号検索APIに7桁の数字を渡して、該当する住所を取得する
    // 参考：https://zipcloud.ibsnet.co.jp/doc/api
    const [body] = await kintone.proxy(
      `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zip}`,
      'GET', {}, {});
 
    // 返ってきた文字列をJSONのオブジェクトとして操作するため、
    // JSON.parse()静的メソッドを使って解析する
    const response = JSON.parse(body);
 
    // レスポンスのresultsフィールドに値が入っていれば、
    // 住所が格納されているので処理していく
    if (response.results) {
      // resultsフィールドは配列になっているので、1件目を取得
      const res = response.results[0];
 
      // set()を使って強制的に画面に情報を反映させたい。
      // set()を使いたいので、対になるget()を用いてレコード情報を取得している。
      const record = kintone.app.record.get();
 
      // APIの結果から住所の文字列を作り上げて、住所フィールドにセット
      const full = res.address1 + res.address2 + res.address3;
      record.record['address'].value = full;
      kintone.app.record.set(record);
    }
    return event;
  });
})();
