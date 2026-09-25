
/* Notification clicks stay on the same page. No full-page hiding/reload effect. */
(function(){
  try{
    if(new URLSearchParams(location.search).has('chat')){
      document.documentElement.classList.add('notification-route');
    }
  }catch(e){}
})();



const form=document.getElementById("contact-form");
const status=document.getElementById("form-status");

form.addEventListener("submit",async function(event){
event.preventDefault();

const data=new FormData(form);

const response=await fetch(form.action,{
method:"POST",
body:data,
headers:{
"Accept":"application/json"
}
});

if(response.ok){
status.innerHTML="Նամակը հաջողությամբ ուղարկվեց ✅";
form.reset();
}else{
status.innerHTML="Չհաջողվեց ուղարկել նամակը ❌";
}
});


document.querySelectorAll('input, textarea').forEach(function(field) { field.addEventListener('invalid', function() { if (field.validity.valueMissing) { if (field.name === 'nickname') { field.setCustomValidity('Խնդրում ենք գրել ձեր PUBG անունը'); } else if (field.name === 'email') { field.setCustomValidity('Խնդրում ենք գրել ձեր էլ․ փոստը'); } else if (field.name === 'message') { field.setCustomValidity('Խնդրում ենք գրել ձեր հաղորդագրությունը'); } else { field.setCustomValidity('Խնդրում ենք լրացնել այս դաշտը'); } } else if (field.validity.typeMismatch) { field.setCustomValidity('Խնդրում ենք գրել ճիշտ էլ․ փոստի հասցե'); } }); field.addEventListener('input', function() { field.setCustomValidity(''); }); })


