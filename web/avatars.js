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
    {id:'a8',name:'薄雾银发',description:'短银发 · 利落酷帅',bg:'#e1e7ed',hair:'#a0a6b8',shirt:'#7e8ba5',style:'swept',accessory:'hoop'},
    {id:'a9',name:'樱桃双辫',description:'双辫子 · 甜美可爱',bg:'#f3dfe2',hair:'#79544d',shirt:'#c58d9b',style:'braids',accessory:'cherry'},
    {id:'a10',name:'慵懒狼尾',description:'中短发 · 随性酷帅',bg:'#e5e2ed',hair:'#5a5263',shirt:'#93839e',style:'shag',accessory:'stud'}
  ];
  function svg(id){const p=portraits.find(a=>a.id===id)||portraits[0];let back='',front='';
    switch(p.style){
      case 'long':back='<path d="M30 62C23 9 101 7 98 61L105 116H23z"/>';front='<path d="M33 58c-9-42 61-48 61-3-21-2-31-15-35-24-2 15-12 24-26 27z"/>';break;
      case 'pixie':back='<path d="M33 65c-8-17-4-38 14-46 26-13 54 5 49 35l-9 21-9-33-36 23z"/>';front='<path d="M31 53c-4-31 36-49 59-23 4 5 6 12 5 18-7-3-14-9-18-15-7 18-29 23-46 20z"/>';break;
      case 'buns':back='<circle cx="32" cy="34" r="15"/><circle cx="95" cy="34" r="15"/><path d="M33 64c-9-54 71-54 62 0l-10 14H42z"/>';front='<path d="M34 54c-3-39 59-45 61 0-12-1-24-12-29-20-8 11-17 19-32 20z"/>';break;
      case 'bob':back='<path d="M30 54c0-46 69-46 69 0l-1 31c-18 16-51 15-69-1z"/>';front='<path d="M32 51c3-38 61-40 64 0H82l-3-12-3 12H60l-3-11-2 11z"/>';break;
      case 'curly':back='<path d="M29 50c-16-12-1-30 10-26 0-16 23-19 29-11 15-10 31 1 30 14 17 1 18 22 8 29 13 19-5 35-17 28H37c-19 11-29-15-17-24-7-4-5-10 9-10z"/>';front='<path d="M32 48c-12-15 9-26 18-18 5-16 24-14 29-3 16-6 28 9 17 23-12 3-20-5-23-12-8 16-26 17-41 10z"/>';break;
      case 'pony':back='<path d="M80 29c12-27 33-15 29 4-4 17-7 34 6 46-29 6-32-23-26-38z"/><path d="M31 61C22 7 101 5 97 59L86 79H41z"/>';front='<path d="M32 52C22 15 89 4 96 51c-20-1-31-16-33-24-5 14-16 22-31 25z"/>';break;
      case 'straight':back='<path d="M29 54c0-49 72-49 71 1v60H26z"/>';front='<path d="M31 52c-2-41 63-45 66 0-17-5-25-17-29-28-8 16-20 26-37 28z"/>';break;
      case 'swept':back='<path d="M32 62c-13-26 6-50 32-48 25-2 43 21 32 47l-13 16H44z"/>';front='<path d="M29 48C25 9 84 4 99 39c-10-3-18-5-25-4-11 14-28 20-45 13z"/>';break;
      case 'braids':back='<path d="M32 62c-8-53 71-54 65 0L86 81H43z"/><path d="M32 58c-11 5-10 14-4 19-11 8-8 16-1 19-8 8-5 14 2 18l11-1c6-9 1-15-1-20 8-7 5-15 0-19 4-8 2-13-7-16zM95 58c11 5 10 14 4 19 11 8 8 16 1 19 8 8 5 14-2 18l-11-1c-6-9-1-15 1-20-8-7-5-15 0-19-4-8-2-13 7-16z"/>';front='<path d="M33 51c-5-40 63-43 62 0-15-1-24-12-30-22-6 13-16 20-32 22z"/>';break;
      case 'shag':back='<path d="M31 47c-2-42 67-42 67 0l-2 19 11 25-21-6-1 15-21-8-20 8-2-16-20 8 11-27z"/>';front='<path d="M29 48c-5-34 49-46 65-20l8 19-19-7-5 13-12-20-8 20-12-11-12 15z"/>';break;
    }
    const smile=['pixie','swept','shag'].includes(p.style)?'<path d="M59 76h10"/>':'<path d="M58 74q6 7 12 0"/>';
    let detail='';
    if(p.accessory==='glasses')detail='<g fill="none" stroke="#6b626b" stroke-width="2"><circle cx="52" cy="62" r="10"/><circle cx="77" cy="62" r="10"/><path d="M62 61h5"/></g>';
    if(p.accessory==='flower')detail='<g fill="#f0c6d7"><circle cx="91" cy="43" r="5"/><circle cx="96" cy="48" r="5"/><circle cx="91" cy="53" r="5"/><circle cx="86" cy="48" r="5"/></g><circle cx="91" cy="48" r="3" fill="#f4dfad"/>';
    if(p.accessory==='moon')detail='<path d="M89 36c-7 1-6 12 1 12-3 4-11 1-10-5 0-4 4-8 9-7" fill="#e3d5a5"/>';
    if(p.accessory==='freckles')detail='<g fill="#b88a74"><circle cx="44" cy="71" r="1"/><circle cx="49" cy="73" r="1"/><circle cx="80" cy="73" r="1"/><circle cx="85" cy="71" r="1"/></g>';
    if(['bow','ribbon'].includes(p.accessory))detail='<path d="m89 26-12-6 1 13 11-4 11 5 1-14z" fill="#d9a8b5"/><circle cx="89" cy="28" r="3" fill="#f3d9df"/>';
    if(p.accessory==='hoop')detail='<circle cx="91" cy="73" r="5" fill="none" stroke="#dfc29c" stroke-width="2"/>';
    if(p.accessory==='stud')detail='<circle cx="91" cy="72" r="2.5" fill="#e1cfaf"/>';
    if(p.accessory==='cherry')detail='<path d="m26 90 5-7 6 7" fill="none" stroke="#9cac8f"/><circle cx="25" cy="94" r="4" fill="#c98592"/><circle cx="38" cy="94" r="4" fill="#c98592"/>';
    return `<svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><circle cx="64" cy="64" r="63" fill="${p.bg}"/><g fill="${p.hair}">${back}</g><path d="M20 128c1-27 19-37 44-37s43 10 44 37" fill="${p.shirt}"/><path d="M55 84h18v15c-4 8-14 8-18 0" fill="#efc8b6"/><ellipse cx="35" cy="64" rx="6" ry="8" fill="#f4d3c3"/><ellipse cx="93" cy="64" rx="6" ry="8" fill="#f4d3c3"/><path d="M35 47c0-25 58-25 58 0v17c0 19-14 29-29 29S35 83 35 64z" fill="#f8ddcf"/><g fill="${p.hair}">${front}</g><g stroke="#66515b" stroke-width="2.3" stroke-linecap="round" fill="none"><path d="M48 61v3M78 61v3"/>${smile}</g><g fill="#e5a6ad" opacity=".55"><ellipse cx="45" cy="70" rx="5" ry="3"/><ellipse cx="82" cy="70" rx="5" ry="3"/></g>${detail}<path d="m52 101 12 7 12-7" fill="none" stroke="#fff9f3" stroke-width="2" opacity=".8"/></svg>`;
  }
  root.HeartAvatars={portraits,svg};
})(globalThis);
