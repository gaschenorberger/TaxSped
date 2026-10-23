import { useEffect, useLayoutEffect, useRef, useState } from 'react';

export default function usePopover(width, height = 320) {
  const anchor = useRef(null);
  const panel = useRef(null);
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({});

  useLayoutEffect(() => {
    if (!open) return;
    function place() {
      const rect = anchor.current.getBoundingClientRect();
      const panelWidth = Math.min(width || rect.width, window.innerWidth - 24);
      const below = window.innerHeight - rect.bottom - 20;
      const above = rect.top - 20;
      const upwards = below < height && above > below;
      setPosition({ position: 'fixed', width: panelWidth, left: Math.max(12, Math.min(rect.left, window.innerWidth - panelWidth - 12)), top: upwards ? undefined : rect.bottom + 8, bottom: upwards ? window.innerHeight - rect.top + 8 : undefined, maxHeight: Math.max(140, upwards ? above : below) });
    }
    place();
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    return () => { window.removeEventListener('resize', place); window.removeEventListener('scroll', place, true); };
  }, [open, width, height]);

  useEffect(() => {
    if (!open) return;
    function close(event) {
      if (event.key === 'Escape') { setOpen(false); anchor.current?.focus({ preventScroll: true }); return; }
      if (event.type === 'pointerdown' && !anchor.current?.contains(event.target) && !panel.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener('pointerdown', close);
    document.addEventListener('keydown', close);
    return () => { document.removeEventListener('pointerdown', close); document.removeEventListener('keydown', close); };
  }, [open]);

  return { anchor, panel, open, setOpen, position };
}
