// kintoneのカスタマイズは、即時実行関数 (() => {})(); で世界を保護する
(() => {
  'use strict'; // 厳格モードON
 
  /**
   * このカスタマイズ処理は、
   *  ・レコード作成画面が表示された時(app.record.create.show)
   *  ・レコード編集画面が表示された時(app.record.edit.show)
   *  ・レコード作成画面でstatusフィールドが変更された時
   *  ・レコード編集画面でstatusフィールドが変更された時
   * に呼び出される。
   */
  kintone.events.on([
    'app.record.create.show',
    'app.record.edit.show',
    'app.record.create.change.status',
    'app.record.edit.change.status'
  ], (event) => {
    // 引数で渡されたオブジェクトから、操作されている1件のレコードを取得
    const record = event.record;
 
    // フィールドコードstatusに記述されている値を取得
    const status = record['status'].value;
 
    // もしstatusが「作成中」でない場合...
    if (status !== '作成中') {
      // フィールドコードquote_date(=>見積日)の編集を不可にする
      record['quote_date'].disabled = true;
    }
 
    if (status === '失注') {
      // もしstatusが「失注」の場合
      kintone.app.record.setFieldShown('reason', true);
    } else {
      // もしstatusが「失注」でない場合
      kintone.app.record.setFieldShown('reason', false);
    }
 
    return event; // eventオブジェクトを返して、画面表示を反映
  });
})();
