window.DarkTypeStorage = {
 save(name,data){ localStorage.setItem(name,JSON.stringify(data)); },
 load(name){ return JSON.parse(localStorage.getItem(name)||'null'); },
 clear(name){ localStorage.removeItem(name); }
};
