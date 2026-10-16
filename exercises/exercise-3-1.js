(() => {
  'use strict';
 
  kintone.events.on([
    'app.record.create.show'
  ], (event) => {
    // カスタマイズ処理をここに書いていく
    console.log("");
    alert("");
 
    return event;
  });
})();
