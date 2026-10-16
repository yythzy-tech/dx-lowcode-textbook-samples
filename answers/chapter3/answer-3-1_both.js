// PC・モバイル両対応：イベント名を両方に登録し、APIは画面に応じて切り替えます。
// PC用とスマートフォン用の、両方の欄に同じファイルを追加してください。
(() => {
  'use strict';

  // 🟥 画面名とイベント名を受け取り、console.log() と alert() を呼ぶ共通関数
  const notifyScreen = (name, eventType) => {
    const message = `${name}（${eventType}）`;
    console.log(message);
    alert(message);
  };

  kintone.events.on([
    'app.record.create.show',           // 追加画面を表示した時
    'mobile.app.record.create.show',
    'app.record.edit.show',             // 🟦 編集画面を表示した時を追加
    'mobile.app.record.edit.show',
    'app.record.create.change.status',  // 🟩 追加画面のステータス変更
    'mobile.app.record.create.change.status',
    'app.record.edit.change.status',    // 🟩 編集画面のステータス変更
    'mobile.app.record.edit.change.status',
  ], (event) => {
    // 🟩 event.type で、どのイベントで呼ばれたかを区別できる
    notifyScreen('レコード画面の処理が呼ばれました', event.type);
    return event;
  });
})();
