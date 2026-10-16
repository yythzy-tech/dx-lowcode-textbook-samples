(() => {
  'use strict';

  // 🟥 住所が未入力なら、保存前にエラーを表示して保存を止める
  kintone.events.on([
    'app.record.create.submit',
    'app.record.edit.submit',
  ], (event) => {
    if (!event.record['address'].value) {
      event.record['address'].error =
        '住所を入力してください（QRコードの生成に必要です）';
    }
    return event;
  });

  kintone.events.on(
    'app.record.create.submit.success', async (event) => {
    // 🟩 alert() を削除し、SweetAlert2だけを表示する
    await Swal.fire({
      title: "作成成功",
      text: "QRコードを作成しました",
      icon: "success"
    });
    return event;
  });

  // QRコード生成（詳細表示時）
  kintone.events.on('app.record.detail.show', (event) => {
    const el = kintone.app.record.getSpaceElement('qr_space');
    if (!el) return event;

    const address = event.record['address'].value;
    if (!address) return event;

    const mapUrl = `https://www.google.com/maps/search/?api=1&query=`
      + encodeURIComponent(address);

    if (window.QRCode) {
      new QRCode(el, { text: mapUrl, width: 128, height: 128 });
    }
    return event;
  });
})();
