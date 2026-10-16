// モバイル用：イベント名とAPIを、モバイル用に置き換えています。
// 「JavaScript / CSSでカスタマイズ」画面の、「スマートフォン用のJavaScript / CSSファイル」の欄に追加してください。
(() => {
  'use strict';

  kintone.events.on('mobile.app.record.detail.process.proceed', (event) => {
    const record = event.record;

    // 点検完了にするには、写真が必須
    if (event.nextStatus.value === '点検完了') {
      const photos = record['photo'].value;
      if (!photos || photos.length === 0) {
        event.error =
          '点検完了にするには、点検写真を1枚以上添付してください。';
        return event;
      }
    }

    // 🟥 「要対応」から「点検中」へ戻すとき、
    //    対応内容が空欄ならアクションを取り消す
    const reopening = event.status.value === '要対応'
      && event.nextStatus.value === '点検中';
    if (reopening) {
      const note = record['action_note'].value;
      if (!note) {
        event.error =
          '点検を再開するには、「対応内容」を入力してください。';
        return event;
      }
    }

    return event;
  });
})();
