(function(){
  window.DTS = window.DTS || {};
  DTS.clone = value => JSON.parse(JSON.stringify(value));
  DTS.clamp = (n,min,max)=>Math.min(max,Math.max(min,n));
  DTS.uid = (p='layer') => `${p}-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
})();