function updateArmeniaTime() { const now = new Date(); const time = new Intl.DateTimeFormat('hy-AM', { timeZone: 'Asia/Yerevan', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(now); const date = new Intl.DateTimeFormat('hy-AM', { timeZone: 'Asia/Yerevan', day: 'numeric', month: 'long', year: 'numeric' }).format(now); document.getElementById('arm-time').textContent = time; document.getElementById('arm-date').textContent = date; } async function updateWeather() { try { const url = 'https://api.open-meteo.com/v1/forecast?latitude=40.1872&longitude=44.5152&current=temperature_2m,weather_code&timezone=Asia%2FYerevan'; const response = await fetch(url); const data = await response.json(); const temp = Math.round(data.current.temperature_2m); const code = data.current.weather_code; let weather = '☀️ Պարզ'; if (code === 1 || code === 2) weather = '🌤️ Մասամբ ամպամած'; else if (code === 3) weather = '☁️ Ամպամած'; else if (code >= 51 && code <= 67) weather = '🌧️ Անձրև'; else if (code >= 71 && code <= 77) weather = '❄️ Ձյուն'; else if (code >= 80 && code <= 82) weather = '🌦️ Անձրևային'; else if (code >= 95) weather = '⛈️ Ամպրոպ'; document.getElementById('arm-weather').textContent = weather + ' ' + temp + '°C'; } catch (error) { document.getElementById('arm-weather').textContent = 'Եղանակը հասանելի չէ'; } } updateArmeniaTime(); updateWeather(); setInterval(updateArmeniaTime, 1000); setInterval(updateWeather, 600000);




const SUPABASE_URL="https://hvhlrbfjloiahbqmnrly.supabase.co";
const SUPABASE_ANON_KEY="sb_publishable_EcZUkLdUCVv3qWDD7jlvhg_OjTYu1jA";
const {createClient}=supabase;
const sb=createClient(SUPABASE_URL,SUPABASE_ANON_KEY);
const $=id=>document.getElementById(id);
const siteUrl='https://aimrelax-pubg.github.io/';
let selectedPlayerId=null,playersCache=[],currentUser=null;
function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}
function openModal(){ $('account-modal').classList.add('open'); $('account-modal').setAttribute('aria-hidden','false'); showModal('login'); }
function closeModal(){ $('account-modal').classList.remove('open'); $('account-modal').setAttribute('aria-hidden','true'); }
function showModal(which){ ['modal-login','modal-register','modal-reset','modal-account'].forEach(id=>$(id).style.display='none'); ['tab-login','tab-register'].forEach(id=>$(id).classList.remove('active')); if(which==='login'){ $('modal-login').style.display='block';$('tab-login').classList.add('active'); } if(which==='register'){ $('modal-register').style.display='block';$('tab-register').classList.add('active'); } if(which==='reset')$('modal-reset').style.display='block'; if(which==='account')$('modal-account').style.display='block'; }
$('account-open-btn').onclick=(e)=>{e.stopPropagation();if(!currentUser){openModal();return}const menu=$('user-dropdown');const ab=$('admin-menu-btn');if(ab && currentUser.id==='5f1c951f-1e76-4f82-9849-46becf038b55'){ab.style.setProperty('display','block','important');ab.style.setProperty('visibility','visible','important');ab.style.setProperty('opacity','1','important');mySiteRole='owner';}menu.classList.toggle('open');menu.setAttribute('aria-hidden',String(!menu.classList.contains('open')))};
$('user-settings-menu').onclick=(e)=>{e.stopPropagation();$('user-dropdown').classList.remove('open');$('user-dropdown').setAttribute('aria-hidden','true');openAccountSettings()};
function openAccountSettings(){
  if(!currentUser){ openModal(); return; }
  $('account-modal').classList.add('open');
  $('account-modal').setAttribute('aria-hidden','false');
  $('settings-nickname').value=currentUser.user_metadata?.nickname||currentUser.email?.split('@')[0]||'';
  $('settings-email').value=currentUser.email||'';
  $('settings-current-password').value='';
  $('settings-new-password').value='';
  $('settings-status').textContent='';
  $('settings-status').className='auth-status';
  showModal('account');
}
$('account-close').onclick=closeModal;
$('friends-menu-btn').onclick=async(e)=>{e.stopPropagation();if(!currentUser){openModal();return}const pop=$('friends-menu-popup');pop.classList.toggle('open');pop.setAttribute('aria-hidden',String(!pop.classList.contains('open')));if(pop.classList.contains('open'))await loadFriends()};
$('friend-notify-btn').onclick=async(e)=>{e.stopPropagation();if(!currentUser){openModal();return}const pop=$('friend-notify-popup');pop.classList.toggle('open');pop.setAttribute('aria-hidden',String(!pop.classList.contains('open')));if(pop.classList.contains('open'))await loadFriendNotifications()};
document.addEventListener('click',e=>{if(!e.target.closest('#account-area')){['friend-notify-popup','friends-menu-popup','user-dropdown'].forEach(id=>{$(id).classList.remove('open');$(id).setAttribute('aria-hidden','true')})}});$('account-modal').onclick=e=>{if(e.target===$('account-modal'))closeModal()};$('tab-login').onclick=()=>showModal('login');$('tab-register').onclick=()=>showModal('register');$('m-show-reset').onclick=()=>showModal('reset');$('m-back-login').onclick=()=>showModal('login');
$('m-reg-btn').onclick=async()=>{const nickname=$('m-reg-nickname').value.trim(),email=$('m-reg-email').value.trim(),password=$('m-reg-password').value,password2=$('m-reg-password2').value,status=$('m-reg-status');if(!nickname||!email||!password){status.textContent='Լրացրեք բոլոր դաշտերը։';return}if(password.length<6){status.textContent='Գաղտնաբառը պետք է լինի առնվազն 6 նիշ։';return}if(password!==password2){status.textContent='Գաղտնաբառերը չեն համընկնում։';return}status.textContent='Գրանցում...';const {data,error}=await sb.auth.signUp({email,password,options:{data:{nickname},emailRedirectTo:siteUrl}});if(error){status.textContent=error.message;return}if(data.user&&!data.session)status.textContent='Հաստատման նամակը ուղարկվեց email-ին։ 📧';else{closeModal();await refreshUser()}};
$('m-login-btn').onclick=async()=>{const email=$('m-login-email').value.trim(),password=$('m-login-password').value,status=$('m-login-status');status.textContent='Մուտք...';const {data,error}=await sb.auth.signInWithPassword({email,password});if(error){status.textContent=error.message;return}if(!data.user?.email_confirmed_at){await sb.auth.signOut();status.textContent='Խնդրում ենք նախ հաստատել ձեր email-ը։';return}closeModal();await refreshUser()};
$('google-login-btn').onclick=async()=>{const status=$('m-login-status');status.textContent='Google մուտք...';const {error}=await sb.auth.signInWithOAuth({provider:'google',options:{redirectTo:siteUrl}});if(error)status.textContent=error.message};
$('m-reset-btn').onclick=async()=>{const email=$('m-reset-email').value.trim(),status=$('m-reset-status');if(!email){status.textContent='Գրեք email-ը։';return}const {error}=await sb.auth.resetPasswordForEmail(email,{redirectTo:siteUrl});status.textContent=error?error.message:'Վերականգնման հղումը ուղարկվեց email-ին։ ✅'};
async function saveSettings(){
 if(!currentUser)return;
 const status=$('settings-status');
 const nickname=$('settings-nickname').value.trim();
 const email=$('settings-email').value.trim();
 const currentPassword=$('settings-current-password').value;
 const newPassword=$('settings-new-password').value;
 status.className='auth-status';
 if(!nickname||nickname.length<2){status.textContent='Nickname-ը պետք է լինի առնվազն 2 նիշ։';status.classList.add('settings-error');return}
 if(newPassword&&newPassword.length<6){status.textContent='Նոր գաղտնաբառը պետք է լինի առնվազն 6 նիշ։';status.classList.add('settings-error');return}
 if(newPassword&&!currentPassword){status.textContent='Գաղտնաբառը փոխելու համար գրեք ընթացիկ գաղտնաբառը։';status.classList.add('settings-error');return}
 status.textContent='Պահպանվում է...';
 if(nickname!==(currentUser.user_metadata?.nickname||'')){
   const {data:exists}=await sb.from('profiles').select('id').eq('nickname',nickname).neq('id',currentUser.id).maybeSingle();
   if(exists){status.textContent='Այս Nickname-ը արդեն զբաղված է։';status.classList.add('settings-error');return}
 }
 // Nickname is stored both in Auth metadata and public profile.
 if(nickname!==(currentUser.user_metadata?.nickname||'')){
   const {error}=await sb.auth.updateUser({data:{...(currentUser.user_metadata||{}),nickname}});
   if(error){status.textContent='Nickname-ը չփոխվեց։ '+error.message;status.classList.add('settings-error');return}
   const {error:pe}=await sb.from('profiles').update({nickname}).eq('id',currentUser.id);
   if(pe){status.textContent='Nickname-ը Auth-ում փոխվեց, բայց պրոֆիլը չթարմացավ։ '+pe.message;status.classList.add('settings-error');return}
 }
 // Email can require confirmation from Supabase.
 if(email&&email!==currentUser.email){
   const {error}=await sb.auth.updateUser({email});
   if(error){status.textContent='Email-ը չփոխվեց։ '+error.message;status.classList.add('settings-error');return}
 }
 // Re-authenticate with the current password, then change password.
 if(newPassword){
   const {error:loginError}=await sb.auth.signInWithPassword({email:currentUser.email,password:currentPassword});
   if(loginError){status.textContent='Ընթացիկ գաղտնաբառը սխալ է։';status.classList.add('settings-error');return}
   const {error:pwError}=await sb.auth.updateUser({password:newPassword});
   if(pwError){status.textContent='Նոր գաղտնաբառը չպահպանվեց։ '+pwError.message;status.classList.add('settings-error');return}
 }
 status.textContent=email&&email!==currentUser.email?'Փոփոխությունները պահպանվեցին։ Նոր email-ը հաստատեք նամակից։ 📧':'Փոփոխությունները պահպանվեցին։ ✅';
 status.classList.add('settings-success');
 $('settings-current-password').value='';$('settings-new-password').value='';
 await refreshUser();
}
$('settings-save-btn').onclick=saveSettings;
async function doLogout(){
  stopAimrelaxNotificationCenter();
  const {error}=await sb.auth.signOut();
  if(error){console.error('Logout failed:',error);return;}
  currentUser=null;
  mySiteRole=null;
  if($('admin-online-users'))$('admin-online-users').style.display='none';
  closeModal();
  if(typeof closeAdminPanel==='function') closeAdminPanel();
  $('user-dropdown').classList.remove('open','show');
  $('user-dropdown').setAttribute('aria-hidden','true');
  $('header-logout-btn').style.display='none';
  $('admin-menu-btn').style.setProperty('display','none','important');
  $('account-open-btn').textContent='ՄՈՒՏՔ / ԳՐԱՆՑՈՒՄ';
  $('account-open-btn').classList.remove('user-logo');
  $('modal-nickname').textContent='';
  $('settings-nickname').value='';
  $('settings-email').value='';
  try{await loadPlayers();}catch(e){}
  try{await loadVotes();}catch(e){}
  try{await loadComments();}catch(e){}
  try{await loadFriends();}catch(e){}
  try{await loadFriendNotifications();}catch(e){}
  try{await loadPresence();}catch(e){}
}
$('m-logout-btn').onclick=doLogout;
$('header-logout-btn').onclick=doLogout;
async function loadPlayers(){
  const rosterNicknames=[...document.querySelectorAll('#players h3')]
    .map(el=>el.textContent.trim()).filter(Boolean);

  const {data:dbPlayers,error}=await sb.from('players').select('id,nickname,active');
  if(error){
    console.error('players load error',error);
    playersCache=rosterNicknames.map(nickname=>({id:null,nickname,dbNickname:null}));
  }else{
    const normalize=v=>String(v||'').normalize('NFKC')
      .replace(/[\u200B-\u200D\uFEFF]/g,'')
      .replace(/[«»“”]/g,'')
      .replace(/\s+/g,' ').trim().toLocaleLowerCase('hy-AM');
    const compact=v=>normalize(v).replace(/[\s_\-.'’`]/g,'');
    const byExact=new Map();
    const byCompact=new Map();
    (dbPlayers||[]).forEach(p=>{
      if(!p?.id||!p?.nickname)return;
      const a=normalize(p.nickname),b=compact(p.nickname);
      if(!byExact.has(a))byExact.set(a,p);
      if(!byCompact.has(b))byCompact.set(b,p);
    });

    playersCache=rosterNicknames.map(nickname=>{
      const exact=byExact.get(normalize(nickname));
      const compactMatch=byCompact.get(compact(nickname));
      const p=exact||compactMatch||null;
      return {id:p?.id||null,nickname,dbNickname:p?.nickname||null};
    });
  }

  $('player-options').innerHTML=playersCache.map(p=>`
    <label class="player-option${p.id?'':' player-option-missing'}">
      <input type="radio" name="vote-player" value="${esc(p.id||'')}" ${p.id?'':'disabled'}>
      <span>${esc(p.nickname)}</span>${p.id?'':' <small class="player-sync-hint">(UUID չկա)</small>'}
    </label>`).join('');

  document.querySelectorAll('input[name="vote-player"]').forEach(i=>i.onchange=()=>{
    selectedPlayerId=i.value;
    document.querySelectorAll('.player-option').forEach(x=>x.classList.remove('selected'));
    i.closest('.player-option').classList.add('selected');
    $('vote-btn').disabled=!currentUser||!selectedPlayerId;
    $('vote-status').textContent='';
  });

  if(!currentUser){
    $('vote-btn').disabled=true;
  }else if(!selectedPlayerId){
    $('vote-btn').disabled=true;
  }
}

async function loadVotes(){
  const {data,error}=await sb.from('votes').select('player_id');
  if(error){
    $('vote-total').textContent='Քվեարկության տվյալները հասանելի չեն';
    console.error('votes load error',error);
    return;
  }

  const nicknameById=new Map(playersCache.map(p=>[String(p.id),p.nickname]));
  const counts={};

  (data||[]).forEach(v=>{
    const key=String(v.player_id);
    counts[key]=(counts[key]||0)+1;
  });

  const entries=Object.entries(counts)
    .map(([id,c])=>[nicknameById.get(id)||'Խաղացող',c])
    .sort((a,b)=>b[1]-a[1]);

  $('vote-total').textContent=`Ընդհանուր՝ ${data?.length||0} հոգի`;
  $('vote-list').innerHTML=entries.length
    ?entries.map(x=>`<div class="vote-row"><span>${esc(x[0])}</span><span>${x[1]} քվե</span></div>`).join('')
    :'<div class="loading-text">Դեռ ոչ ոք չի քվեարկել։</div>';

  if(currentUser){
    const {data:mine}=await sb.from('votes').select('id').eq('user_id',currentUser.id).limit(1).maybeSingle();
    if(mine){
      $('vote-btn').disabled=true;
      $('vote-status').textContent='Դուք արդեն քվեարկել եք։';
    }else{
      $('vote-btn').disabled=!selectedPlayerId;
    }
  }else{
    $('vote-btn').disabled=true;
  }
}

async function submitVote(){
  if(!currentUser){
    $('vote-status').textContent='Քվեարկելու համար նախ մուտք գործեք։';
    return;
  }

  const selectedInput=document.querySelector('input[name="vote-player"]:checked');
  if(!selectedInput || !selectedInput.value){
    $('vote-status').textContent='Ընտրեք խաղացող։';
    return;
  }

  const selectedPlayer=playersCache.find(p=>String(p.id)===String(selectedInput.value));
  if(!selectedPlayer?.id){
    $('vote-status').textContent='Այս նիկի UUID-ը players աղյուսակում չկա։ Նախ գործարկեք տրամադրված SQL-ը։';
    return;
  }

  const btn=$('vote-btn');
  btn.disabled=true;
  $('vote-status').textContent='Քվեարկությունը պահպանվում է...';

  try{
    const {data:existing,error:checkError}=await sb.from('votes')
      .select('id').eq('user_id',currentUser.id).limit(1).maybeSingle();
    if(checkError)throw new Error('Չհաջողվեց ստուգել քվեարկությունը։ '+checkError.message);
    if(existing){
      $('vote-status').textContent='Դուք արդեն քվեարկել եք։';
      return;
    }

    const {error}=await sb.from('votes').insert({
      user_id:currentUser.id,
      player_id:selectedPlayer.id
    });
    if(error)throw new Error('Քվեարկությունը չպահպանվեց։ '+error.message);

    $('vote-status').textContent=`Ձեր քվեն «${selectedPlayer.nickname}»-ի համար պահպանվեց։`;
    selectedPlayerId=selectedPlayer.id;
    await loadVotes();
  }catch(e){
    console.error('vote submit error',e);
    $('vote-status').textContent=e.message||'Քվեարկությունը չպահպանվեց։';
    btn.disabled=false;
  }
}

// Քվեարկել կոճակի իրական event-ը
$('vote-btn').onclick=submitVote;

async function loadComments(){
  await loadGalleryImages();
  for(const box of document.querySelectorAll('.media-comments')){
    const slotId=box.dataset.mediaId;
    const list=box.querySelector('.comments-list'),input=box.querySelector('.comment-input'),btn=box.querySelector('.comment-btn');
    const {data:img}=await sb.from('gallery_images').select('id').eq('slot_id',slotId).maybeSingle();
    if(!img){ list.innerHTML='<div class="muted">Դեռ նկար չկա։</div>'; input.disabled=true; btn.disabled=true; continue; }
    const {data,error}=await sb.from('gallery_comments').select('id,image_id,user_id,nickname,comment,parent_id,created_at').eq('image_id',img.id).order('created_at',{ascending:true});
    if(error){list.innerHTML='<div class="muted">Մեկնաբանությունները չբեռնվեցին։</div>';continue;}
    renderGalleryComments(list,data||[]);
    input.disabled=!currentUser; btn.disabled=!currentUser;
    btn.onclick=async()=>{
      if(!currentUser)return;
      const comment=input.value.trim(); if(!comment)return;
      const nickname=currentUser.user_metadata?.nickname||currentUser.email?.split('@')[0]||'Օգտատեր';
      const {error:insertError}=await sb.from('gallery_comments').insert({image_id:img.id,user_id:currentUser.id,nickname,comment,parent_id:null});
      if(insertError){alert('Չհաջողվեց ավելացնել մեկնաբանությունը։');return;}
      input.value=''; await loadComments();
    };
  }
}

function renderGalleryComments(list,comments){
  const admin=(mySiteRole==='owner'||mySiteRole==='admin');
  const byParent={};
  comments.forEach(c=>{(byParent[c.parent_id||'root'] ||= []).push(c);});
  const render=(c,depth=0)=>{
    const mine=currentUser?.id===c.user_id;
    let html=`<div class="comment-row" data-comment-id="${esc(c.id)}" style="margin-left:${Math.min(depth,2)*10}px"><strong>${esc(c.nickname||'Օգտատեր')}</strong>: ${esc(c.comment)}`;
    if(admin && depth===0) html+=`<div class="gallery-comment-actions"><button class="gallery-reply-btn" type="button" data-reply="${esc(c.id)}">↩️ Պատասխանել</button></div><div class="gallery-reply-box" data-reply-box="${esc(c.id)}"><input maxlength="500" placeholder="Պատասխան..." data-reply-input="${esc(c.id)}"><button type="button" data-reply-send="${esc(c.id)}">➤</button></div>`;
    html+='</div>';
    const children=byParent[c.id]||[];
    if(children.length) html+=children.map(x=>`<div class="gallery-reply"><strong>${esc(x.nickname||'Օգտատեր')}</strong>: ${esc(x.comment)}</div>`).join('');
    return html;
  };
  list.innerHTML=(byParent.root||[]).map(c=>render(c)).join('')||'<div class="muted">Դեռ մեկնաբանություն չկա։</div>';
  if(admin){
    list.querySelectorAll('[data-reply]').forEach(b=>b.onclick=()=>{const box=list.querySelector(`[data-reply-box="${CSS.escape(b.dataset.reply)}"]`);if(box)box.classList.toggle('open');});
    list.querySelectorAll('[data-reply-send]').forEach(b=>b.onclick=async()=>{
      const id=b.dataset.replySend; const inp=list.querySelector(`[data-reply-input="${CSS.escape(id)}"]`); const text=(inp?.value||'').trim(); if(!text)return;
      const parent=comments.find(c=>c.id===id); if(!parent)return;
      const nickname=currentUser?.user_metadata?.nickname||currentUser?.email?.split('@')[0]||'AIMRELAX ADMIN';
      const {error}=await sb.from('gallery_comments').insert({image_id:parent.image_id,user_id:currentUser.id,nickname,comment:text,parent_id:id});
      if(error){alert('Չհաջողվեց ուղարկել պատասխանը։');return;}
      inp.value=''; await loadComments();
    });
  }
}

async function loadGalleryImages(){
  const {data,error}=await sb.from('gallery_images').select('slot_id,storage_path,caption').order('slot_id');
  if(error){console.warn('Gallery images load failed:',error);return;}
  const map=Object.fromEntries((data||[]).map(x=>[x.slot_id,x]));
  const admin=(mySiteRole==='owner'||mySiteRole==='admin');

  document.querySelectorAll('.gallery-item[data-gallery-slot]').forEach(item=>{
    const slot=item.dataset.gallerySlot;
    const visual=item.querySelector('.media-visual');
    const record=map[slot];
    if(!visual)return;

    visual.classList.remove('gallery-image-loading','gallery-image-error');
    visual.innerHTML='';

    if(record?.storage_path){
      const placeholder=document.createElement('div');
      placeholder.className='gallery-placeholder';
      placeholder.textContent='Բեռնվում է...';
      visual.appendChild(placeholder);
      visual.classList.add('gallery-image-loading');

      const img=document.createElement('img');
      img.className='gallery-image';
      img.alt=record.caption||'AIMRELAX-PUBG';
      img.loading='eager';
      img.decoding='async';
      img.draggable=false;

      const {data:u}=sb.storage.from('gallery-images').getPublicUrl(record.storage_path);
      const publicUrl=u?.publicUrl||'';
      let triedSigned=false;

      const showImage=(url)=>{
        img.src=url;
        placeholder.remove();
        visual.classList.remove('gallery-image-loading','gallery-image-error');
      };

      img.onload=()=>{
        placeholder.remove();
        visual.classList.remove('gallery-image-loading','gallery-image-error');
      };

      img.onerror=async()=>{
        if(!triedSigned){
          triedSigned=true;
          const signed=await sb.storage.from('gallery-images').createSignedUrl(record.storage_path,3600);
          if(!signed.error && signed.data?.signedUrl){showImage(signed.data.signedUrl);return;}
        }
        visual.classList.remove('gallery-image-loading');
        visual.classList.add('gallery-image-error');
        placeholder.textContent='Նկարը հասանելի չէ';
        if(!placeholder.isConnected)visual.appendChild(placeholder);
      };

      visual.appendChild(img);
      if(publicUrl)showImage(publicUrl);
      else img.dispatchEvent(new Event('error'));
    }else{
      visual.innerHTML='<div class="gallery-placeholder">ՆԿԱՐ</div>';
    }

    const tools=item.querySelector('.gallery-admin-tools');
    if(tools){
      tools.hidden=!admin;
      tools.dataset.imageId=record?.slot_id||'';
      const status=tools.querySelector('.gallery-admin-status');
      if(status)status.textContent='';
    }
    const file=item.querySelector('.gallery-file-input'),up=item.querySelector('.gallery-upload-btn'),del=item.querySelector('.gallery-delete-btn');
    if(file&&up&&del){
      file.onchange=()=>{const f=file.files?.[0];if(f)up.textContent='⬆️ '+f.name;};
      up.onclick=()=>uploadGalleryImage(slot,file,up,del,tools);
      del.onclick=()=>deleteGalleryImage(slot,del,tools);
    }
  });
}

async function uploadGalleryImage(slot,fileInput,btn,delBtn,tools){
  if(!(mySiteRole==='owner'||mySiteRole==='admin'))return;
  const file=fileInput.files?.[0]; if(!file){alert('Նախ ընտրեք նկար։');return;}
  if(!file.type.startsWith('image/')){alert('Միայն նկար է թույլատրվում։');return;}
  if(file.size>10*1024*1024){alert('Նկարի չափը պետք է լինի մինչև 10MB։');return;}
  btn.disabled=true; delBtn.disabled=true; if(tools)tools.querySelector('.gallery-admin-status').textContent='Բեռնվում է...';
  try{
    const ext=(file.name.split('.').pop()||'jpg').toLowerCase().replace(/[^a-z0-9]/g,'');
    const path=`${slot}-${Date.now()}.${ext}`;
    const {error:upErr}=await sb.storage.from('gallery-images').upload(path,file,{upsert:false,contentType:file.type});
    if(upErr)throw upErr;
    const {data:old}=await sb.from('gallery_images').select('storage_path').eq('slot_id',slot).maybeSingle();
    const {error:dbErr}=await sb.from('gallery_images').upsert({slot_id:slot,storage_path:path,caption:'',created_by:currentUser.id,updated_at:new Date().toISOString()},{onConflict:'slot_id'});
    if(dbErr){await sb.storage.from('gallery-images').remove([path]);throw dbErr;}
    if(old?.storage_path)await sb.storage.from('gallery-images').remove([old.storage_path]);
    fileInput.value=''; await loadComments();
  }catch(e){console.error(e);alert('Նկարը չավելացվեց։ '+(e.message||''));}
  finally{btn.disabled=false;delBtn.disabled=false;btn.textContent='⬆️ Ավելացնել';if(tools)tools.querySelector('.gallery-admin-status').textContent='';}
}

async function deleteGalleryImage(slot,btn,tools){
  if(!(mySiteRole==='owner'||mySiteRole==='admin'))return;
  if(!confirm('Ջնջե՞լ այս նկարը։'))return;
  btn.disabled=true; if(tools)tools.querySelector('.gallery-admin-status').textContent='Ջնջվում է...';
  try{
    const {data:row,error}=await sb.from('gallery_images').select('id,storage_path').eq('slot_id',slot).maybeSingle(); if(error)throw error;
    if(!row)return;
    const {error:dbErr}=await sb.from('gallery_images').delete().eq('id',row.id); if(dbErr)throw dbErr;
    if(row.storage_path)await sb.storage.from('gallery-images').remove([row.storage_path]);
    await loadComments();
  }catch(e){alert('Նկարը չջնջվեց։ '+(e.message||''));}
  finally{btn.disabled=false;if(tools)tools.querySelector('.gallery-admin-status').textContent='';}
}
let selectedFriendId=null,privateChatChannel=null,onlineChannel=null,onlineIds=new Set(),privateNicknames={};
async function loadPresence(){
  if(onlineChannel){try{await sb.removeChannel(onlineChannel)}catch(e){} onlineChannel=null}
  onlineIds=new Set();
  if(!currentUser)return;
  const channel=sb.channel('aimrelax-online',{config:{presence:{key:currentUser.id}}});
  onlineChannel=channel;
  const rebuild=()=>{
    const state=channel.presenceState();
    const ids=new Set();
    const users=[];
    Object.values(state).flat().forEach(x=>{
      if(x?.user_id){ids.add(x.user_id); if(!users.some(u=>u.user_id===x.user_id)) users.push(x);}
    });
    onlineIds=ids;
    renderAdminOnlineUsers();
    document.querySelectorAll('#private-friend-picker .friend-row[data-friend-id]').forEach(row=>{const uid=row.dataset.friendId;const st=row.querySelector('.chat-friend-status');if(st)st.textContent=onlineIds.has(uid)?'🟢 Օնլայն':'⚪ Օֆլայն';});
    if(typeof selectedFriendId!=='undefined' && selectedFriendId){
      const nick=privateNicknames[selectedFriendId]||'Ընկեր';
      const title=$('private-chat-title');
      if(title) title.innerHTML='💬 '+esc(nick)+' '+(onlineIds.has(selectedFriendId)?'<span class="online-dot">🟢</span>':'<span class="offline-dot">⚪</span>');
    }
  };
  channel.on('presence',{event:'sync'},rebuild);
  channel.on('presence',{event:'join'},rebuild);
  channel.on('presence',{event:'leave'},rebuild);
  await channel.subscribe(async status=>{
    if(status==='SUBSCRIBED'){
      await channel.track({user_id:currentUser.id,nickname:currentUser.user_metadata?.nickname||currentUser.email?.split('@')[0]||'Օգտատեր',online_at:new Date().toISOString()});
    }
  });
  startLastSeenHeartbeat();
}

function renderAdminOnlineUsers(){
  const box=$('admin-online-users');
  const list=$('admin-online-list');
  const summary=$('admin-online-summary');
  if(!box||!list||!summary)return;
  const allowed=(mySiteRole==='owner'||mySiteRole==='admin');
  box.style.display=allowed?'block':'none';
  if(!allowed)return;

  const q=($(`admin-user-search`)?.value||'').trim().toLowerCase();
  const rows=(adminUsersCache||[]).filter(u=>{
    if(!q)return true;
    return String(u.nickname||'').toLowerCase().includes(q)||String(u.email||'').toLowerCase().includes(q);
  }).sort((a,b)=>{
    const ao=onlineIds.has(a.id)?0:1, bo=onlineIds.has(b.id)?0:1;
    if(ao!==bo)return ao-bo;
    return String(a.nickname||'').localeCompare(String(b.nickname||''),'hy');
  });

  const onlineCount=(adminUsersCache||[]).filter(u=>onlineIds.has(u.id)).length;
  const offlineCount=Math.max(0,(adminUsersCache||[]).length-onlineCount);
  summary.textContent=`Օնլայն՝ ${onlineCount} · Օֆլայն՝ ${offlineCount}`;

  list.innerHTML=rows.length
    ?rows.map(u=>{
      const online=onlineIds.has(u.id);
      return `<div class="admin-online-row"><span class="admin-online-name">${esc(u.nickname||'Օգտատեր')}</span><span class="admin-online-state ${online?'online':'offline'}">${online?'🟢 Օնլայն':'⚪ Օֆլայն'}</span></div>`;
    }).join('')
    :'<div class="loading-text">Օգտատեր չի գտնվել։</div>';
}

async function loadFriendNotifications(){
 if(!currentUser){$('friend-badge').classList.remove('show');$('friend-notify-list').innerHTML='<div class="loading-text">Մուտք գործեք՝ հայտերը տեսնելու համար։</div>';return}
 const {data,error}=await sb.from('friend_requests').select('id,requester_id,status,profiles!friend_requests_requester_id_fkey(nickname)').eq('addressee_id',currentUser.id).eq('status','pending').order('created_at',{ascending:false});
 if(error){$('friend-notify-list').innerHTML='<div class="loading-text">Չհաջողվեց բեռնել հայտերը։</div>';return}
 const count=(data||[]).length;
 $('friend-badge').textContent=count;
 $('friend-badge').classList.toggle('show',count>0);
 $('friend-notify-list').innerHTML=count?(data||[]).map(r=>`<div class="friend-notify-row"><button class="profile-open-btn" onclick="openProfile('${r.requester_id}')">${esc(r.profiles?.nickname||'Օգտատեր')}</button><span class="friend-notify-actions"><button class="friend-accept" onclick="friendActionFromNotify('${r.id}','accepted')">Ընդունել</button><button class="friend-reject" onclick="friendActionFromNotify('${r.id}','rejected')">Մերժել</button></span></div>`).join(''):'<div class="loading-text">Նոր ընկերության հայտ չկա։</div>'
}
window.friendActionFromNotify=async(id,status)=>{const {error}=await sb.from('friend_requests').update({status}).eq('id',id).eq('addressee_id',currentUser.id);if(error){alert('Չհաջողվեց փոխել հայտի կարգավիճակը։');return}await loadFriendNotifications();await loadFriends()};
async function loadFriends(){
 const req=$('friend-requests'),list=$('friends-list');
 if(!currentUser){req.innerHTML='<div class="loading-text">Մուտք գործեք՝ ընկերության հայտերը տեսնելու համար։</div>';list.innerHTML='';return}
 const {data:incoming}=await sb.from('friend_requests').select('id,requester_id,status,profiles!friend_requests_requester_id_fkey(nickname)').eq('addressee_id',currentUser.id).eq('status','pending');
 req.innerHTML=(incoming||[]).map(r=>`<div class="friend-row"><button class="profile-open-btn" onclick="openProfile('${r.requester_id}')">${esc(r.profiles?.nickname||'Օգտատեր')}</button><span class="friend-actions"><button onclick="friendAction('${r.id}','accepted')">Ընդունել</button><button class="danger" onclick="friendAction('${r.id}','rejected')">Մերժել</button></span></div>`).join('')||'<div class="muted">Նոր հայտ չկա։</div>';
 const {data:outgoing}=await sb.from('friend_requests').select('id,addressee_id,status,profiles!friend_requests_addressee_id_fkey(nickname)').eq('requester_id',currentUser.id).eq('status','pending');
 if(outgoing?.length)req.innerHTML+=(outgoing||[]).map(r=>`<div class="friend-row"><button class="profile-open-btn" onclick="openProfile('${r.addressee_id}')">${esc(r.profiles?.nickname||'Օգտատեր')}</button><span class="muted">Ուղարկված է</span></div>`).join('');
 renderFriends();
}
async function renderFriends(){
 if(!currentUser)return;
 const {data:friends}=await sb.from('friend_requests').select('id,requester_id,addressee_id,requester:profiles!friend_requests_requester_id_fkey(nickname,last_seen),addressee:profiles!friend_requests_addressee_id_fkey(nickname,last_seen)').eq('status','accepted').or(`requester_id.eq.${currentUser.id},addressee_id.eq.${currentUser.id}`);
 $('friends-list').innerHTML=(friends||[]).map(r=>{const otherId=r.requester_id===currentUser.id?r.addressee_id:r.requester_id;const other=r.requester_id===currentUser.id?r.addressee:r.requester;const online=onlineIds.has(otherId);const status=online?'🟢 Օնլայն':`⚪ Օֆլայն · ${formatLastSeen(other?.last_seen)}`;return `<div class="friend-row" data-friend-id="${esc(otherId)}"><button class="profile-open-btn" onclick="openProfile('${otherId}')">${esc(other?.nickname||'Ընկեր')}</button><span class="chat-friend-status">${status}</span><span class="friend-actions"><button onclick="openPrivateChat('${otherId}','${esc(other?.nickname||'Ընկեր')}')">CHAT</button><button class="danger" onclick="removeFriend('${r.id}')">Հեռացնել</button></span></div>`}).join('')||'<div class="muted">Դեռ ընկերներ չունեք։</div>';
}
window.friendAction=async(id,status)=>{const {error}=await sb.from('friend_requests').update({status}).eq('id',id);if(!error)loadFriends()};
window.removeFriend=async(id)=>{if(!confirm('Հեռացնե՞լ այս ընկերոջը։'))return;const {error}=await sb.from('friend_requests').delete().eq('id',id);if(!error){closePrivateChat();loadFriends()}else alert('Չհաջողվեց հեռացնել ընկերոջը։')};
let friendTimer;function searchFriends(){clearTimeout(friendTimer);friendTimer=setTimeout(async()=>{if(!currentUser){$('friend-search-results').innerHTML='<div class="loading-text">Նախ մուտք գործեք։</div>';return}const q=$('friend-search').value.trim();if(q.length<2){$('friend-search-results').innerHTML='';return}const {data}=await sb.from('profiles').select('id,nickname').ilike('nickname',`%${q}%`).neq('id',currentUser.id).limit(10);$('friend-search-results').innerHTML=(data||[]).map(p=>`<div class="friend-row"><button class="profile-open-btn" onclick="openProfile('${p.id}')">${esc(p.nickname)}</button><button onclick="sendFriend('${p.id}')">+ Ընկեր</button></div>`).join('')||'<div class="muted">Չգտնվեց։</div>'},250)}$('friend-search').addEventListener('input',searchFriends);
window.sendFriend=async(id)=>{if(!currentUser)return;const {data:existing}=await sb.from('friend_requests').select('id,status,requester_id,addressee_id').or(`and(requester_id.eq.${currentUser.id},addressee_id.eq.${id}),and(requester_id.eq.${id},addressee_id.eq.${currentUser.id})`).limit(1).maybeSingle();if(existing&&existing.status==='accepted'){ $('friend-search-results').innerHTML='<div class="muted">Դուք արդեն ընկերներ եք։</div>';return }if(existing&&existing.status==='pending'){ $('friend-search-results').innerHTML='<div class="muted">Հայտն արդեն ուղարկված է կամ սպասում է։</div>';return }const {error}=await sb.from('friend_requests').insert({requester_id:currentUser.id,addressee_id:id,status:'pending'});$('friend-search-results').innerHTML=error?(error.code==='23505'?'<div class="muted">Հայտն արդեն գոյություն ունի։</div>':`<div class="muted">${esc(error.message)}</div>`):'<div class="muted">Ընկերության հայտը ուղարկվեց ✅</div>';loadFriends()};
window.openProfile=async(id)=>{const {data:p}=await sb.from('profiles').select('id,nickname').eq('id',id).maybeSingle();if(!p)return;$('profile-name').textContent=p.nickname;$('profile-status').innerHTML=onlineIds.has(id)?'<span class="online-dot">🟢 online</span>':'<span class="offline-dot">⚪ offline</span>';const isSelf=currentUser&&id===currentUser.id;$('profile-actions').innerHTML=isSelf?'<div class="muted">Սա ձեր պրոֆիլն է։</div>':`<button onclick="sendFriend('${id}')">+ Ընկեր</button>`;$('profile-modal').classList.add('open');$('profile-modal').setAttribute('aria-hidden','false')};
function closeProfile(){$('profile-modal').classList.remove('open');$('profile-modal').setAttribute('aria-hidden','true')}$('profile-close').onclick=closeProfile;$('profile-modal').onclick=e=>{if(e.target===$('profile-modal'))closeProfile()};
let typingChannel=null,typingTimer=null,isTyping=false,typingRemoteTimer=null;
const CHAT_EMOJIS=['😀','😂','🤣','😊','😍','😘','🥰','😎','😭','😡','🤔','🙏','👍','👏','🔥','🎉','💯','❤️','🧡','💛','💚','💙','💜','😴','😮','😢','😇','🤩','😜','🙌','👌','💪'];
function formatLastSeen(value){
  if(!value)return 'վերջին անգամ՝ անհայտ';
  const d=new Date(value); if(Number.isNaN(d.getTime()))return 'վերջին անգամ՝ անհայտ';
  return 'վերջին անգամ՝ '+d.toLocaleString('hy-AM',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'});
}
function renderEmojiPanel(){
  const panel=$('emoji-panel'); if(!panel||panel.dataset.ready)return;
  panel.innerHTML=CHAT_EMOJIS.map(e=>`<button class="emoji-btn" type="button">${e}</button>`).join('');
  panel.querySelectorAll('.emoji-btn').forEach(btn=>btn.onclick=()=>{const input=$('private-input');input.value+=btn.textContent;input.focus();emitTyping(true)});
  panel.dataset.ready='1';
}
renderEmojiPanel();
$('emoji-toggle-btn').onclick=()=>{renderEmojiPanel();$('emoji-panel').classList.toggle('open');$('emoji-panel').setAttribute('aria-hidden',String(!$('emoji-panel').classList.contains('open')))};

async function updateLastSeen(){
  if(!currentUser)return;
  try{await sb.from('profiles').update({last_seen:new Date().toISOString()}).eq('id',currentUser.id);}catch(e){}
}
let lastSeenTimer=null;
function startLastSeenHeartbeat(){
  clearInterval(lastSeenTimer); updateLastSeen(); lastSeenTimer=setInterval(updateLastSeen,20000);
}

async function loadPrivateChatFriends(){
  if(!currentUser){$('private-friend-picker').innerHTML='<div class="loading-text">Մուտք գործեք՝ անձնական Chat-ից օգտվելու համար։</div>';return}
  const {data:friends,error}=await sb.from('friend_requests').select('requester_id,addressee_id,requester:profiles!friend_requests_requester_id_fkey(nickname,last_seen),addressee:profiles!friend_requests_addressee_id_fkey(nickname,last_seen)').eq('status','accepted').or(`requester_id.eq.${currentUser.id},addressee_id.eq.${currentUser.id}`);
  if(error){$('private-friend-picker').innerHTML='<div class="loading-text">Չհաջողվեց բեռնել ընկերներին։ '+esc(error.message)+'</div>';return}
  privateNicknames={};
  const rows=(friends||[]).map(r=>{
    const id=r.requester_id===currentUser.id?r.addressee_id:r.requester_id;
    const p=r.requester_id===currentUser.id?r.addressee:r.requester;
    const nickname=p?.nickname||'Ընկեր'; privateNicknames[id]=nickname;
    const online=onlineIds.has(id);
    const status=online?'🟢 Օնլայն':`⚪ Օֆլայն · ${formatLastSeen(p?.last_seen)}`;
    return `<div class="friend-row" data-friend-id="${esc(id)}"><button class="profile-open-btn" onclick="openPrivateChat('${id}','${esc(nickname)}')">${esc(nickname)}</button><span class="muted chat-friend-status">${status}</span></div>`;
  }).join('');
  $('private-friend-picker').innerHTML=rows||'<div class="loading-text">Անձնական Chat-ի համար նախ ավելացրեք ընկեր։</div>';
}
async function openPrivateChat(id,nickname){
  if(!currentUser){openModal();return}
  selectedFriendId=id; privateNicknames[id]=nickname;
  try{navigator.serviceWorker?.controller?.postMessage({type:'AIMRELAX_ACTIVE_CHAT',chatId:String(id)});}catch(e){}
  const profile=await sb.from('profiles').select('nickname,last_seen').eq('id',id).maybeSingle();
  if(profile.data?.nickname){nickname=profile.data.nickname;privateNicknames[id]=nickname;}
  $('private-chat-title').innerHTML='💬 '+esc(nickname)+' '+(onlineIds.has(id)?'<span class="online-dot">🟢</span>':'<span class="offline-dot">⚪</span>');
  $('private-chat-popup').classList.add('open');$('private-chat-popup').setAttribute('aria-hidden','false');$('private-friend-picker').style.display='none';
  $('private-input').disabled=false;$('private-send-btn').disabled=false;$('voice-record-btn').disabled=false;$('chat-file-btn').disabled=false;
  if(privateChatChannel)await sb.removeChannel(privateChatChannel);
  if(typingChannel)await sb.removeChannel(typingChannel);
  privateChatChannel=sb.channel('private-chat-'+[currentUser.id,id].sort().join('-'))
    .on('postgres_changes',{event:'INSERT',schema:'public',table:'private_messages'},p=>handleRealtimePrivateMessage({eventType:'INSERT',new:p.new},id))
    .on('postgres_changes',{event:'UPDATE',schema:'public',table:'private_messages'},p=>handleRealtimePrivateMessage({eventType:'UPDATE',new:p.new,old:p.old},id))
    .on('postgres_changes',{event:'DELETE',schema:'public',table:'private_messages'},p=>handleRealtimePrivateMessage({eventType:'DELETE',old:p.old},id))
    .subscribe();
  await loadPrivateMessages();
  typingChannel=sb.channel('private-typing-'+[currentUser.id,id].sort().join('-'))
    .on('broadcast',{event:'typing'},p=>{
      if(p.payload?.user_id!==currentUser.id){showTyping(!!p.payload?.typing);}
    }).subscribe();
}
function showTyping(show){
  const el=$('typing-indicator'); if(!el)return; el.classList.toggle('show',show);
  clearTimeout(typingRemoteTimer); if(show)typingRemoteTimer=setTimeout(()=>el.classList.remove('show'),2500);
}
async function emitTyping(force=false){
  if(!typingChannel||!selectedFriendId)return;
  if(!force && isTyping)return;
  isTyping=true;
  try{await typingChannel.send({type:'broadcast',event:'typing',payload:{user_id:currentUser.id,typing:true}});}catch(e){}
  clearTimeout(typingTimer);typingTimer=setTimeout(async()=>{isTyping=false;try{await typingChannel.send({type:'broadcast',event:'typing',payload:{user_id:currentUser.id,typing:false}})}catch(e){}},1200);
}
async function markChatRead(){
  if(!currentUser||!selectedFriendId)return;
  try{await sb.from('private_messages').update({read_at:new Date().toISOString()}).eq('sender_id',selectedFriendId).eq('receiver_id',currentUser.id).is('read_at',null);}catch(e){}
}
let privateMessageIds=new Set();
const privateMediaUrlCache=new Map();
let privateMessagesLoading=false;
let privateMessagesRequestToken=0;

function isNearBottom(el){
  if(!el)return true;
  return (el.scrollHeight-el.scrollTop-el.clientHeight)<90;
}

async function loadPrivateMessages(options={}){
  if(!selectedFriendId||!currentUser)return;
  if(privateMessagesLoading && !options.force)return;
  const box=$('private-messages');
  const wasNearBottom=isNearBottom(box);
  const token=++privateMessagesRequestToken;
  privateMessagesLoading=true;
  try{
    const {data,error}=await sb.from('private_messages')
      .select('id,sender_id,receiver_id,message,message_type,audio_path,created_at,deleted_at,delivered_at,read_at,attachment_path,attachment_name,attachment_mime,attachment_size')
      .or(`and(sender_id.eq.${currentUser.id},receiver_id.eq.${selectedFriendId}),and(sender_id.eq.${selectedFriendId},receiver_id.eq.${currentUser.id})`)
      .order('created_at',{ascending:true}).limit(500);
    if(token!==privateMessagesRequestToken)return;
    if(error){if(!box.children.length)box.innerHTML='<div class="loading-text">Չհաջողվեց բեռնել Chat-ը։ '+esc(error.message)+'</div>';return;}
    const rows=data||[];
    box.innerHTML='';
    privateMessageIds=new Set(rows.map(m=>String(m.id)));
    // Բոլոր հաղորդագրությունները կառուցվում են զուգահեռ, որպեսզի 200 հաղորդագրություն հերթով չսպասի storage-ին։
    const nodes=await Promise.all(rows.map(m=>buildPrivateMessageElement(m)));
    if(token!==privateMessagesRequestToken)return;
    nodes.forEach(n=>n&&box.appendChild(n));
    if(wasNearBottom||!box.children.length)box.scrollTop=box.scrollHeight;
    await markChatRead();
  }finally{privateMessagesLoading=false;}
}

async function appendPrivateMessageOnce(m){
  if(!m?.id)return;
  const id=String(m.id);
  const box=$('private-messages');
  if(!box)return;
  if(privateMessageIds.has(id)||box.querySelector(`[data-message-id="${CSS.escape(id)}"]`))return;
  privateMessageIds.add(id);
  try{
    const node=await buildPrivateMessageElement(m);
    if(!node)return;
    if(box.querySelector(`[data-message-id="${CSS.escape(id)}"]`))return;
    box.appendChild(node);
    box.scrollTop=box.scrollHeight;
  }catch(e){
    privateMessageIds.delete(id);
    console.error('AIMRELAX append private message failed:',e);
  }
}

async function handleRealtimePrivateMessage(payload,chatUserId){
  const m=payload?.new||payload?.old;
  if(!m||!currentUser||!selectedFriendId)return;
  if(!((m.sender_id===currentUser.id&&m.receiver_id===chatUserId)||(m.sender_id===chatUserId&&m.receiver_id===currentUser.id)))return;
  const box=$('private-messages');
  const id=String(m.id);
  const existing=box.querySelector(`[data-message-id="${CSS.escape(id)}"]`);
  if(payload.eventType==='DELETE'){
    existing?.remove();privateMessageIds.delete(id);return;
  }
  if(existing){
    // Read receipt-ը թարմացնում ենք միայն կոնկրետ հաղորդագրության վրա, ոչ թե ամբողջ Chat-ը վերաբեռնելով։
    if(m.read_at && m.sender_id===currentUser.id){
      const check=existing.querySelector('.read-check');if(check)check.textContent='✓✓';
    }
    if(m.deleted_at){
      const replacement=await buildPrivateMessageElement(m);
      if(replacement)existing.replaceWith(replacement);
    }
    return;
  }
  const wasNearBottom=isNearBottom(box);
  if(privateMessageIds.has(id)||existing)return;
  privateMessageIds.add(id);
  const node=await buildPrivateMessageElement(m);
  if(!node){privateMessageIds.delete(id);return;}
  if(!box.querySelector(`[data-message-id="${CSS.escape(id)}"]`))box.appendChild(node);
  if(wasNearBottom)box.scrollTop=box.scrollHeight;
  if(m.receiver_id===currentUser.id)await markChatRead();
}

async function deletePrivateMessage(id){
  if(!currentUser)return;
  const {data:msg}=await sb.from('private_messages').select('id,sender_id,audio_path,attachment_path').eq('id',id).eq('sender_id',currentUser.id).maybeSingle();
  if(!msg){$('private-status').textContent='Միայն ուղարկողը կարող է ջնջել այս հաղորդագրությունը։';return;}
  if(!confirm('Ջնջե՞լ հաղորդագրությունը երկուսիդ մոտ։'))return;
  if(msg.audio_path)await sb.storage.from('chat-audio').remove([msg.audio_path]);
  if(msg.attachment_path)await sb.storage.from('chat-files').remove([msg.attachment_path]);
  const {error}=await sb.from('private_messages').update({deleted_at:new Date().toISOString(),audio_path:null,attachment_path:null,attachment_name:null,attachment_mime:null,attachment_size:null}).eq('id',id).eq('sender_id',currentUser.id);
  $('private-status').textContent=error?'Չհաջողվեց ջնջել։ '+error.message:'Ջնջվեց երկուսիդ մոտ ✅';
  if(!error)await loadPrivateMessages({force:true,rebuild:true});
}
window.deletePrivateMessage=deletePrivateMessage;
async function getChatSignedUrl(bucket,path){
  const key=bucket+'|'+path;
  const cached=privateMediaUrlCache.get(key);
  if(cached && cached.expires>Date.now()+120000)return cached.url;
  const {data,error}=await sb.storage.from(bucket).createSignedUrl(path,3600);
  if(error||!data?.signedUrl)return null;
  privateMediaUrlCache.set(key,{url:data.signedUrl,expires:Date.now()+3300000});
  return data.signedUrl;
}
async function buildPrivateMessageElement(m){
  const d=document.createElement('div'); d.className='private-message'; d.dataset.messageId=m.id;
  const mine=m.sender_id===currentUser?.id;
  let body='';
  if(m.deleted_at){
    body='<p class="message-deleted">🗑️ Հաղորդագրությունը ջնջվել է</p>';
  }else if(m.message_type==='audio'&&m.audio_path){
    const url=await getChatSignedUrl('chat-audio',m.audio_path);
    body=!url?'<span class="muted">🔊 Ձայնը հասանելի չէ</span>':`<audio class="voice-audio" controls preload="metadata" src="${esc(url)}"></audio>`;
  }else if(m.attachment_path){
    const url=await getChatSignedUrl('chat-files',m.attachment_path);
    if(!url)body='<span class="muted">📎 Ֆայլը հասանելի չէ</span>';
    else if((m.attachment_mime||'').startsWith('image/'))body=`<img class="chat-image" loading="lazy" src="${esc(url)}" alt="Նկար">`;
    else if((m.attachment_mime||'').startsWith('video/'))body=`<video class="chat-video" controls preload="metadata" src="${esc(url)}"></video>`;
    else body=`<a class="chat-file" href="${esc(url)}" target="_blank" rel="noopener">📎 ${esc(m.attachment_name||'Ֆայլ')}</a>`;
  }else body=`<p>${esc(m.message||'')}</p>`;
  const checks=mine&&!m.deleted_at?(m.read_at?'✓✓':'✓'):'';
  const deleteBtn=mine&&!m.deleted_at?`<div class="message-actions"><button class="message-delete-btn" type="button">🗑️ Ջնջել</button></div>`:'';
  const senderNick=mine?'Դուք':(privateNicknames[m.sender_id]||'Ընկեր');
  d.innerHTML=`<strong>${esc(senderNick)}</strong><small class="muted"> ${new Date(m.created_at).toLocaleString('hy-AM')}</small>${body}<span class="message-meta">${mine?`<span class="read-check">${checks}</span>`:''}</span>${deleteBtn}`;
  d.onclick=e=>{if(e.target.closest('.message-delete-btn'))return;document.querySelectorAll('.private-message.selected').forEach(x=>x.classList.remove('selected'));d.classList.add('selected');};
  d.querySelector('.message-delete-btn')?.addEventListener('click',()=>deletePrivateMessage(m.id));
  return d;
}
async function addPrivateMessage(m){
  const node=await buildPrivateMessageElement(m);if(!node)return;
  $('private-messages').appendChild(node);
  $('private-messages').scrollTop=$('private-messages').scrollHeight;
}

let voiceRecorder=null,voiceChunks=[],voiceStream=null,voiceStartedAt=0;
const CHAT_MAX_FILE_SIZE=50*1024*1024;

async function uploadPrivateAttachment(file){
  if(!currentUser||!selectedFriendId||!file)return;
  if(file.size>CHAT_MAX_FILE_SIZE){$('private-status').textContent='Ֆայլը չափազանց մեծ է։ Առավելագույնը 50 MB։';return;}
  const safeName=(file.name||'file').replace(/[^a-zA-Z0-9._-]/g,'_').slice(0,120)||'file';
  const path=`${currentUser.id}/${selectedFriendId}/${Date.now()}_${crypto.randomUUID()}_${safeName}`;
  $('private-status').textContent='Ֆայլը բեռնվում է…';
  try{
    const up=await sb.storage.from('chat-files').upload(path,file,{contentType:file.type||'application/octet-stream',upsert:false});
    if(up.error)throw up.error;
    const {data:sent,error}=await sb.from('private_messages').insert({sender_id:currentUser.id,receiver_id:selectedFriendId,message:(file.name||'Ֆայլ').slice(0,1000),message_type:(file.type||'').startsWith('image/')?'image':((file.type||'').startsWith('video/')?'video':'file'),audio_path:null,attachment_path:path,attachment_name:file.name||'Ֆայլ',attachment_mime:file.type||'application/octet-stream',attachment_size:file.size,delivered_at:new Date().toISOString()}).select('id,sender_id,receiver_id,message,message_type,audio_path,created_at,deleted_at,delivered_at,read_at,attachment_path,attachment_name,attachment_mime,attachment_size').single();
    if(error){await sb.storage.from('chat-files').remove([path]);throw error;}
    $('private-status').textContent='';if(sent){const id=String(sent.id);const exists=$('private-messages')?.querySelector(`[data-message-id=\"${CSS.escape(id)}\"]`);if(!exists){const node=await buildPrivateMessageElement(sent);if(node){$('private-messages').appendChild(node);$('private-messages').scrollTop=$('private-messages').scrollHeight;}}privateMessageIds.add(id);}
  }catch(e){$('private-status').textContent='Չհաջողվեց ուղարկել ֆայլը։ '+(e.message||e);}
}
async function handleChatFiles(files){for(const file of Array.from(files||[]))await uploadPrivateAttachment(file);$('chat-file-input').value='';}

let voiceTimer=null;
let voiceSeconds=0;
function resetVoiceTimer(){clearInterval(voiceTimer);voiceTimer=null;voiceSeconds=0;const el=$('voice-recording-time');if(el)el.textContent='0:00';}
async function startVoiceRecording(){
  if(!currentUser||!selectedFriendId)return;
  if(!navigator.mediaDevices?.getUserMedia||!window.MediaRecorder){$('private-status').textContent='Այս browser-ը ձայնագրություն չի աջակցում։';return;}
  try{
    voiceStream=await navigator.mediaDevices.getUserMedia({audio:true});
    const preferred=['audio/webm;codecs=opus','audio/webm','audio/mp4','audio/ogg;codecs=opus'];
    const mime=preferred.find(x=>MediaRecorder.isTypeSupported?.(x))||'';
    voiceRecorder=new MediaRecorder(voiceStream,mime?{mimeType:mime}:undefined);
    voiceChunks=[];voiceStartedAt=Date.now();
    voiceRecorder.ondataavailable=e=>{if(e.data?.size)voiceChunks.push(e.data);};
    voiceRecorder.onstop=async()=>{
      const duration=Date.now()-voiceStartedAt;resetVoiceTimer();const type=voiceRecorder?.mimeType||mime||'audio/webm';
      const blob=new Blob(voiceChunks,{type});voiceStream?.getTracks().forEach(t=>t.stop());voiceStream=null;voiceRecorder=null;
      $('voice-record-btn').classList.remove('recording');$('voice-record-btn').textContent='🎙️';$('voice-cancel-btn').style.display='none';$('voice-recording-status').style.display='none';
      if(duration<500||blob.size<1000){$('private-status').textContent='Ձայնագրությունը շատ կարճ է։';return;}
      await sendVoiceBlob(blob,type);
    };
    voiceRecorder.start(250);voiceSeconds=0;$('voice-recording-time').textContent='0:00';$('voice-record-btn').classList.add('recording');$('voice-record-btn').textContent='⏺️';$('voice-cancel-btn').style.display='inline-block';$('voice-recording-status').style.display='block';$('private-status').textContent='Ձայնագրումը սկսված է…';clearInterval(voiceTimer);voiceTimer=setInterval(()=>{voiceSeconds++;const m=Math.floor(voiceSeconds/60);const sec=String(voiceSeconds%60).padStart(2,'0');$('voice-recording-time').textContent=m+':'+sec;},1000);
  }catch(e){resetVoiceTimer();voiceStream?.getTracks().forEach(t=>t.stop());voiceStream=null;voiceRecorder=null;$('private-status').textContent='Չհաջողվեց միացնել խոսափողը։ '+(e.message||e);}
}
function stopVoiceRecording(cancel=false){
  if(!voiceRecorder)return;
  if(cancel){const r=voiceRecorder;voiceRecorder=null;r.onstop=null;try{r.stop()}catch(e){}resetVoiceTimer();voiceStream?.getTracks().forEach(t=>t.stop());voiceStream=null;voiceChunks=[];$('voice-record-btn').classList.remove('recording');$('voice-record-btn').textContent='🎙️';$('voice-cancel-btn').style.display='none';$('voice-recording-status').style.display='none';$('private-status').textContent='';return;}
  try{voiceRecorder.stop()}catch(e){}
}
async function sendVoiceBlob(blob,mime){
  const ext=mime.includes('mp4')?'m4a':mime.includes('ogg')?'ogg':'webm';const path=`${currentUser.id}/${selectedFriendId}/${Date.now()}_${crypto.randomUUID()}.${ext}`;
  $('private-status').textContent='Ձայնը բեռնվում է…';$('voice-record-btn').disabled=true;
  try{const up=await sb.storage.from('chat-audio').upload(path,blob,{contentType:mime,upsert:false});if(up.error)throw up.error;const {data:sent,error}=await sb.from('private_messages').insert({sender_id:currentUser.id,receiver_id:selectedFriendId,message:'🎤 Ձայնային հաղորդագրություն',message_type:'audio',audio_path:path,delivered_at:new Date().toISOString()}).select('id,sender_id,receiver_id,message,message_type,audio_path,created_at,deleted_at,delivered_at,read_at').single();if(error){await sb.storage.from('chat-audio').remove([path]);throw error;}$('private-status').textContent='';if(sent)await appendPrivateMessageOnce(sent);}catch(e){$('private-status').textContent='Չհաջողվեց ուղարկել ձայնը։ '+(e.message||e);}finally{$('voice-record-btn').disabled=false;}
}

async function sendPrivate(){
  if(!currentUser||!selectedFriendId)return;
  const input=$('private-input'),message=input.value.trim(); if(!message)return;
  const {data,error}=await sb.from('private_messages').insert({sender_id:currentUser.id,receiver_id:selectedFriendId,message,message_type:'text',audio_path:null,delivered_at:new Date().toISOString()}).select('id,sender_id,receiver_id,message,message_type,audio_path,created_at,deleted_at,delivered_at,read_at').single();
  $('private-status').textContent=error?'Չհաջողվեց ուղարկել։ '+error.message:'';
  if(!error){input.value='';isTyping=false;clearTimeout(typingTimer);try{await typingChannel?.send({type:'broadcast',event:'typing',payload:{user_id:currentUser.id,typing:false}})}catch(e){} if(data)await appendPrivateMessageOnce(data);}
}
function closePrivateChat(){
  if(typeof voiceRecorder !== 'undefined' && voiceRecorder) stopVoiceRecording(true); clearTimeout(typingTimer);clearTimeout(typingRemoteTimer);isTyping=false;
  selectedFriendId=null;try{navigator.serviceWorker?.controller?.postMessage({type:'AIMRELAX_ACTIVE_CHAT',chatId:null});}catch(e){};showTyping(false);
  $('private-chat-popup').classList.remove('open');$('private-chat-popup').setAttribute('aria-hidden','true');$('private-chat-title').textContent='💬 Անձնական Chat';$('private-friend-picker').style.display='block';$('private-input').disabled=true;$('private-send-btn').disabled=true;$('voice-record-btn').disabled=true;$('chat-file-btn').disabled=true;$('voice-cancel-btn').style.display='none';$('private-messages').innerHTML='<div class="loading-text">Բացեք ընկերոջ CHAT-ը՝ զրույցը սկսելու համար։</div>';$('emoji-panel').classList.remove('open');
  if(privateChatChannel){sb.removeChannel(privateChatChannel);privateChatChannel=null} if(typingChannel){sb.removeChannel(typingChannel);typingChannel=null}
}
$('private-chat-fab').onclick=async()=>{if(!currentUser){openModal();return}const open=$('private-chat-popup').classList.toggle('open');$('private-chat-popup').setAttribute('aria-hidden',String(!open));if(open){closePrivateChat();$('private-chat-popup').classList.add('open');$('private-chat-popup').setAttribute('aria-hidden','false');await loadPrivateChatFriends()}};
$('private-chat-close').onclick=closePrivateChat;$('private-send-btn').onclick=sendPrivate;
$('chat-file-btn').onclick=()=>$('chat-file-input').click();
$('chat-file-input').addEventListener('change',e=>handleChatFiles(e.target.files));
$('voice-record-btn').onclick=()=>voiceRecorder?stopVoiceRecording(false):startVoiceRecording();
$('voice-cancel-btn').onclick=()=>stopVoiceRecording(true);
$('private-input').addEventListener('input',()=>{emitTyping();});
$('private-input').addEventListener('focus',markChatRead);
$('private-input').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();sendPrivate()}});


async function refreshUser(){
  try{
    const {data:{user},error}=await sb.auth.getUser();
    if(error) throw error;
    currentUser=user||null;
    const nick=user?(user.user_metadata?.nickname||user.email?.split('@')[0]||'Օգտատեր'):'';
    $('account-open-btn').textContent=user?'👤 '+nick:'ՄՈՒՏՔ / ԳՐԱՆՑՈՒՄ';
    $('account-open-btn').classList.toggle('user-logo',!!user);
    $('header-logout-btn').style.display=user?'inline-block':'none';
    const adminBtn=$('admin-menu-btn');
    const isOwner=!!(user && user.id==='5f1c951f-1e76-4f82-9849-46becf038b55');
    if(adminBtn) { adminBtn.dataset.owner = isOwner ? '1' : '0'; adminBtn.style.setProperty('display',(isOwner?'block':'none'),'important'); }
    if(!user){$('user-dropdown').classList.remove('open','show');$('user-dropdown').setAttribute('aria-hidden','true');}
    if(user){$('modal-nickname').textContent=nick;$('settings-nickname').value=nick;$('settings-email').value=user.email||'';}
    const jobs=[loadPlayers,loadVotes,loadComments,loadFriends,loadFriendNotifications,loadPresence];
    for(const job of jobs){try{await job();}catch(e){console.warn('AIMRELAX optional load failed:',e);}}
    try{await loadMySiteRole();}catch(e){console.warn('AIMRELAX role load failed:',e);}
    // Re-apply owner visibility after async role lookup so RPC cannot hide the Owner button.
    if(adminBtn) { adminBtn.dataset.owner = isOwner ? '1' : '0'; adminBtn.style.setProperty('display',(isOwner?'block':'none'),'important'); }
    if(user){ startAimrelaxNotificationCenter(); } else { stopAimrelaxNotificationCenter(); }
  }catch(e){ console.error('AIMRELAX refreshUser failed:',e); }
}
sb.auth.onAuthStateChange((event,session)=>{
  if(event==='SIGNED_OUT'){
    stopAimrelaxNotificationCenter();
    currentUser=null;
    mySiteRole=null;
    $('header-logout-btn').style.display='none';
    $('admin-menu-btn').style.setProperty('display','none','important');
    $('account-open-btn').textContent='ՄՈՒՏՔ / ԳՐԱՆՑՈՒՄ';
    $('account-open-btn').classList.remove('user-logo');
    $('user-dropdown').classList.remove('open','show');
    $('user-dropdown').setAttribute('aria-hidden','true');
  }
  if(event==='SIGNED_IN'||event==='SIGNED_OUT') setTimeout(refreshUser,0);
  if(event==='SIGNED_IN') setTimeout(refreshPushStatus,1000);
});
async function openChatFromNotification(){
  const params=new URLSearchParams(location.search);
  const chatId=params.get('chat');
  if(!chatId) return;
  try{
    if(!currentUser){
      await new Promise(resolve=>{let done=false;const finish=()=>{if(!done){done=true;resolve();}};setTimeout(finish,2500);const check=setInterval(()=>{if(currentUser){clearInterval(check);finish();}},50);});
    }
    if(!currentUser) return;
    await openPrivateChat(chatId,'Ընկեր');
    history.replaceState({},'',location.pathname+location.hash);
  }catch(e){console.error('Notification chat open failed:',e);}
  finally{
    document.documentElement.classList.remove('notification-route');
    try{
      if(location.search.includes('chat=')){
        history.replaceState({},'',location.pathname+location.hash);
      }
    }catch(e){}
  }
}

/* Notification click while the site is already open: stay on the current page. */
navigator.serviceWorker?.ready.then(reg=>{try{reg.update();}catch(e){}}).catch(()=>{});

navigator.serviceWorker?.ready
  .then(reg=>{
    try{ reg.update(); }catch(e){}
  })
  .catch(()=>{});

navigator.serviceWorker?.addEventListener('message',async event=>{
  const data=event.data||{};
  if(data.type==='AIMRELAX_QUERY_ACTIVE_CHAT'){
    try{
      const activeChatId=(currentUser&&$('private-chat-popup')?.classList.contains('open')&&selectedFriendId)
        ?String(selectedFriendId)
        :null;
      // Service Worker sends a MessagePort for the reply.  event.source.postMessage()
      // does NOT reply through that port, so the old handshake always timed out.
      const port=event.ports?.[0];
      if(port){
        port.postMessage({type:'AIMRELAX_ACTIVE_CHAT_STATE',chatId:activeChatId});
        try{port.close();}catch(e){}
      }else if(event.source){
        // Fallback for browsers that don't expose the transferred port.
        event.source.postMessage({type:'AIMRELAX_ACTIVE_CHAT_STATE',chatId:activeChatId});
      }
    }catch(e){console.error('AIMRELAX active chat reply failed:',e);}
    return;
  }
  if(data.type!=='OPEN_PRIVATE_CHAT'||!data.chatId)return;
  try{
    if(!currentUser) await refreshUser();
    if(!currentUser)return;
    await openPrivateChat(data.chatId,privateNicknames?.[data.chatId]||'Ընկեր');
  }catch(e){
    console.error('Notification chat message failed:',e);
  }
});

/* Initial page load: only process a ?chat= route when one actually exists.
   Do not delay normal page startup waiting for the notification route. */
(function(){
  const hasChatRoute = new URLSearchParams(location.search).has('chat');
  if(hasChatRoute){
    refreshUser().then(()=>openChatFromNotification()).catch(()=>{
      document.documentElement.classList.remove('notification-route');
    });
  }else{
    refreshUser().catch(()=>{});
  }
})();

(function(){
  const wrap=document.getElementById('account-logo-wrap');
  const btn=document.getElementById('account-btn');
  const menu=document.getElementById('account-logo-menu');
  const settings=document.getElementById('logo-settings-menu-btn');
  if(!wrap||!btn||!menu||!settings)return;
  btn.addEventListener('click',function(e){
    e.preventDefault(); e.stopPropagation();
    if(typeof currentUser !== 'undefined' && currentUser){
      menu.classList.toggle('show');
      menu.setAttribute('aria-hidden',menu.classList.contains('show')?'false':'true');
    } else if(typeof showPanel==='function'){
      showPanel('auth-panel');
    }
  });
  settings.addEventListener('click',function(e){
    e.preventDefault(); e.stopPropagation();
    menu.classList.remove('show');
    if(typeof openAccountSettings==='function'){openAccountSettings();}
    else if(typeof showPanel==='function'){showPanel('account-settings-panel');}
  });
  document.addEventListener('click',function(e){if(!wrap.contains(e.target))menu.classList.remove('show');});
})();



/* AIMRELAX CLAN APPLICATIONS — 30 QUESTIONS */
(function(){
  const modal=$('clan-application-modal');
  const form=$('clan-application-form');
  const status=$('clan-application-status');
  const note=$('clan-application-auth-note');
  const close=()=>{modal.classList.remove('open');modal.setAttribute('aria-hidden','true');status.textContent='';status.className='clan-application-status';};
  const otherMap={13:'Այլ',14:'Ազատ պատասխան',15:'Այլ',23:'Այլ',30:'Այլ'};
  function setupOther(n){
    const select=$('clan-q'+n), input=$('clan-q'+n+'-other');
    if(!select||!input)return;
    const sync=()=>{const show=select.value===otherMap[n];input.style.display=show?'block':'none';input.required=show;if(!show)input.value='';};
    select.addEventListener('change',sync);sync();
  }
  [13,14,15,23,30].forEach(setupOther);
  function getAnswer(n){
    const el=$('clan-q'+n);
    const other=$('clan-q'+n+'-other');
    if(other && el.value===otherMap[n]) return other.value.trim();
    return el.value.trim();
  }
  function open(){
    modal.classList.add('open');modal.setAttribute('aria-hidden','false');
    status.textContent='';status.className='clan-application-status';
    if(!currentUser){
      note.textContent='🔐 Հայտ ուղարկելու համար անհրաժեշտ է գրանցվել և մուտք գործել։';
      form.style.display='none'; return;
    }
    form.style.display='flex';
    note.textContent='Բոլոր 30 հարցերին պատասխանելը պարտադիր է։';
    $('clan-q1').value=currentUser.user_metadata?.nickname||'';
    checkExisting();
  }
  async function checkExisting(){
    if(!currentUser)return;
    const {data,error}=await sb.from('clan_applications').select('status').eq('user_id',currentUser.id).in('status',['pending','accepted']).order('created_at',{ascending:false}).limit(1).maybeSingle();
    if(error){console.warn('Clan application status:',error);return;}
    if(data?.status==='pending'){status.textContent='⏳ Դուք արդեն ունեք սպասող հայտ։';status.classList.add('clan-application-error');form.style.display='none';}
    else if(data?.status==='accepted'){status.textContent='🎉 Դուք արդեն ընդունված եք AIMRELAX կլան։';status.classList.add('clan-application-success');form.style.display='none';}
  }
  $('join-clan-btn')?.addEventListener('click',open);
  $('clan-application-close')?.addEventListener('click',close);
  modal?.addEventListener('click',e=>{if(e.target===modal)close();});
  form?.addEventListener('submit',async e=>{
    e.preventDefault();
    if(!currentUser){note.textContent='🔐 Նախ մուտք գործեք։';form.style.display='none';return;}
    const answers={};
    for(let n=1;n<=30;n++){
      const value=getAnswer(n);
      if(!value){const el=$('clan-q'+n+'-other')||$('clan-q'+n);el.focus();status.textContent='Խնդրում ենք պատասխանել բոլոր 30 հարցերին։';status.className='clan-application-status clan-application-error';return;}
      answers['q'+n]=value;
    }
    const btn=$('clan-application-submit');btn.disabled=true;status.textContent='Հայտը ուղարկվում է...';status.className='clan-application-status';
    try{
      const {data,error}=await sb.rpc('submit_clan_application',answers);
      if(error)throw error;
      status.textContent='✅ Հայտը հաջողությամբ ուղարկվեց։ Սպասեք Admin-ի պատասխանին։';status.classList.add('clan-application-success');form.reset();$('clan-q1').value=currentUser.user_metadata?.nickname||'';[13,14,15,23,30].forEach(setupOther);
    }catch(err){
      status.textContent='Չհաջողվեց ուղարկել հայտը։ '+(err?.message||err);status.className='clan-application-status clan-application-error';
    }finally{btn.disabled=false;}
  });
})();



/* AIMRELAX ADMIN PANEL */
let mySiteRole = null;
let adminUsersCache = [];
async function loadMySiteRole(){
  const btn=$('admin-menu-btn');
  if(!currentUser){
    mySiteRole=null;
    if(btn) btn.style.setProperty('display','none','important');
    return;
  }
  const isOwner = currentUser.id === '5f1c951f-1e76-4f82-9849-46becf038b55';
  let role = null;
  try{
    const {data,error}=await sb.rpc('get_my_site_role');
    if(!error && data) role=String(data).toLowerCase();
  }catch(e){ console.warn('role rpc failed',e); }
  if(isOwner) role='owner';
  mySiteRole=role;
  try{await loadGalleryImages();}catch(e){}
  const allowed = role==='owner' || role==='admin';
  if(btn){
    btn.dataset.owner=isOwner?'1':'0';
    btn.style.setProperty('display',allowed?'block':'none','important');
    btn.style.setProperty('visibility',allowed?'visible':'hidden','important');
    btn.style.setProperty('opacity',allowed?'1':'0','important');
  }
}
async function openAdminPanel(){
  if(mySiteRole!=='owner' && mySiteRole!=='admin'){return;}
  $('admin-modal').classList.add('open');$('admin-modal').setAttribute('aria-hidden','false');
  await loadAdminUsers();
}
function closeAdminPanel(){$('admin-modal').classList.remove('open');$('admin-modal').setAttribute('aria-hidden','true');}
async function loadAdminUsers(){
  const status=$('admin-status');status.textContent='';
  const {data,error}=await sb.rpc('list_site_users');
  if(error){$('admin-user-list').innerHTML='<div class="loading-text">Չհաջողվեց բեռնել օգտատերերին։</div>';status.textContent=error.message;return;}
  adminUsersCache=data||[];renderAdminUsers();renderAdminOnlineUsers();
}
function renderAdminUsers(){
  const q=($('admin-user-search').value||'').trim().toLowerCase();
  const rows=adminUsersCache.filter(u=>!q || String(u.nickname||'').toLowerCase().includes(q)||String(u.email||'').toLowerCase().includes(q));
  $('admin-user-list').innerHTML=rows.map(u=>{
    const isMe=u.id===currentUser?.id;
    const canManage=mySiteRole==='owner' && !isMe;
    const role=u.role||'user';
    const roleBtn=canManage ? (role==='admin' ? `<button class="danger" onclick="changeSiteRole('${u.id}','user')">Հանել ադմինից</button>` : `<button onclick="changeSiteRole('${u.id}','admin')">Դարձնել ադմին</button>`) : '';
    const canDelete=(mySiteRole==='owner'||mySiteRole==='admin') && !isMe && role!=='owner' && (mySiteRole==='owner' || role==='user');
    const deleteBtn=canDelete ? `<button class="danger" type="button" data-delete-user="${u.id}">🗑️ Ջնջել</button>` : '';
    const btn=roleBtn+deleteBtn;
    return `<div class="admin-user-row"><div class="admin-user-info"><strong>${esc(u.nickname||'Օգտատեր')}${isMe?' (Դուք)':''}</strong><small>${esc(u.email||'')}</small><div class="admin-role">Դեր՝ ${role==='owner'?'👑 Owner':role==='admin'?'🛡️ Admin':'👤 User'}</div></div><div class="admin-user-actions">${btn}</div></div>`;
  }).join('') || '<div class="loading-text">Օգտատեր չի գտնվել։</div>';
  document.querySelectorAll('[data-delete-user]').forEach(btn=>{
    btn.addEventListener('click',()=>deleteSiteUser(btn.dataset.deleteUser));
  });
}
async function deleteSiteUser(id){
  if(mySiteRole!=='owner' && mySiteRole!=='admin') return;
  if(!id || id===currentUser?.id) return;
  const target=adminUsersCache.find(u=>String(u.id)===String(id));
  const name=target?.nickname||target?.email||'այս օգտատիրոջը';
  if(!window.confirm(`Վստա՞հ եք, որ ցանկանում եք ամբողջությամբ ջնջել «${name}» օգտատիրոջ հաշիվը։\n\nԱյս գործողությունը չի կարող հետ վերադարձվել։`)) return;
  const status=$('admin-status');
  status.textContent='Հաշիվը ջնջվում է...';
  try{
    const {data,error}=await sb.rpc('delete_site_user',{target_user_id:id});
    if(error) throw error;
    status.textContent=data||'Օգտատերը ջնջվեց։';
    await loadAdminUsers();
  }catch(e){
    console.error('Delete site user failed:',e);
    status.textContent='Չհաջողվեց ջնջել օգտատիրոջը։ '+(e?.message||e);
  }
}
window.deleteSiteUser=deleteSiteUser;

async function changeSiteRole(id,role){
  if(mySiteRole!=='owner'){return;}
  const status=$('admin-status');status.textContent='Փոփոխվում է...';
  const {data,error}=await sb.rpc('set_site_user_role',{target_user_id:id,new_role:role});
  if(error){status.textContent=error.message;return;}
  status.textContent=data||'Պահպանվեց։';
  await loadAdminUsers();
}
$('clan-applications-admin-btn')?.addEventListener('click',()=>{
  if(mySiteRole!=='owner' && mySiteRole!=='admin')return;
  window.location.href='clan-applications.html';
});
$('admin-menu-btn').addEventListener('click',()=>{ $('user-dropdown').classList.remove('open','show'); $('user-dropdown').setAttribute('aria-hidden','true'); openAdminPanel(); });
$('admin-close').addEventListener('click',closeAdminPanel);
$('admin-modal').addEventListener('click',e=>{if(e.target.id==='admin-modal')closeAdminPanel();});
$('admin-user-search').addEventListener('input',()=>{renderAdminUsers();renderAdminOnlineUsers();});
let adminPresenceRefreshTimer=null;
function startAdminPresenceRefresh(){
  clearInterval(adminPresenceRefreshTimer);
  adminPresenceRefreshTimer=setInterval(()=>{
    if($('admin-modal')?.classList.contains('open'))renderAdminOnlineUsers();
  },5000);
}
startAdminPresenceRefresh();

setTimeout(loadMySiteRole,0);



/* AIMRELAX WEB PUSH NOTIFICATIONS */
const AIMRELAX_VAPID_PUBLIC_KEY = "BFCAx5lhGgeX0YmipGrAEoioAJtVtSVGVw5tb7FpADGMtiPsTzFScshxsV1UHXGP_y5QByzPOovx1kQVLazgnKs";

function urlBase64ToUint8Array(base64String){
  const padding='='.repeat((4-base64String.length%4)%4);
  const base64=(base64String+padding).replace(/-/g,'+').replace(/_/g,'/');
  const rawData=window.atob(base64);
  const outputArray=new Uint8Array(rawData.length);
  for(let i=0;i<rawData.length;i++){
    outputArray[i]=rawData.charCodeAt(i);
  }
  return outputArray.buffer;
}

async function registerAIMRELAXServiceWorker(){
  if(!('serviceWorker' in navigator)) throw new Error('Այս browser-ը Service Worker չի աջակցում։');
  return await navigator.serviceWorker.register('./sw.js', {scope:'./'});
}

async function enablePushNotifications(){
  const status=document.getElementById('push-status');
  const btn=document.getElementById('push-enable-btn');
  if(!currentUser){ status.textContent='Նախ մուտք գործեք։'; return; }

  try{
    if(!('Notification' in window) || !('PushManager' in window)){
      status.textContent='Այս browser-ը Web Push չի աջակցում։';
      return;
    }

    const permission=await Notification.requestPermission();
    if(permission!=='granted'){
      status.textContent='Ծանուցումների թույլտվությունը չտրվեց։';
      return;
    }

    const reg=await registerAIMRELAXServiceWorker();
    let sub=await reg.pushManager.getSubscription();
    if(!sub){
      sub=await reg.pushManager.subscribe({
        userVisibleOnly:true,
        applicationServerKey:urlBase64ToUint8Array(AIMRELAX_VAPID_PUBLIC_KEY)
      });
    }

    const payload={
      user_id:currentUser.id,
      endpoint:sub.endpoint,
      p256dh:sub.toJSON().keys?.p256dh || null,
      auth:sub.toJSON().keys?.auth || null,
      user_agent:navigator.userAgent
    };

    const {error}=await sb.from('push_subscriptions').upsert(payload,{onConflict:'user_id,endpoint'});
    if(error) throw error;

    status.textContent='Ծանուցումները միացված են ✅';
    btn.textContent='🔔 Ծանուցումները միացված են';
    btn.disabled=true;
  }catch(e){
    console.error('Push setup error',e);
    status.textContent='Չհաջողվեց միացնել՝ '+(e.message||e);
  }
}

async function refreshPushStatus(){
  const status=document.getElementById('push-status');
  const btn=document.getElementById('push-enable-btn');
  if(!status||!btn) return;
  if(!currentUser){
    status.textContent='Մուտք գործեք՝ ծանուցումները միացնելու համար։';
    btn.disabled=false;
    return;
  }
  try{
    const reg=await registerAIMRELAXServiceWorker();
    const sub=await reg.pushManager.getSubscription();
    if(sub && Notification.permission==='granted'){
      status.textContent='Ծանուցումները միացված են ✅';
      btn.textContent='🔔 Ծանուցումները միացված են';
      btn.disabled=true;
    }else{
      status.textContent='Ծանուցումները անջատված են։';
      btn.textContent='🔔 Միացնել ծանուցումները';
      btn.disabled=false;
    }
  }catch(e){}
}

setTimeout(refreshPushStatus,1500);



/* =========================================================
   AIMRELAX PERSISTENT NOTIFICATION CENTER
   ========================================================= */
let notificationCenterChannel=null;
let notificationCenterItems=[];

function toggleNotificationCenter(){
  const modal=document.getElementById('notification-center-modal');
  if(!modal)return;
  modal.classList.contains('show')?closeNotificationCenter():openNotificationCenter();
}
function openNotificationCenter(){
  const modal=document.getElementById('notification-center-modal');
  if(!modal)return;
  if(!currentUser){
    if(typeof openModal==='function')openModal();
    return;
  }
  modal.classList.add('show');
  loadUserNotifications();
}
function closeNotificationCenter(){
  document.getElementById('notification-center-modal')?.classList.remove('show');
}
function notificationCenterBackgroundClick(e){if(e.target?.id==='notification-center-modal')closeNotificationCenter()}
function notificationIcon(type){
  if(type==='private_message')return '💬';
  if(type==='friend_request')return '👥';
  if(type==='clan_notification')return '🏆';
  return '🔔';
}
function notificationTime(value){
  if(!value)return '';
  const d=new Date(value),diff=Math.floor((Date.now()-d.getTime())/1000);
  if(Number.isNaN(d.getTime()))return '';
  if(diff<60)return 'Հենց հիմա';
  if(diff<3600)return Math.floor(diff/60)+' րոպե առաջ';
  if(diff<86400)return Math.floor(diff/3600)+' ժամ առաջ';
  if(diff<604800)return Math.floor(diff/86400)+' օր առաջ';
  return d.toLocaleDateString('hy-AM');
}
function renderNotificationEmpty(text){
  const list=document.getElementById('notification-center-list');
  if(list)list.innerHTML='<div class="notification-empty">'+esc(text)+'</div>';
}
function updateNotificationBadge(count){
  const badge=document.getElementById('notification-unread-badge');
  if(!badge)return;
  const n=Number(count||0);
  badge.textContent=n>99?'99+':String(n);
  badge.classList.toggle('show',n>0);
}
function renderNotificationList(items){
  const list=document.getElementById('notification-center-list');
  if(!list)return;
  if(!items?.length){renderNotificationEmpty('Նոր ծանուցումներ չկան։');return;}
  list.innerHTML=items.map(n=>{
    const id=esc(String(n.id));
    return '<div class="notification-item '+(n.is_read?'':'unread')+'" data-notification-id="'+id+'" onclick="openNotificationItem(\''+id+'\')">'
      +'<div class="notification-icon">'+notificationIcon(n.type)+'</div>'
      +'<div class="notification-content">'
      +'<div class="notification-item-title">'+esc(n.title||'Ծանուցում')+'</div>'
      +'<div class="notification-item-body">'+esc(n.body||'')+'</div>'
      +'<div class="notification-item-time">'+notificationTime(n.created_at)+'</div>'
      +'</div>'+(n.is_read?'':'<div class="notification-unread-dot"></div>')+'</div>';
  }).join('');
}
async function loadUserNotifications(){
  if(!currentUser){updateNotificationBadge(0);return;}
  const list=document.getElementById('notification-center-list');
  if(list)list.innerHTML='<div class="notification-empty">Բեռնվում է...</div>';
  try{
    const {data,error}=await sb.from('user_notifications').select('id,user_id,type,title,body,sender_id,data,is_read,created_at').eq('user_id',currentUser.id).order('created_at',{ascending:false}).limit(50);
    if(error){console.error('Notification Center load error:',error);renderNotificationEmpty('Չհաջողվեց բեռնել ծանուցումները։');return;}
    notificationCenterItems=data||[];
    renderNotificationList(notificationCenterItems);
    updateNotificationBadge(notificationCenterItems.filter(n=>!n.is_read).length);
  }catch(e){console.error('Notification Center error:',e);renderNotificationEmpty('Սխալ տեղի ունեցավ։');}
}
async function refreshNotificationBadge(){
  if(!currentUser){updateNotificationBadge(0);return;}
  try{
    const {count,error}=await sb.from('user_notifications').select('id',{count:'exact',head:true}).eq('user_id',currentUser.id).eq('is_read',false);
    if(!error)updateNotificationBadge(count||0);
  }catch(e){console.error('Notification badge error:',e)}
}
async function openNotificationItem(id){
  if(!id||!currentUser)return;
  const n=notificationCenterItems.find(x=>String(x.id)===String(id));
  if(!n)return;
  if(!n.is_read){
    const {error}=await sb.from('user_notifications').update({is_read:true}).eq('id',id).eq('user_id',currentUser.id);
    if(error)console.error('Notification read error:',error);
    n.is_read=true;
  }
  updateNotificationBadge(notificationCenterItems.filter(x=>!x.is_read).length);
  renderNotificationList(notificationCenterItems);
  if(n.type==='private_message'){
    const chatId=n.data?.chatId||n.sender_id;
    if(chatId){closeNotificationCenter();await openPrivateChatFromNotificationCenter(chatId);}
    return;
  }
  if(n.type==='friend_request'){
    closeNotificationCenter();
    const btn=document.getElementById('friends-menu-btn');
    if(btn)btn.click();
    return;
  }
  if(n.type==='clan_notification'){
    closeNotificationCenter();
    const clanId=n.data?.clanNotificationId;
    if(clanId){
      const el=document.querySelector('[data-clan-notification-id="'+CSS.escape(String(clanId))+'"]');
      if(el)el.scrollIntoView({behavior:'smooth',block:'center'});
    }
  }
}
async function openPrivateChatFromNotificationCenter(chatId){
  if(!chatId||!currentUser)return;
  try{
    const {data}=await sb.from('profiles').select('id,nickname').eq('id',chatId).maybeSingle();
    const nickname=data?.nickname||privateNicknames?.[chatId]||'Ընկեր';
    if(typeof openPrivateChat==='function'){await openPrivateChat(chatId,nickname);return;}
    const url=new URL(location.href);url.searchParams.set('chat',chatId);location.href=url.toString();
  }catch(e){console.error('Open notification chat error:',e)}
}
async function markAllNotificationsRead(){
  if(!currentUser)return;
  try{
    const {error}=await sb.from('user_notifications').update({is_read:true}).eq('user_id',currentUser.id).eq('is_read',false);
    if(error){console.error('Mark all notifications error:',error);return;}
    notificationCenterItems=notificationCenterItems.map(n=>({...n,is_read:true}));
    renderNotificationList(notificationCenterItems);updateNotificationBadge(0);
  }catch(e){console.error(e)}
}
function startNotificationRealtime(){
  if(notificationCenterChannel){try{sb.removeChannel(notificationCenterChannel)}catch(e){}notificationCenterChannel=null}
  if(!currentUser)return;
  notificationCenterChannel=sb.channel('aimrelax-user-notifications-'+currentUser.id)
    .on('postgres_changes',{event:'INSERT',schema:'public',table:'user_notifications',filter:'user_id=eq.'+currentUser.id},payload=>{
      notificationCenterItems=[payload.new,...notificationCenterItems.filter(n=>n.id!==payload.new.id)].slice(0,50);
      updateNotificationBadge(notificationCenterItems.filter(n=>!n.is_read).length);
      if(document.getElementById('notification-center-modal')?.classList.contains('show'))renderNotificationList(notificationCenterItems);
    })
    .on('postgres_changes',{event:'UPDATE',schema:'public',table:'user_notifications',filter:'user_id=eq.'+currentUser.id},payload=>{
      const i=notificationCenterItems.findIndex(n=>n.id===payload.new.id);
      if(i>=0)notificationCenterItems[i]=payload.new;
      updateNotificationBadge(notificationCenterItems.filter(n=>!n.is_read).length);
      if(document.getElementById('notification-center-modal')?.classList.contains('show'))renderNotificationList(notificationCenterItems);
    })
    .on('postgres_changes',{event:'DELETE',schema:'public',table:'user_notifications',filter:'user_id=eq.'+currentUser.id},payload=>{
      notificationCenterItems=notificationCenterItems.filter(n=>n.id!==payload.old.id);
      updateNotificationBadge(notificationCenterItems.filter(n=>!n.is_read).length);
      if(document.getElementById('notification-center-modal')?.classList.contains('show'))renderNotificationList(notificationCenterItems);
    })
    .subscribe();
}
function startAimrelaxNotificationCenter(){refreshNotificationBadge();startNotificationRealtime()}
function stopAimrelaxNotificationCenter(){
  if(notificationCenterChannel){try{sb.removeChannel(notificationCenterChannel)}catch(e){}notificationCenterChannel=null}
  notificationCenterItems=[];updateNotificationBadge(0);closeNotificationCenter();
}
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeNotificationCenter()});



