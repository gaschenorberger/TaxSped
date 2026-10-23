import { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function Layout({ page, setPage, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="app-shell">
      <Sidebar page={page} setPage={setPage} open={open} close={() => setOpen(false)} />
      <div className="app-body">
        <Topbar onMenu={() => setOpen(true)} />
        <main><div className="page-content" key={page}>{children}</div></main>
      </div>
      {open && <button className="sidebar-mask" aria-label="Fechar menu" onClick={() => setOpen(false)} />}
    </div>
  );
}
