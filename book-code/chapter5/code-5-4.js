(() => {
  'use strict';
 
  kintone.events.on([
    'app.record.create.submit',
    'app.record.edit.submit'
  ], async (event) => {
    const record = event.record;
    const status = record['status'].value;
 
    // （UXの向上）ステータスが「受注」の時だけ在庫を更新する
    if (status !== '受注') {
      return event;
    }
 
    // （UXの向上）ユーザーに確認を促す
    const confirmResult = window.confirm('受注として保存し、在庫を引き落としますか？');
    if (!confirmResult) {
      return false; // 保存をキャンセル
    }
 
    const inventAppId = 9999;
 
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
 
      // （UXの向上）商品が見つからなかった時のエラー処理
      if (getResponse.records.length === 0) {
        throw new Error('商品がマスタに登録されていません。');
      }
 
      const productName = getResponse.records[0]['product_name'].value;
      const productCode = getResponse.records[0]['product_code'].value;
      const stock = getResponse.records[0]['stock_count'].value;
      const stockCount = Number(stock) || 0;
      const minStockRaw = getResponse.records[0]['min_stock'].value;
      const minStock = Number(minStockRaw) || 0;
 
      // ★該当レコードのリビジョン番号を取得
      const currentRevision = getResponse.records[0].$revision.value;
 
      const newStock = stockCount - orderQty;
 
      // （UXの向上）在庫が不足するならエラーを表示
      if (newStock < 0) {
        firstItem['quantity'].error = '在庫が足りません。残り' + stockCount;
        return event;
      }
 
      const putBody = {
        app: inventAppId,
        updateKey: { field: 'product_code', value: productCode },
        record: { 'stock_count': { value: newStock } },
        revision: currentRevision // ★取得時のリビジョンをセット
      };
 
      await kintone.api(
        kintone.api.url('/k/v1/record', true), 'PUT', putBody);
      alert('在庫の更新に成功しました！');
 
      // （UXの向上）在庫が少なくなってきたら発注を促す
      if (newStock < minStock) {
        alert(`「${productName}(商品コード${productCode})」`
          + 'の在庫が少なくなってきました。\n'
          + '在庫の発注をしてください。');
      }
 
      return event;
 
    } catch (error) {
      console.error(error);
      event.error = '在庫更新に失敗しました。システム管理者に連絡してください。\n'
        + error.message;
      return event;
    }
  });
})();
