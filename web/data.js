(function(root){
  const LEVELS=['L1','L2','L3','L4'];
  const legacyLevels={'轻松':'L1','微甜':'L2','走心':'L3','刺激':'L4'};
  const level=v=>LEVELS.includes(String(v).toUpperCase())?String(v).toUpperCase():legacyLevels[v]||null;
  const people=v=>v==='single'||v===1||v==='单人'?'single':v==='multi'||v===2||v==='多人'||v==='双人'?'multi':null;
  const multiSeed=q=>q.id?.startsWith('seed-')&&/邀请一位|向一位|大家各|在场每个人|每个人送上|互相夸|和你一起|大家一起/.test(q.text);
  function normalizeQuestion(q,{migrateSeed=false}={}){
    return {id:q.id,category:q.category,type:q.type,text:q.text,level:level(q.level),people:migrateSeed&&typeof q.people==='number'&&multiSeed(q)?'multi':people(q.people)};
  }
  function normalizeState(old,defaults){
    const d={...defaults,...old};
    d.questions=d.questions.map(q=>normalizeQuestion(q,{migrateSeed:true}));
    d.current=d.current?d.questions.find(q=>q.id===d.current.id)||null:null;
    d.participants=Array.isArray(d.participants)?d.participants.filter(id=>d.players.some(p=>p.id===id)):[];
    d.multiCount=Number.isInteger(d.multiCount)&&d.multiCount>=2?d.multiCount:2;
    return d;
  }
  const str=(v,max)=>typeof v==='string'&&v.trim().length>0&&v.length<=max;
  function validateLibrary(data){
    if(!data||!Array.isArray(data.categories)||!data.categories.length||data.categories.length>200||!Array.isArray(data.questions)||data.questions.length>20000)throw Error('题库结构不完整');
    const categories=data.categories.map(c=>({id:c.id,name:c.name,symbol:c.symbol||'✿'}));
    if(!categories.every(c=>str(c.id,100)&&str(c.name,12)&&str(c.symbol,10))||new Set(categories.map(c=>c.id)).size!==categories.length)throw Error('题库名称或编号有误');
    const ids=new Set(categories.map(c=>c.id));
    const questions=data.questions.map(q=>normalizeQuestion(q));
    if(!questions.every(q=>str(q.id,100)&&ids.has(q.category)&&['truth','dare'].includes(q.type)&&str(q.text,1000)&&LEVELS.includes(q.level)&&['single','multi'].includes(q.people))||new Set(questions.map(q=>q.id)).size!==questions.length)throw Error('题目字段有误，请检查题型、L1–L4 和单人/多人');
    const qids=new Set(questions.map(q=>q.id));
    return {categories,questions,favorites:Array.isArray(data.favorites)?data.favorites.filter(x=>qids.has(x)):[]};
  }
  function libraryPayload(db){return {format:'heart-notes-library',version:2,exportedAt:new Date().toISOString(),data:{categories:db.categories,questions:db.questions.map(q=>normalizeQuestion(q)),favorites:db.favorites}};}
  function parseJson(text){
    let b;try{b=JSON.parse(text.replace(/^\uFEFF/,''))}catch{throw Error('JSON 格式有误')}
    if(!['heart-notes-library','heart-notes'].includes(b?.format)||![1,2].includes(b.version))throw Error('请选择心动纸条导出的题库或备份');
    const library=validateLibrary(b.data);
    return {library,backup:b.format==='heart-notes'?b.data:null};
  }
  function csvCell(v){v=String(v??'');if(/^[=+\-@\t\r]/.test(v))v="'"+v;return '"'+v.replace(/"/g,'""')+'"';}
  function exportCsv(db){
    const rows=[['题库','题目','题型','氛围强度','参与方式','收藏']];
    for(const c of db.categories){const qs=db.questions.filter(q=>q.category===c.id);if(!qs.length)rows.push([c.name,'','','','','']);for(const q of qs)rows.push([c.name,q.text,q.type==='truth'?'真心话':'大冒险',level(q.level),people(q.people)==='multi'?'多人':'单人',db.favorites.includes(q.id)?'是':'否']);}
    return '\uFEFF'+rows.map(r=>r.map(csvCell).join(',')).join('\r\n');
  }
  function parseCsvRows(text){
    text=text.replace(/^\uFEFF/,'');const rows=[];let row=[],value='',quoted=false,closed=false;
    for(let i=0;i<text.length;i++){
      const c=text[i];if(quoted){if(c==='"'){if(text[i+1]==='"'){value+='"';i++}else{quoted=false;closed=true}}else value+=c;continue}
      if(c==='"'){if(value||closed)throw Error('CSV 引号格式有误');quoted=true}
      else if(c===','){row.push(value);value='';closed=false}
      else if(c==='\n'||c==='\r'){if(c==='\r'&&text[i+1]==='\n')i++;row.push(value);if(row.some(v=>v.trim()))rows.push(row);row=[];value='';closed=false}
      else{if(closed)throw Error('CSV 引号后存在多余字符');value+=c}
    }
    if(quoted)throw Error('CSV 引号没有闭合');row.push(value);if(row.some(v=>v.trim()))rows.push(row);return rows;
  }
  function parseCsv(text,id){
    const rows=parseCsvRows(text);if(!rows.length)throw Error('CSV 文件为空');const headers=rows.shift().map(x=>x.trim());
    const required=['题库','题目','题型','氛围强度','参与方式'];if(!required.every(h=>headers.includes(h)))throw Error('CSV 需包含：'+required.join('、'));
    const categories=[],questions=[],favorites=[];const byName=new Map();
    for(let i=0;i<rows.length;i++){
      const get=h=>{let v=rows[i][headers.indexOf(h)]||'';return /^'[=+\-@\t\r]/.test(v)?v.slice(1):v};
      const name=get('题库').trim();if(!name)throw Error(`第 ${i+2} 行缺少题库`);if(!byName.has(name)){const c={id:id(),name,symbol:'✿'};byName.set(name,c);categories.push(c)}
      const text=get('题目');if(!text.trim()){if(required.slice(2).some(h=>get(h).trim()))throw Error(`第 ${i+2} 行缺少题目`);continue}
      const type={'真心话':'truth','大冒险':'dare',truth:'truth',dare:'dare'}[get('题型').trim()];
      const q={id:id(),category:byName.get(name).id,text,type,level:level(get('氛围强度').trim()),people:people(get('参与方式').trim())};questions.push(q);if(['是','1','true'].includes(get('收藏').trim()))favorites.push(q.id);
    }
    return {library:validateLibrary({categories,questions,favorites}),backup:null};
  }
  function mergeLibrary(db,lib,id){
    const map=new Map();for(const c of lib.categories){let match=db.categories.find(x=>x.name===c.name);if(!match){match={...c,id:id()};db.categories.push(match);db.randomCats.push(match.id)}map.set(c.id,match.id)}
    let count=0;for(const q of lib.questions){const category=map.get(q.category);let target=db.questions.find(x=>x.category===category&&x.text===q.text&&x.type===q.type&&x.level===q.level&&x.people===q.people);if(!target){target={...q,id:id(),category};db.questions.push(target);count++}if(lib.favorites.includes(q.id)&&!db.favorites.includes(target.id))db.favorites.push(target.id)}return count;
  }
  function restoreBackup(data,base){
    const lib=validateLibrary(data);if(!Array.isArray(data.players)||data.players.length>200||!data.players.every(p=>str(p.id,100)&&str(p.name,12))||new Set(data.players.map(p=>p.id)).size!==data.players.length)throw Error('玩家名单格式有误');
    const qids=new Set(lib.questions.map(q=>q.id));const d=normalizeState({...base,...lib,players:data.players.map(p=>({id:p.id,name:p.name})),seen:Array.isArray(data.seen)?data.seen.filter(id=>qids.has(id)):[],round:Number.isSafeInteger(data.round)&&data.round>=0?data.round:0,preview:typeof data.preview==='boolean'?data.preview:true,unique:typeof data.unique==='boolean'?data.unique:true,type:['mix','truth','dare'].includes(data.type)?data.type:'mix',selected:data.selected==='random'||data.selected==='favorites'||lib.categories.some(c=>c.id===data.selected)?data.selected:'random',randomCats:Array.isArray(data.randomCats)?data.randomCats.filter(id=>lib.categories.some(c=>c.id===id)):lib.categories.map(c=>c.id),participants:data.participants,multiCount:data.multiCount,current:data.current&&qids.has(data.current.id)?lib.questions.find(q=>q.id===data.current.id):null},base);return d;
  }
  root.HeartData={LEVELS,level,people,normalizeQuestion,normalizeState,validateLibrary,libraryPayload,parseJson,exportCsv,parseCsvRows,parseCsv,mergeLibrary,restoreBackup};
})(globalThis);
