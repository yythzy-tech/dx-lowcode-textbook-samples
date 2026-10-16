(() => {
  'use strict';

  kintone.events.on([
    'app.record.create.change.zip_code',
    'app.record.edit.change.zip_code',
  ], async (event) => {
    const zip = event.record['zip_code'].value;
    if (zip?.length !== 7) return event;

    // 🟥 通信そのものに失敗する場合に備えて、try〜catchで囲む
    try {
      const [body, status] = await kintone.proxy(
        `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zip}`,
        'GET', {}, {});

      // 🟥 HTTPのステータスが200でなければ、失敗として扱う
      if (status !== 200) throw new Error(`HTTP ${status}`);

      const response = JSON.parse(body);
      const record = kintone.app.record.get();

      if (response.results) {
        const res = response.results[0];
        const full = res.address1 + res.address2 + res.address3;
        record.record['address'].value = full;
      } else {
        // 🟩 該当する住所が見つからなかった場合
        record.record['address'].value =
          '該当する住所が見つかりませんでした';
      }
      kintone.app.record.set(record);
    } catch (error) {
      // 🟥 開発者向けには console.error()、利用者向けには alert() で知らせる
      console.error('郵便番号検索に失敗しました', error);
      alert('住所の検索に失敗しました。'
        + '時間をおいて、もう一度お試しください。');
    }
    return event;
  });
})();
