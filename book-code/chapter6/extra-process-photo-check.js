(() => {
  'use strict';
 
  kintone.events.on('app.record.detail.process.proceed', (event) => {
    const record = event.record;
 
    // 「点検完了」に進めようとしているときだけチェックする
    if (event.nextStatus.value === '点検完了') {
      const photos = record['photo'].value;
 
      if (!photos || photos.length === 0) {
        // event.errorをセットすると、アクションの実行がキャンセルされる
        event.error = '点検完了にするには、点検写真を1枚以上添付してください。';
        return event;
      }
    }
 
    return event;
  });
})();
