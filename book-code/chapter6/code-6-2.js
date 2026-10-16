(() => {
  'use strict';
 
  // 「点検実施日」を入力したら、自動で「1ヶ月後の翌営業日」を算出する
  kintone.events.on([
    'app.record.create.change.check_date',
    'app.record.edit.change.check_date',
  ], async (event) => {
    const checkDate = event.record['check_date'].value;
    if (!checkDate) return event;
 
    try {
      // 内閣府の祝日CSVを取得
      const csvUrl =
        'https://www8.cao.go.jp/chosei/shukujitsu/syukujitsu.csv';
      const [body] = await kintone.proxy(csvUrl, 'GET', {}, {});
 
      // CSVを解析して祝日リストを作る
      const holidays = body.split('\n')
        .map(line => line.split(',')[0]);
 
      // 1ヶ月後の日付を仮決定
      let nextDate = new Date(checkDate);
      nextDate.setMonth(nextDate.getMonth() + 1);
 
      // 土日・祝日を避けるループ（営業日が見つかるまで回す）
      while (true) {
        const day = nextDate.getDay(); // 0:日, 6:土
        const dateStr = nextDate.getFullYear() + '/'
          + (nextDate.getMonth() + 1) + '/' + nextDate.getDate();
        const isHoliday = holidays.includes(dateStr);
 
        if (day === 0 || day === 6 || isHoliday) {
          // 土日祝なら1日進める
          nextDate.setDate(nextDate.getDate() + 1);
        } else {
          // 平日なら確定！
          break;
        }
      }
 
      // 結果をセット
      const record = kintone.app.record.get();
      const iso = nextDate.toISOString().split('T')[0];
      record.record['next_check'].value = iso;
      kintone.app.record.set(record);
    } catch (e) {
      console.error('祝日データの取得に失敗しました', e);
    }
 
    return event;
  });
})();
