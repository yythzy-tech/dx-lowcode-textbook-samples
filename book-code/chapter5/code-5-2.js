(() => {
  'use strict';
 
  kintone.events.on([
    'app.record.create.submit',
    'app.record.edit.submit',
  ], async (event) => {
    const record = event.record;
    const inventAppId = 9999;
 
    const url = kintone.api.url('/k/v1/records', true);
 
    // 見積アプリの明細リストから、商品名フィールドの値を取得
    // （今回は簡略化のため、1行目のデータだけを取得します）
    const tableRecords = record['item_list'].value;
    const firstItem = tableRecords[0].value;
    const itemName = firstItem['item_name'].value;
 
    // 商品名に合致するレコードに限定して取得
    const getBody = {
      app : inventAppId,
      query: `product_name = "${itemName}"`
    }
 
    const getResponse = await kintone.api( url, 'GET', getBody );
 
    // 複数形（records）で返るため、[0]で1件目を指定してアクセス
    console.log('商品名：' + getResponse.records[0]['product_name'].value);
 
    return event;
  });
})();
