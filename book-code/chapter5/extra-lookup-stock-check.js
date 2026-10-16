(() => {
  'use strict';
 
  kintone.events.on([
    'app.record.create.change.item_name',
    'app.record.edit.change.item_name'
  ], async (event) => {
    // テーブルの何行目が変更されたかは event.changes.row でわかる
    const changedRow = event.changes.row;
    if (!changedRow) return event;
 
    const itemNameField = changedRow.value['item_name'];
 
    // ルックアップの参照先が確定していなければ何もしない
    if (!itemNameField.confirmed || !itemNameField.recordId) {
      return event;
    }
 
    // recordIdが直接わかるので、あいまいな文字列検索が不要になった
    const inventAppId = 9999;
    const getResponse = await kintone.api(
      kintone.api.url('/k/v1/record', true),
      'GET',
      { app: inventAppId, id: itemNameField.recordId }
    );
 
    const stockCount = Number(getResponse.record['stock_count'].value) || 0;
    console.log(`現在庫：${stockCount}個`);
 
    return event;
  });
})();
