window.DarkTypeEditor = {
  state: { selected: null, layers: [] },
  load(template){
    this.state.layers = structuredClone(template.layers || []);
    return this.state.layers;
  },
  select(id){ this.state.selected = id; },
  update(id, patch){
    const layer = this.state.layers.find(item => item.id === id);
    if(layer) Object.assign(layer, patch);
  },
  duplicate(id){
    const layer = this.state.layers.find(item => item.id === id);
    if(layer) this.state.layers.push({...layer,id:layer.id+'-copy'});
  }
};