/* Clan decision notifications: show immediately when the user is online. */
let clanNotificationTimer=null;
let clanLastNotificationCheck=null;
async function checkClanDecisionNotifications(){
  if(!currentUser)return;
  try{
    let q=sb.from('clan_notifications').select('id,title,body,created_at').eq('user_id',currentUser.id).eq('is_read',false).order('created_at',{ascending:true}).limit(20);
    const {data,error}=await q;if(error)return;
    for(const n of (data||[])){
      if('Notification' in window && Notification.permission==='granted'){
        try{new Notification(n.title||'AIMRELAX-PUBG',{body:n.body||'Կլանի հայտի պատասխան',icon:'https://aimrelax-pubg.github.io/icon-192.png',tag:'clan-decision-'+n.id});}catch(e){}
      }
      await sb.from('clan_notifications').update({is_read:true}).eq('id',n.id).eq('user_id',currentUser.id);
    }
  }catch(e){}
}
setTimeout(()=>{checkClanDecisionNotifications();clanNotificationTimer=setInterval(checkClanDecisionNotifications,15000);},3000);



let deferredPWAInstallPrompt=null;
const pwaInstallBtn=document.getElementById('pwa-install-btn');

window.addEventListener('beforeinstallprompt',event=>{
  event.preventDefault();
  deferredPWAInstallPrompt=event;
  if(pwaInstallBtn) pwaInstallBtn.style.display='inline-flex';
});

pwaInstallBtn?.addEventListener('click',async()=>{
  if(!deferredPWAInstallPrompt){
    if(window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone===true){
      pwaInstallBtn.textContent='✅ Հավելվածը արդեն տեղադրված է';
    }else{
      pwaInstallBtn.textContent='📲 Տեղադրումը հասանելի է Chrome/Edge-ից';
      setTimeout(()=>{pwaInstallBtn.textContent='📲 ՆԵՐԲԵՌՆԵԼ ՀԱՎԵԼՎԱԾԸ';},2500);
    }
    return;
  }
  deferredPWAInstallPrompt.prompt();
  const choice=await deferredPWAInstallPrompt.userChoice;
  if(choice?.outcome==='accepted') pwaInstallBtn.style.display='none';
  deferredPWAInstallPrompt=null;
});

window.addEventListener('appinstalled',()=>{
  deferredPWAInstallPrompt=null;
  if(pwaInstallBtn){
    pwaInstallBtn.style.display='none';
  }
});

if(window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone===true){
  if(pwaInstallBtn) pwaInstallBtn.style.display='none';
}
