(() => {
  'use strict';
 
  kintone.events.on([
    'app.record.create.submit',
    'app.record.edit.submit'
  ], async (event) => {
    const record = event.record;
    const inventAppId = 9999;
 
    // try〜catch => PUTでエラーしたときになんとかするためのおまじない
    try {
      const tableRecords = record['item_list'].value;
      const firstItem = tableRecords[0].value;
      const itemName = firstItem['item_name'].value;
      const orderQty = Number(firstItem['quantity'].value) || 0;
 
      const getBody = {
        app : inventAppId,
        query: `product_name = "${itemName}"`
      }
      const getResponse = await kintone.api(
        kintone.api.url('/k/v1/records', true), 'GET', getBody );
 
      // GETした情報から、該当する商品の情報を取り出す
      const productCode = getResponse.records[0]['product_code'].value;
      const stock = getResponse.records[0]['stock_count'].value;
      const stockCount = Number(stock) || 0;
 
      // 在庫数から注文数を引いた値で情報を更新する
      const newStock = stockCount - orderQty;
 
      const putBody = {
        app: inventAppId,
        updateKey: { field: 'product_code', value: productCode },
        record: { 'stock_count': { value: newStock } }
      };
 
      // kintone REST APIを使って、1件のデータをPUT(更新)
      await kintone.api(
        kintone.api.url('/k/v1/record', true), 'PUT', putBody);
 
      alert('在庫の更新に成功しました！');
      return event;
 
    } catch (error) {
      console.error(error);
      event.error = '在庫更新に失敗しました。システム管理者に連絡してください。\n'
        + error.message;
      return event;
    }
  });
})();
