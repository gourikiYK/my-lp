(function () {
  'use strict';

  const style = document.createElement('style');
  style.textContent = `
    #gc-fab {
      position: fixed; bottom: 28px; right: 28px;
      width: 60px; height: 60px; background: #002B5B;
      border-radius: 50%; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 16px rgba(0,0,0,0.3);
      z-index: 99990; border: none; transition: transform .2s;
    }
    #gc-fab:hover { transform: scale(1.08); }
    #gc-fab svg { width: 28px; height: 28px; fill: #fff; }
    #gc-badge {
      position: absolute; top: 0; right: 0;
      width: 18px; height: 18px; background: #E67E22;
      border-radius: 50%; display: flex; align-items: center;
      justify-content: center; font-size: 10px; color: #fff; font-weight: 700;
      font-family: 'Noto Sans JP', sans-serif;
    }
    #gc-win {
      position: fixed; bottom: 100px; right: 28px;
      width: 340px; height: 500px; background: #fff;
      border-radius: 16px; box-shadow: 0 8px 32px rgba(0,0,0,0.2);
      display: flex; flex-direction: column; overflow: hidden;
      z-index: 99989; transform: scale(0); transform-origin: bottom right;
      transition: transform .2s, opacity .2s; opacity: 0;
    }
    #gc-win.open { transform: scale(1); opacity: 1; }
    #gc-header {
      background: #002B5B; padding: 14px 16px;
      display: flex; align-items: center; gap: 10px; flex-shrink: 0;
      border-bottom: 3px solid #E67E22;
    }
    .gc-h-icon {
      width: 36px; height: 36px; background: #E67E22;
      border-radius: 50%; display: flex; align-items: center;
      justify-content: center; flex-shrink: 0;
    }
    .gc-h-icon svg { width: 18px; height: 18px; fill: #fff; }
    .gc-h-text h3 { color: #fff; font-size: 14px; font-weight: 700; margin: 0; font-family: 'Noto Sans JP', sans-serif; }
    .gc-h-text p { color: rgba(255,255,255,0.55); font-size: 11px; margin: 2px 0 0; font-family: 'Noto Sans JP', sans-serif; }
    #gc-close {
      margin-left: auto; background: none; border: none;
      color: rgba(255,255,255,0.5); cursor: pointer; font-size: 22px; line-height: 1; padding: 4px;
    }
    #gc-msgs {
      flex: 1; overflow-y: auto; padding: 16px;
      display: flex; flex-direction: column; gap: 12px; background: #f5f7fa;
    }
    .gc-msg { display: flex; gap: 8px; }
    .gc-msg.user { flex-direction: row-reverse; }
    .gc-avatar {
      width: 28px; height: 28px; background: #002B5B;
      border-radius: 50%; display: flex; align-items: center;
      justify-content: center; flex-shrink: 0;
    }
    .gc-avatar svg { width: 14px; height: 14px; fill: #fff; }
    .gc-bubble {
      padding: 10px 12px; border-radius: 12px;
      font-size: 13px; line-height: 1.6; max-width: 240px;
      font-family: 'Noto Sans JP', sans-serif;
    }
    .gc-msg.bot .gc-bubble {
      background: #fff; border: 1px solid #e8e8e8; color: #222;
      border-radius: 4px 12px 12px 12px;
    }
    .gc-msg.user .gc-bubble {
      background: #002B5B; color: #fff;
      border-radius: 12px 4px 12px 12px;
    }
    .gc-qr { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 6px; }
    .gc-qr-btn {
      background: #fff; border: 1px solid #002B5B; border-radius: 20px;
      padding: 5px 12px; font-size: 12px; color: #002B5B;
      cursor: pointer; transition: all .15s;
      font-family: 'Noto Sans JP', sans-serif;
    }
    .gc-qr-btn:hover { background: #002B5B; color: #fff; }
    .gc-typing {
      display: flex; gap: 4px; padding: 10px 12px;
      background: #fff; border: 1px solid #e8e8e8;
      border-radius: 4px 12px 12px 12px; width: fit-content;
    }
    .gc-typing span {
      width: 6px; height: 6px; background: #bbb;
      border-radius: 50%; animation: gc-bounce 1.2s infinite;
    }
    .gc-typing span:nth-child(2) { animation-delay: .2s; }
    .gc-typing span:nth-child(3) { animation-delay: .4s; }
    @keyframes gc-bounce {
      0%,60%,100% { transform: translateY(0); }
      30% { transform: translateY(-6px); }
    }
    #gc-input-area {
      padding: 12px; border-top: 1px solid #eee;
      display: flex; gap: 8px; background: #fff; flex-shrink: 0;
    }
    #gc-input {
      flex: 1; border: 1px solid #ddd; border-radius: 20px;
      padding: 8px 14px; font-size: 13px; outline: none;
      font-family: 'Noto Sans JP', sans-serif;
    }
    #gc-input:focus { border-color: #002B5B; }
    #gc-send {
      width: 36px; height: 36px; background: #E67E22; border: none;
      border-radius: 50%; cursor: pointer; display: flex;
      align-items: center; justify-content: center; flex-shrink: 0;
      transition: background .15s;
    }
    #gc-send:hover { background: #cf6d17; }
    #gc-send svg { width: 16px; height: 16px; fill: #fff; }
  `;
  document.head.appendChild(style);

  document.body.insertAdjacentHTML('beforeend', `
    <button id="gc-fab" aria-label="AIチャット相談">
      <svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>
      <div id="gc-badge">1</div>
    </button>
    <div id="gc-win" role="dialog" aria-label="GOURIKI相談チャット">
      <div id="gc-header">
        <div class="gc-h-icon">
          <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/></svg>
        </div>
        <div class="gc-h-text">
          <h3>GOURIKI 相談チャット</h3>
          <p>お気軽にご相談ください</p>
        </div>
        <button id="gc-close" aria-label="閉じる">×</button>
      </div>
      <div id="gc-msgs"></div>
      <div id="gc-input-area">
        <input type="text" id="gc-input" placeholder="メッセージを入力...">
        <button id="gc-send" aria-label="送信">
          <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
        </button>
      </div>
    </div>
  `);

  const fab   = document.getElementById('gc-fab');
  const win   = document.getElementById('gc-win');
  const close = document.getElementById('gc-close');
  const msgs  = document.getElementById('gc-msgs');
  const inp   = document.getElementById('gc-input');
  const send  = document.getElementById('gc-send');
  const badge = document.getElementById('gc-badge');
  let initialized = false;

  const qa = [
    { k:['費用','コスト','いくら','金額','料金','価格','見積'], a:'平面化工事の費用は規模によって異なります。\n\n【概算目安】\n・スマートデッキ：数百万〜数千万円\n・機械式を20年維持：1億円超の可能性\n\n長期でみると機械式入替の約1/5のコストになる試算もあります。見積・現地調査は無料です！\nTEL: 03-3877-0993' },
    { k:['期間','工期','日数','どのくらい','いつ'], a:'工事期間は規模により1週間〜1カ月程度です。スマートデッキは埋め戻し工法より短工期が特長です。\n自社工場で一貫製造しているため納期も確実。詳細は現地調査後にご案内します。' },
    { k:['決議','総会','特別決議','合意','区分所有'], a:'機械式駐車場の撤去は「共用部分の変更」に該当するため、区分所有者・議決権の各4分の3以上の賛成による特別決議が基本です。\n管理規約の内容によっては普通決議の場合も。\nGOURIKIではわかりやすい提案書で合意形成をサポートします！' },
    { k:['説明会','住民','反対','同意'], a:'住民説明会は法的義務ではありませんが、総会決議をスムーズに進めるために非常に有効です。\nGOURIKIでは住民説明会向けの資料作成もサポートします。' },
    { k:['ev','EV','電気自動車','充電','イーブイ'], a:'スマートデッキへの平面化後、EV充電設備の設置が容易になります。\n「EV充電できるマンション」は入居者満足度・資産価値の向上に直結します。土木・EV充電・外構工事も合わせてご相談ください。' },
    { k:['附置義務','付置義務','条例','台数','削減できる'], a:'駐車場附置義務とは一定規模以上の建物に条例で必要台数の設置を義務づけた制度です。\n義務がある場合、削減できる台数に制限があります。無料の現地調査で確認しますのでお気軽にご連絡ください。\nTEL: 03-3877-0993' },
    { k:['調査','診断','申込','相談','連絡','問い合わせ'], a:'現地調査・診断・見積りは完全無料です！\n\n【お問い合わせ先】\n・TEL（一般）: 03-3877-0993\n・TEL（解体専用）: 03-6663-8777\n・フォーム: gouriki.co.jp/contact' },
    { k:['スマートデッキ','smart deck','smartdeck','製品','どんな'], a:'スマートデッキはGOURIKIが独自開発・特許取得した鋼製平面化システムです。\n\n【特長】\n・日本製鉄製スマートビーム®＋ZEXEED®使用\n・溶融亜鉛めっきの10倍の耐食性能\n・メンテナンスフリー\n・震度6強まで対応\n・竣工2年後に無償点検あり\n・千葉工場で一貫製造' },
    { k:['地震','耐震','震度','安全'], a:'スマートデッキは構造計算のもと震度6強まで対応しています。\n可動部分がない平面構造なので、機械式のような挟まれ事故・パレット落下リスクもなく安全性が大幅に向上します。' },
    { k:['メンテナンス','維持費','点検','修繕','保守'], a:'平面化後のスマートデッキはメンテナンスフリーです。\n機械式の年間保守点検費・電気代（100〜200万円）がほぼゼロに。竣工2年後の無償点検も含まれています。' },
    { k:['老朽化','故障','部品','廃番','壊れ','動かない','出庫'], a:'設置から20年を過ぎると主要部品が廃番（供給終了）になります。重大故障が起きると全取替（5,000万〜1億円超）しか選択肢がなくなります。\n今すぐ動かないなどのお急ぎの相談も承ります。\nTEL（解体専用）: 03-6663-8777' },
    { k:['空き','空き区画','稼働率','利用率','空室'], a:'都心部では機械式駐車場の20〜40%が空き区画になるケースが常態化しています。\n平面化で大型SUV・ハイルーフ車も入庫可能になるため、外部に借りていた住民が戻り利用率が劇的に改善します。' },
    { k:['高さ','SUV','ミニバン','入らない','ハイルーフ','制限'], a:'機械式駐車場の多くは高さ制限1,550mm程度で設計されており、近年主流の車高1,600mm超のSUVやミニバンは入庫不可です。\nスマートデッキへの平面化後は高さ制限なし・重量2,500kg（3,000kg仕様あり）まで対応。ほぼすべての車種が駐車可能になります。' },
    { k:['埋め戻し','比較','違い','どちら','工法'], a:'【鋼製平面化（スマートデッキ）】\n・工期：短い\n・屋内・軟弱地盤も可\n・地盤沈下リスク：なし\n・復元：容易\n・保全コスト：ゼロ\n\n【埋め戻し】\n・費用：比較的安価\n・地盤沈下・陥没リスクあり\n・軟弱地盤・屋内は原則困難\n・復元困難\n\n長期的安全性を考えると鋼製平面化が有利なケースが多いです。' },
    { k:['事例','実績','施工例','どこ','他のマンション'], a:'GOURIKIは全国4,453基・662案件の施工実績があります（2026年2月現在）。\n\n関東：3,612基（564案件）\n西日本：668基（80案件）\n九州：49基（6案件）など\n\n詳細: gouriki.co.jp/case' },
    { k:['会社','gouriki','ゴウリキ','創業','歴史','どんな会社'], a:'株式会社GOURIKIコーポレーションは1995年創業・駐車場事業一筋30年の専門会社です。\n\n本社：東京都江戸川区南葛西6-13-14\n工場：千葉県習志野市東習志野7-1-1\n代表：山﨑 剛\nTEL: 03-3877-0993' },
    { k:['AIパーキング','ai parking','コイン駐車場','キャッシュレス','DX'], a:'AI PARKINGはGOURIKIのコイン駐車場DX化サービスです。\nIoT・AI・オンライン決済を活用したスマートな有料駐車場システムです。\n詳細: gouriki.co.jp/ai-parking' },
    { k:['スマートボックス','smart box','収納','倉庫','備蓄'], a:'スマートBOXは特許取得済みの収納ユニットです（特許第7223962号）。\n平面化後の空きスペースにスペアタイヤ・アウトドア用品の収納や防災備蓄倉庫として活用できます。' },
    { k:['工場','見学','製造','千葉'], a:'千葉県習志野市の自社工場でスマートデッキの工場見学を開催しています！実際に製品に触れることもできます。\nお問い合わせはTEL: 03-3877-0993まで。' },
    { k:['大規模修繕','修繕計画','積立金','修繕積立'], a:'機械式駐車場の更新費用（5,000万〜1億円超）は大規模修繕の予算を飲み込むほどの金額です。\n早期に平面化することで浮いた予算を外壁塗装・配管更新などの本来の修繕に回せます。' },
    { k:['資料','ガイド','ダウンロード','パンフ','カタログ'], a:'「機械式駐車場 解体・平面化 完全ガイドブック」を無料ダウンロードできます。\n工法比較・費用目安・合意形成のポイントを詳しく解説しています。\n→ gouriki.co.jp/handbook' },
  ];

  const initMsgs = [
    { role:'bot', text:'こんにちは！GOURIKIの駐車場相談AIです。\n機械式駐車場に関するお悩みをお気軽にどうぞ。', qr:['費用を知りたい','スマートデッキって何？','工事期間は？','無料調査を申込む'] }
  ];

  function addMsg(role, text, qr) {
    const div = document.createElement('div');
    div.className = 'gc-msg ' + role;
    const av = `<div class="gc-avatar"><svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg></div>`;
    const bbl = `<div class="gc-bubble">${text.replace(/\n/g,'<br>')}</div>`;
    const qrHtml = qr ? `<div class="gc-qr">${qr.map(q=>`<button class="gc-qr-btn" data-q="${q}">${q}</button>`).join('')}</div>` : '';
    div.innerHTML = role === 'bot' ? `${av}<div>${bbl}${qrHtml}</div>` : bbl;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
    div.querySelectorAll('.gc-qr-btn').forEach(b => b.addEventListener('click', () => handleInput(b.dataset.q)));
  }

  function showTyping() {
    const div = document.createElement('div');
    div.className = 'gc-msg bot'; div.id = 'gc-typing';
    div.innerHTML = `<div class="gc-avatar"><svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg></div><div class="gc-typing"><span></span><span></span><span></span></div>`;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function removeTyping() {
    const t = document.getElementById('gc-typing');
    if (t) t.remove();
  }

  function getAnswer(text) {
    const t = text.toLowerCase();
    for (const item of qa) {
      if (item.k.some(k => t.includes(k.toLowerCase()))) return item.a;
    }
    return 'ご質問ありがとうございます！\n詳しくは専門スタッフがご説明いたします。\n\n【お問い合わせ先】\n・TEL（一般）: 03-3877-0993\n・TEL（解体専用）: 03-6663-8777\n・フォーム: gouriki.co.jp/contact';
  }

  function handleInput(text) {
    if (!text.trim()) return;
    addMsg('user', text);
    inp.value = '';
    showTyping();
    setTimeout(() => { removeTyping(); addMsg('bot', getAnswer(text)); }, 800);
  }

  fab.addEventListener('click', () => {
    win.classList.toggle('open');
    badge.style.display = 'none';
    if (!initialized) {
      initialized = true;
      initMsgs.forEach(m => addMsg(m.role, m.text, m.qr));
    }
  });
  close.addEventListener('click', () => win.classList.remove('open'));
  send.addEventListener('click', () => handleInput(inp.value));
  inp.addEventListener('keydown', e => { if (e.key === 'Enter') handleInput(inp.value); });
})();