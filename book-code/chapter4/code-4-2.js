// kintoneのカスタマイズは、即時実行関数 (() => {})(); で世界を保護する
(() => {
  'use strict'; // 厳格モードON
 
  /**
   * このカスタマイズ処理は、
   *  ・レコード作成画面で保存ボタンが押された時(app.record.create.submit)
   *  ・レコード編集画面で保存ボタンが押された時(app.record.edit.submit)
   * に呼び出される。
   */
  kintone.events.on([
    'app.record.create.submit',
    'app.record.edit.submit'
  ], (event) => {
    // 操作されている1件のレコードを取得
    const record = event.record;
 
    // 合計金額フィールドから文字列を取得して値に変換
    const total = Number(record['total_amount'].value) || 0;
 
    // 値引きフィールドから文字列を取得して値に変換
    const discount = Number(record['discount'].value) || 0;
 
    // 値引き額が合計金額より多いならエラー表示
    if (discount > total) {
      record['discount'].error = 'エラー！';
    }
 
    return event; // eventオブジェクトを返して、画面表示を反映
  });
})();
