// PC・モバイル両対応：イベント名を両方に登録し、APIは画面に応じて切り替えます。
// PC用とスマートフォン用の、両方の欄に同じファイルを追加してください。
(() => {
  'use strict';

  // 🟥 PC／モバイルで、APIの入り口を切り替える共通関数
  const getKintoneApp = (event) =>
    event.type.startsWith('mobile.') ? kintone.mobile.app : kintone.app;

  kintone.events.on([
    'app.record.create.change.check_date',
    'app.record.edit.change.check_date',
    'mobile.app.record.create.change.check_date',  // 🟩 モバイルを追加
    'mobile.app.record.edit.change.check_date',
  ], async (event) => {
    const kApp = getKintoneApp(event);
    const checkDate = event.record['check_date'].value;
    if (!checkDate) return event;

    try {
      const csvUrl =
        'https://www8.cao.go.jp/chosei/shukujitsu/syukujitsu.csv';
      const [body] = await kintone.proxy(csvUrl, 'GET', {}, {});
      const holidays = body.split('\n').map(line => line.split(',')[0]);

      const nextDate = new Date(checkDate);
      nextDate.setMonth(nextDate.getMonth() + 1);

      while (true) {
        const day = nextDate.getDay();
        const dateStr = nextDate.getFullYear() + '/'
          + (nextDate.getMonth() + 1) + '/' + nextDate.getDate();
        if (day === 0 || day === 6 || holidays.includes(dateStr)) {
          nextDate.setDate(nextDate.getDate() + 1);
        } else {
          break;
        }
      }

      // 🟩 get() / set() を、PC用とモバイル用で切り替える
      const record = kApp.record.get();
      record.record['next_check'].value =
        nextDate.toISOString().split('T')[0];
      kApp.record.set(record);
    } catch (e) {
      console.error('祝日データの取得に失敗しました', e);
    }
    return event;
  });
})();
