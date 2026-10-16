// モバイル用：イベント名とAPIを、モバイル用に置き換えています。
// 「JavaScript / CSSでカスタマイズ」画面の、「スマートフォン用のJavaScript / CSSファイル」の欄に追加してください。
(() => {
  'use strict';
 
  kintone.events.on([
    'mobile.app.record.create.show',
    'mobile.app.record.edit.show',
  ], async (event) => {
    const record = event.record;
    const inventAppId = 9999;
 
    const url = kintone.api.url('/k/v1/record', true);
    console.log(url);
 
    const getBody = { app : inventAppId, id : 1 }
 
    const getResponse = await kintone.api( url, 'GET', getBody );
    console.log(getResponse);
    // 解答例5-1：🟥 商品コードと在庫数もコンソールに表示
    console.log('商品名：' + getResponse.record['product_name'].value);
    console.log('商品コード：' + getResponse.record['product_code'].value);
    console.log('在庫数：' + getResponse.record['stock_count'].value);
 
    return event;
  });
})();
