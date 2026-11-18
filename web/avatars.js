// Ten original, code-native portraits. No uploads or external image requests.
(function(root){
  const portraits=[
    {id:'a1',name:'花间长发',description:'长发 · 温柔甜美',bg:'#f1dfe8',hair:'#70525a',shirt:'#b98298',style:'long',accessory:'flower'},
    {id:'a2',name:'风中短发',description:'短发 · 清爽酷帅',bg:'#e1e8e5',hair:'#484952',shirt:'#829b92',style:'pixie',accessory:'stud'},
    {id:'a3',name:'蜜桃双丸',description:'双丸子 · 俏皮可爱',bg:'#f4e3da',hair:'#9b715f',shirt:'#d2a192',style:'buns',accessory:'ribbon'},
    {id:'a4',name:'月光波波',description:'齐短发 · 安静可爱',bg:'#e7e1ef',hair:'#514c67',shirt:'#a49abd',style:'bob',accessory:'moon'},
    {id:'a5',name:'软糖卷发',description:'短卷发 · 灵动甜美',bg:'#f3e8d9',hair:'#a17d5f',shirt:'#bba17e',style:'curly',accessory:'freckles'},
    {id:'a6',name:'晴日马尾',description:'高马尾 · 元气清爽',bg:'#e1ece6',hair:'#65504b',shirt:'#9db5a4',style:'pony',accessory:'bow'},
    {id:'a7',name:'书页眼镜',description:'长直发 · 文艺温柔',bg:'#ece5df',hair:'#655654',shirt:'#ac9e91',style:'straight',accessory:'glasses'},
    {id:'a8',name:'薄雾银发',description:'短银发 · 利落酷帅',bg:'#e1e7ed',hair:'#8c8179',shirt:'#7e8ba5',style:'swept',accessory:'hoop'},
    {id:'a9',name:'樱桃双辫',description:'双辫子 · 甜美可爱',bg:'#f3dfe2',hair:'#79544d',shirt:'#c58d9b',style:'braids',accessory:'cherry'},
    {id:'a10',name:'慵懒狼尾',description:'中短发 · 随性酷帅',bg:'#e5e2ed',hair:'#5a5263',shirt:'#93839e',style:'shag',accessory:'stud'}
  ];

  function svg(id){
    const p=portraits.find(a=>a.id===id)||portraits[0];
    const hair=p.hair,ink='#69504b',skin='#f8dfca';
    const backs={
      long:'M28 60C14 12 57 3 78 16c30 4 29 37 26 58l6 43H20z',
      pixie:'M27 65C9 44 24 13 49 13c26-13 59 8 57 35l-9 28-10-25-44 28z',
      buns:'M33 40C12 45 7 16 26 12c16-7 28 7 24 18M80 29c-2-20 23-24 31-8 7 17-9 26-23 20M26 63C14 5 111 4 103 63l-11 24H37z',
      bob:'M24 51C21 1 106 1 105 52l1 39c-20 14-63 15-83-1z',
      curly:'M22 47C7 35 20 18 34 23c-1-19 20-22 31-12 16-13 39 1 32 15 22 1 27 23 11 32 17 17 4 34-15 30H32C10 96 3 68 22 57z',
      pony:'M92 26c19-21 29-2 20 20-7 18-2 33 9 40-26 10-39-18-27-42M25 63C13 4 110 3 103 61L92 83H36z',
      straight:'M24 51C20 2 108 1 104 55v66H20z',
      swept:'M26 63C11 43 20 13 51 12c28-10 58 8 56 33L96 76 83 48 36 74z',
      braids:'M27 62C15 6 110 3 102 64L90 83H38zM29 62c-15 10-9 20-5 23-11 9-6 18 2 20l-5 17 19-1 2-18c9-8 1-17-3-19 5-11-1-19-10-22M99 62c15 10 9 20 5 23 11 9 6 18-2 20l5 17-19-1-2-18c-9-8-1-17 3-19-5-11 1-19 10-22',
      shag:'M26 51C19 9 99 0 106 43l-5 23 12 29-19-4 1 13-22-6-11 9-15-9-22 5 5-17-15 3 11-23z'
    };
    const fronts={
      long:'M27 51C15 14 57 6 77 18c18 2 27 19 25 36-16-4-25-15-29-26-6 19-25 30-46 29z',
      pixie:'M23 51C16 20 53 3 79 18l24 26-23-4-6-12c-8 21-29 30-51 23z',
      buns:'M27 52C20 12 100 10 102 53-20-2-30-15-35-24-7 14-21 23-40 25z',
      bob:'M26 46C29 9 99 10 103 47l-14 4-6-14-2 15H65l-4-14-3 14-17-1-2-12-3 12z',
      curly:'M24 48C14 33 32 21 44 29c5-20 26-16 31-3 18-8 35 10 23 24-12 6-22-1-26-13-9 19-31 22-48 11z',
      pony:'M26 50C15 16 77 2 98 34l5 17c-24-1-35-16-38-26-4 16-21 27-39 29z',
      straight:'M26 50C18 9 99 4 103 49-21-1-29-20-32-27-10 17-24 27-45 32z',
      swept:'M22 48C14 11 75-2 103 35l3 12-29-12c-12 20-35 24-55 13z',
      braids:'M27 50C20 10 99 8 102 51-17 0-29-11-36-25-8 15-22 24-39 27z',
      shag:'M23 47C16 12 75 2 99 28l8 20-20-7-5 14-15-23-8 22-11-12-16 16z'
    };
    const closed=['a5','a6','a9'].includes(p.id);
    const eyes=closed
      ? '<path d="M42 64q5-6 10 0M76 64q5-6 10 0" fill="none" stroke-width="2.3"/>'
      : '<path d="M41 60q5-4 11 0M76 60q5-4 11 0" fill="none" stroke-width="1.6"/><ellipse cx="48" cy="65" rx="2.7" ry="4" fill="'+ink+'"/><ellipse cx="81" cy="65" rx="2.7" ry="4" fill="'+ink+'"/><path d="M48 64h.2M81 64h.2" stroke="#fff8ec" stroke-width="1.8"/>';
    let detail='';
    if(p.accessory==='glasses')detail='<g fill="none" stroke="'+ink+'" stroke-width="1.7"><circle cx="48" cy="65" r="11"/><circle cx="81" cy="65" r="11"/><path d="M59 64h11M30 62l7 1M92 63l7-1"/></g>';
    if(['flower','cherry'].includes(p.accessory))detail='<g transform="translate('+(p.accessory==='flower'?'94 40':'33 92')+')"><g fill="#fff1da" stroke="#d0b396" stroke-width=".7"><ellipse cy="-5" rx="3.5" ry="5"/><ellipse cy="-5" rx="3.5" ry="5" transform="rotate(72)"/><ellipse cy="-5" rx="3.5" ry="5" transform="rotate(144)"/><ellipse cy="-5" rx="3.5" ry="5" transform="rotate(216)"/><ellipse cy="-5" rx="3.5" ry="5" transform="rotate(288)"/></g><circle r="2.5" fill="#d5ad6e"/></g>';
    if(['bow','ribbon'].includes(p.accessory))detail='<path d="m94 28-14-8 2 13 12-2 12 6 1-15z" fill="#e2c9b3" stroke="#a78473" stroke-width="1"/><path d="m93 30-5 14m7-13 5 12" fill="none" stroke="#e2c9b3" stroke-width="3"/>';
    if(p.accessory==='moon')detail='<path d="M28 31c-2-18 14-26 35-23 26-4 41 12 38 27-22-11-47-10-73-4z" fill="#bd9297" stroke="#a87d83" stroke-width="1.2"/>';
    if(p.accessory==='freckles')detail='<path d="M38 74h.2m5 2h.2m43 0h.2m5-2h.2" stroke="#bd8f77" stroke-width="2"/>';
    if(['stud','hoop'].includes(p.accessory))detail='<circle cx="99" cy="76" r="'+(p.accessory==='hoop'?'4':'2.2')+'" fill="'+(p.accessory==='hoop'?'none':'#ddbb82')+'" stroke="#ddbb82" stroke-width="1.5"/>';
    return `<svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs><clipPath id="portrait-${p.id}"><circle cx="64" cy="64" r="63"/></clipPath></defs>
      <g clip-path="url(#portrait-${p.id})">
        <circle cx="64" cy="64" r="63" fill="${p.bg}"/>
        <path d="${backs[p.style]}" fill="${hair}" stroke="${ink}" stroke-width="1.2" stroke-linejoin="round"/>
        <path d="M15 130c2-28 20-32 49-32s47 4 49 32" fill="${p.shirt}" stroke="${ink}" stroke-width="1"/>
        <path d="M54 88h20v17q-10 10-20 0z" fill="${skin}"/>
        <ellipse cx="30" cy="67" rx="7" ry="9" fill="${skin}" stroke="#c59c87" stroke-width="1"/>
        <ellipse cx="99" cy="67" rx="7" ry="9" fill="${skin}" stroke="#c59c87" stroke-width="1"/>
        <path d="M29 45C27 23 100 21 100 46v19c0 21-17 33-35 33S29 86 29 65z" fill="${skin}" stroke="#b68d7b" stroke-width="1"/>
        <path d="${fronts[p.style]}" fill="${hair}" stroke="${ink}" stroke-width="1.2" stroke-linejoin="round"/>
        <path d="M39 35q7-12 21-14M84 34q8 7 10 17" fill="none" stroke="#f3dcc6" stroke-opacity=".25" stroke-width="1.6" stroke-linecap="round"/>
        <g stroke="${ink}" stroke-linecap="round">${eyes}<path d="M61 82q4 3 8-1" fill="none" stroke-width="1.5"/><path d="m65 71-1 4h2" fill="none" stroke="#c89880" stroke-width="1"/></g>
        <g fill="#db9d99" opacity=".48"><ellipse cx="40" cy="76" rx="7" ry="3.5"/><ellipse cx="88" cy="76" rx="7" ry="3.5"/></g>
        <path d="m48 102 16 11 16-11-5 19-11-8-10 8z" fill="#fff3df" stroke="#d2b9a6" stroke-width=".8"/>
        <path d="M64 114v14M29 115l-2 13M99 115l2 13" fill="none" stroke="${ink}" stroke-opacity=".3"/>
        ${detail}
      </g>
    </svg>`;
  }
  root.HeartAvatars={portraits,svg};
})(globalThis);
