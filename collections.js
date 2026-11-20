const collectionGroups = [
  {id:'candles', name:'Candles & Holders', types:['candles','candles-holder','diffusers'], cover:'The Twist Taper'},
  {id:'trays', name:'Trays & Coasters', types:['trays','tray','coasters'], cover:'Shell Tray'},
  {id:'kitchen', name:'Kitchen & Table', types:['kitchen-essentials','fridge-magnets'], cover:'The Egg Nest'},
  {id:'accessories', name:'Accessories & Keepsakes', types:['keychains','bookmarks','her-favorites'], cover:'The Initial'},
  {id:'gifts', name:'Games & Gift Sets', types:['board-games','bundles'], cover:'The Signature Domino Set'}
];
const coastalNames = ['The Sea Set','Shell Tray','The Sand Shell Candle','The Conch Candle','The Positano Breeze Set','By The Sea Tray','Seahorse Keychain','The Ocean Bliss'];
let collections = [];
let catalogReady = false;
function browsingType(p) {
  return p.name==='The Floating Cherry Holder' ? 'kitchen-essentials' : p.category;
}
function collectionUrl(id,type='',sort='featured') {
  const params=new URLSearchParams();
  if(type)params.set('type',type);
  if(sort!=='featured')params.set('sort',sort);
  return '#shop/'+encodeURIComponent(id)+(params.size?'?'+params:'');
}
function shopLink(text,href,className) {
  const a=document.createElement('a');
  a.textContent=text;
  a.href=href;
  a.className=className;
  return a;
}
function buildCollections(){
  const types=new Set(collectionGroups.flatMap(group=>group.types));
  const visible=PRODUCTS.filter(p=>p.inStock!==false);
  const unknown=[...new Set(visible.map(browsingType))].filter(type=>!types.has(type));
  collections=[...collectionGroups,...unknown.map(type=>({id:'category-'+type,name:typeName(type),types:[type]}))]
    .map(group=>({...group,items:visible.filter(p=>group.types.includes(browsingType(p)))})).filter(group=>group.items.length);
  const all={id:'all',name:'All pieces',items:visible};
  const sea={id:'by-the-sea',name:'By the Sea',items:visible.filter(p=>coastalNames.some(name=>p.name.startsWith(name)))};
  const menu=document.getElementById('productsSub');
  const tiles=document.getElementById('collectionTiles');
  const footer=document.getElementById('footerProductsList');
  tiles.replaceChildren();menu.replaceChildren();footer.replaceChildren();
  for(const group of collections){
    const tile=shopLink('',collectionUrl(group.id),'collection-tile');
    const cover=group.items.find(p=>p.name===group.cover)||group.items[0];
    const photo=cover.images?.[0]||cover.image;
    if(photo){
      const img=document.createElement('img');
      img.src=photo;img.alt='';img.loading='lazy';tile.append(img);
    }
    const heading=document.createElement('h3');heading.textContent=group.name;
    const count=document.createElement('small');count.textContent=group.items.length+' pieces';
    tile.append(heading,count);tiles.append(tile);
  }
  collections=[all,...collections,...(sea.items.length?[sea]:[])];
  for(const group of collections){
    menu.append(shopLink(group.name,collectionUrl(group.id),'sp-sub-link'));
    const li=document.createElement('li');
    li.append(shopLink(group.name,collectionUrl(group.id),''));footer.append(li);
  }
  const heroPiece=visible.find(p=>p.name==='The Sand Shell Candle');
  const heroNote=document.getElementById('heroNote');
  if(heroPiece && (heroPiece.images?.[0]||heroPiece.image)){
    heroNote.href='#product/'+heroPiece.id;
    heroNote.firstElementChild.src=heroPiece.images?.[0]||heroPiece.image;
    heroNote.hidden=false;
  }
  catalogReady=true;
  updateShopRoute();
}
function typeName(type){
  if(type==='diffusers')return 'Bukhoor holders';
  if(type==='candles-holder')return 'Candle holders';
  return window.FB_CATEGORIES?.find(c=>c.id===type)?.name||type;
}
function updateShopRoute(){
  if(!catalogReady)return;
  const [path,query]=location.hash.slice(1).split('?');
  const [page,id]=path.split('/');
  if(page==='product'){
    const product=PRODUCTS.find(p=>String(p.id)===id && p.inStock!==false);
    if(product){displayDetail(product.id);return;}
  }
  if(document.getElementById('detailModal').classList.contains('open'))hideDetail();
  const group=collections.find(g=>page==='shop' && collectionUrl(g.id).split('?')[0]==='#'+path)||collections[0];
  const params=new URLSearchParams(query);
  const types=[...new Set(group.items.map(browsingType))];
  const type=types.includes(params.get('type'))?params.get('type'):'';
  const sort=['low','high'].includes(params.get('sort'))?params.get('sort'):'featured';
  const items=group.items.filter(p=>!type||browsingType(p)===type);
  const lowest=p=>Math.min(p.price,...(p.pricingOptions||[]).map(o=>o.price));
  if(sort!=='featured')items.sort((a,b)=>(lowest(a)-lowest(b))*(sort==='low'?1:-1));
  document.getElementById('collectionTitle').textContent=group.name;
  document.getElementById('collectionCount').textContent=items.length+' pieces';
  const filters=document.querySelector('.filters');filters.replaceChildren();
  const choices=group.id==='all'?collections.filter(g=>g.id!=='by-the-sea').map(g=>[g.name,collectionUrl(g.id),g===group]):
    [['All',collectionUrl(group.id,'',sort),!type],...types.map(t=>[typeName(t),collectionUrl(group.id,t,sort),t===type])];
  for(const [label,href,active] of choices){
    const a=shopLink(label,href,'f-btn'+(active?' active':''));if(active)a.setAttribute('aria-current','page');filters.append(a);
  }
  for(const a of document.querySelectorAll('#productsSub a'))a.toggleAttribute('data-selected',a.hash===collectionUrl(group.id));
  const select=document.getElementById('collectionSort');select.value=sort;
  select.onchange=()=>location.hash=collectionUrl(group.id,type,select.value);
  renderProducts(items);
  if(page==='shop')document.getElementById('shop').scrollIntoView();
}
function openDetail(id){
  if(location.hash==='#product/'+id){displayDetail(id);return;}
  history.pushState({returnHash:location.hash},'','#product/'+id);
  displayDetail(id);
}
function closeDetail(){
  hideDetail();
  if(!location.hash.startsWith('#product/'))return;
  if(history.state && 'returnHash' in history.state)history.back();
  else location.replace('#shop/all');
}
window.addEventListener('hashchange',updateShopRoute);
