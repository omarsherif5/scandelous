function bindGallery(strip) {
  if (strip.children.length < 2) return;
  let drag;
  let suppressClick = false;
  const dots = strip.nextElementSibling?.matches('.card-swipe-dots') ? strip.nextElementSibling.children : [];
  strip.classList.add('swipe-gallery');
  strip.onpointerdown = event => {
    if (!event.isPrimary || event.button !== 0) return;
    suppressClick = false;
    drag = {id:event.pointerId, x:event.clientX, y:event.clientY, left:strip.scrollLeft, moved:false};
  };
  strip.onpointermove = event => {
    if (!drag || event.pointerId !== drag.id) return;
    const dx = event.clientX - drag.x;
    if (!drag.moved) {
      if (Math.abs(dx) < 8 || Math.abs(dx) <= Math.abs(event.clientY-drag.y)) return;
      strip.setPointerCapture(event.pointerId);
      drag.moved = true;
      strip.classList.add('dragging');
    }
    strip.scrollLeft = drag.left - dx;
  };
  function finish(event) {
    if (event.type==='lostpointercapture' && event.target!==strip) return;
    if (!drag || event.pointerId !== drag.id) return;
    const gesture = drag;
    drag = null;
    if (strip.hasPointerCapture(event.pointerId)) strip.releasePointerCapture(event.pointerId);
    if (!gesture.moved) return;
    suppressClick = true;
    const delta = gesture.x - event.clientX;
    const width = strip.clientWidth;
    let index = Math.round(gesture.left / width);
    if (event.type==='pointerup' && Math.abs(delta)>=Math.min(40,width*0.2)) index+=Math.sign(delta);
    strip.classList.remove('dragging');
    strip.scrollTo({left:index*width,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  }
  strip.onpointerup = strip.onpointercancel = strip.onlostpointercapture = finish;
  strip.ondragstart = event => event.preventDefault();
  strip.addEventListener('click', blockDragClick, true);
  function blockDragClick(event) {
    if (suppressClick) {
      event.stopImmediatePropagation();
      event.preventDefault();
      suppressClick = false;
    }
  }
  strip.onscroll = () => {
    const index=Math.round(strip.scrollLeft/strip.clientWidth);
    Array.from(dots).forEach((dot,i)=>dot.classList.toggle('active',i===index));
  };
}
