window.DarkTypeCanvas = {
  render(container, template){
    container.innerHTML='';
    const canvas=document.createElement('div');
    canvas.className='dark-canvas';
    canvas.style.aspectRatio=`${template.size.width}/${template.size.height}`;
    template.layers.forEach(layer=>{
      const el=document.createElement('div');
      el.dataset.layer=layer.id;
      el.textContent=layer.text || '';
      el.style.position='absolute';
      el.style.left=layer.x/template.size.width*100+'%';
      el.style.top=layer.y/template.size.height*100+'%';
      el.style.fontSize=(layer.fontSize/template.size.width*100)+'vw';
      canvas.appendChild(el);
    });
    container.appendChild(canvas);
    return canvas;
  }
};
