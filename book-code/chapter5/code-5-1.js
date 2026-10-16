(() => {
  'use strict';
 
  // イベントハンドラーの前に「async」をつけて、中で待機することを宣言
  kintone.events.on([
    'app.record.create.show',
    'app.record.edit.show',
  ], async (event) => {
    const record = event.record;
 
    // 在庫管理アプリのID
    const inventAppId = 9999;
 
    // kintone.api.url()で、1件のレコードを取得するURLを生成
    const url = kintone.api.url('/k/v1/record', true);
 
    // 在庫管理アプリのレコード1番を注文
    const getBody = { app : inventAppId, id : 1 }
 
    // kintone REST APIリクエストを送信し、結果が返るまで一時停止
    const getResponse = await kintone.api( url, 'GET', getBody );
 
    // GETしたデータのうち、商品名を表示
    console.log('商品名：' + getResponse.record['product_name'].value);
 
    return event;
  });
})();
