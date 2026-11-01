// وصفتي — Service Worker
// الصفحة والملفات ديال التطبيق: من الشبكة أولاً (باش التحديثات توصل)، ومن الكاش إلا ما كانش الأنترنيت.
// الخطوط والمكتبات: من الكاش أولاً.
const CACHE='wasfati-v3';
const SHELL=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim()});
self.addEventListener('fetch',e=>{
  const req=e.request;if(req.method!=='GET')return;
  const sameOrigin=req.url.startsWith(self.location.origin);
  if(sameOrigin){
    e.respondWith(fetch(req,{cache:'no-cache'}).then(res=>{if(res.ok){const c=res.clone();caches.open(CACHE).then(x=>x.put(req,c))}return res})
      .catch(()=>caches.match(req).then(hit=>hit||caches.match('./index.html'))));
    return;
  }
  if(/fonts\.(googleapis|gstatic)\.com|cdn\.jsdelivr\.net/.test(req.url)){
    e.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(res=>{if(res.ok){const c=res.clone();caches.open(CACHE).then(x=>x.put(req,c))}return res})));
  }
});
