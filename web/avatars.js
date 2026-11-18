// Portraits cropped from the user's supplied ten-avatar sheet.
(function(root){
  const portraits=[
    {id:'a1',name:'晴日马尾',description:'高马尾 · 清爽运动'},
    {id:'a2',name:'随性短发',description:'短卷发 · 自在帅气'},
    {id:'a3',name:'午后棒球帽',description:'棒球帽 · 轻松随性'},
    {id:'a4',name:'书页眼镜',description:'方框眼镜 · 知性温柔'},
    {id:'a5',name:'元气发带',description:'发带马尾 · 开朗明亮'},
    {id:'a6',name:'慵懒长发',description:'长卷发 · 从容洒脱'},
    {id:'a7',name:'奶油蝴蝶结',description:'短卷发 · 软萌甜美'},
    {id:'a8',name:'复古贝雷帽',description:'圆框眼镜 · 安静文艺'},
    {id:'a9',name:'花语长发',description:'长直发 · 温柔清甜'},
    {id:'a10',name:'花间侧辫',description:'侧编发 · 俏皮可爱'}
  ];
  function svg(id){
    const portrait=portraits.find(item=>item.id===id)||portraits[0];
    return `<img class="host-portrait" src="/avatar-${portrait.id}.png" alt="" width="360" height="360">`;
  }
  root.HeartAvatars={portraits,svg};
})(globalThis);
