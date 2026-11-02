import { useEffect, useMemo, useState } from 'react'
import {
  LayoutDashboard, Utensils, ClipboardList, Package, Users, Settings,
  Search, Bell, Plus, TrendingUp, DollarSign, ShoppingBag, Clock,
  Pencil, Trash2, X, ChevronDown, Menu, ChefHat, CircleCheck,
  CircleAlert, CalendarDays, Filter, LogOut, Coffee, Soup, Flame
} from 'lucide-react'

const initialOrders = [
  { id: 'ORD-1048', customer: 'María López', items: '2 Hamburguesas clásicas, 1 limonada', total: 18.50, status: 'Preparando', time: '12:42 PM', type: 'Mesa 04' },
  { id: 'ORD-1047', customer: 'Carlos Méndez', items: '1 Pizza familiar, 2 refrescos', total: 24.00, status: 'Listo', time: '12:35 PM', type: 'Para llevar' },
  { id: 'ORD-1046', customer: 'Ana Rodríguez', items: '1 Pasta Alfredo, 1 agua', total: 14.75, status: 'Pendiente', time: '12:28 PM', type: 'Mesa 02' },
  { id: 'ORD-1045', customer: 'José Martínez', items: '3 Tacos de pollo, 1 horchata', total: 16.00, status: 'Entregado', time: '12:16 PM', type: 'Domicilio' },
  { id: 'ORD-1044', customer: 'Sofía Hernández', items: '1 Ensalada César, 1 té frío', total: 12.25, status: 'Entregado', time: '11:58 AM', type: 'Mesa 06' },
]
const initialMenu = [
  { id: 1, name: 'Hamburguesa clásica', category: 'Hamburguesas', price: 8.50, stock: 18, available: true, emoji: '🍔' },
  { id: 2, name: 'Pizza artesanal', category: 'Pizzas', price: 14.00, stock: 12, available: true, emoji: '🍕' },
  { id: 3, name: 'Pasta Alfredo', category: 'Pastas', price: 11.75, stock: 9, available: true, emoji: '🍝' },
  { id: 4, name: 'Tacos de pollo', category: 'Tacos', price: 6.00, stock: 0, available: false, emoji: '🌮' },
  { id: 5, name: 'Ensalada César', category: 'Ensaladas', price: 7.25, stock: 15, available: true, emoji: '🥗' },
  { id: 6, name: 'Limonada natural', category: 'Bebidas', price: 2.50, stock: 24, available: true, emoji: '🍋' },
]
const initialStaff = [
  { id: 1, name: 'Daniel Flores', role: 'Chef principal', shift: '08:00 AM – 04:00 PM', status: 'En turno' },
  { id: 2, name: 'Valeria Cruz', role: 'Mesera', shift: '09:00 AM – 05:00 PM', status: 'En turno' },
  { id: 3, name: 'Miguel Torres', role: 'Cajero', shift: '10:00 AM – 06:00 PM', status: 'En turno' },
  { id: 4, name: 'Lucía Ramírez', role: 'Mesera', shift: '02:00 PM – 10:00 PM', status: 'Libre' },
]
const money = n => '$' + Number(n || 0).toFixed(2)
const read = (key, fallback) => {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback } catch { return fallback }
}

function App() {
  const [section, setSection] = useState('Resumen')
  const [orders, setOrders] = useState(() => read('sabor-orders', initialOrders))
  const [menu, setMenu] = useState(() => read('sabor-menu', initialMenu))
  const [staff, setStaff] = useState(() => read('sabor-staff', initialStaff))
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('Todos')
  const [modal, setModal] = useState('')
  const [editing, setEditing] = useState(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [toast, setToast] = useState('')
  const [orderForm, setOrderForm] = useState({ customer: '', items: '', total: '', type: 'Mesa 01', status: 'Pendiente' })
  const [menuForm, setMenuForm] = useState({ name: '', category: 'Platos fuertes', price: '', stock: '', emoji: '🍽️' })
  const [staffForm, setStaffForm] = useState({ name: '', role: 'Mesero/a', shift: '', status: 'En turno' })

  useEffect(() => { localStorage.setItem('sabor-orders', JSON.stringify(orders)) }, [orders])
  useEffect(() => { localStorage.setItem('sabor-menu', JSON.stringify(menu)) }, [menu])
  useEffect(() => { localStorage.setItem('sabor-staff', JSON.stringify(staff)) }, [staff])
  useEffect(() => { if (toast) { const t = setTimeout(() => setToast(''), 2600); return () => clearTimeout(t) } }, [toast])

  const todayTotal = orders.filter(o => o.status === 'Entregado').reduce((s, o) => s + Number(o.total), 0)
  const pending = orders.filter(o => ['Pendiente', 'Preparando'].includes(o.status)).length
  const filteredOrders = useMemo(() => orders.filter(o => {
    const match = `${o.id} ${o.customer} ${o.items}`.toLowerCase().includes(search.toLowerCase())
    return match && (filter === 'Todos' || o.status === filter)
  }), [orders, search, filter])

  const navigate = name => { setSection(name); setMobileOpen(false); setSearch(''); setFilter('Todos') }
  const openOrder = order => {
    setEditing(order || null)
    setOrderForm(order ? { ...order, total: String(order.total) } : { customer: '', items: '', total: '', type: 'Mesa 01', status: 'Pendiente' })
    setModal('order')
  }
  const saveOrder = e => {
    e.preventDefault()
    const item = { ...orderForm, total: Number(orderForm.total), id: editing?.id || `ORD-${1050 + orders.length}`, time: editing?.time || new Date().toLocaleTimeString('es-SV', { hour: '2-digit', minute: '2-digit' }) }
    setOrders(prev => editing ? prev.map(o => o.id === editing.id ? item : o) : [item, ...prev])
    setModal(''); setToast(editing ? 'Pedido actualizado' : 'Pedido registrado')
  }
  const openMenu = item => {
    setEditing(item || null)
    setMenuForm(item ? { ...item, price: String(item.price), stock: String(item.stock) } : { name: '', category: 'Platos fuertes', price: '', stock: '', emoji: '🍽️' })
    setModal('menu')
  }
  const saveMenu = e => {
    e.preventDefault()
    const item = { ...menuForm, price: Number(menuForm.price), stock: Number(menuForm.stock), available: Number(menuForm.stock) > 0, id: editing?.id || Date.now() }
    setMenu(prev => editing ? prev.map(x => x.id === editing.id ? item : x) : [...prev, item])
    setModal(''); setToast(editing ? 'Producto actualizado' : 'Producto agregado')
  }
  const openStaff = person => {
    setEditing(person || null)
    setStaffForm(person || { name: '', role: 'Mesero/a', shift: '', status: 'En turno' })
    setModal('staff')
  }
  const saveStaff = e => {
    e.preventDefault()
    const item = { ...staffForm, id: editing?.id || Date.now() }
    setStaff(prev => editing ? prev.map(x => x.id === editing.id ? item : x) : [...prev, item])
    setModal(''); setToast(editing ? 'Personal actualizado' : 'Personal agregado')
  }
  const remove = (kind, id) => {
    if (!confirm('¿Seguro que deseas eliminar este registro?')) return
    if (kind === 'order') setOrders(p => p.filter(x => x.id !== id))
    if (kind === 'menu') setMenu(p => p.filter(x => x.id !== id))
    if (kind === 'staff') setStaff(p => p.filter(x => x.id !== id))
    setToast('Registro eliminado')
  }
  const updateStatus = (id, status) => setOrders(p => p.map(o => o.id === id ? { ...o, status } : o))

  const navItems = [
    { name: 'Resumen', icon: LayoutDashboard },
    { name: 'Pedidos', icon: ClipboardList, count: pending },
    { name: 'Menú', icon: Utensils },
    { name: 'Inventario', icon: Package },
    { name: 'Personal', icon: Users },
  ]
  const title = section === 'Resumen' ? 'Resumen general' : section

  return <div className="app-shell">
    <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
      <div className="brand"><div className="brand-mark"><ChefHat size={22}/></div><div><strong>SABOR</strong><span>RESTAURANTE</span></div></div>
      <div className="side-label">MENÚ PRINCIPAL</div>
      <nav>{navItems.map(({ name, icon: Icon, count }) => <button key={name} className={`nav-link ${section === name ? 'active' : ''}`} onClick={() => navigate(name)}><Icon size={18}/><span>{name}</span>{count > 0 && <b className="nav-count">{count}</b>}</button>)}</nav>
      <div className="side-label tools-label">CONFIGURACIÓN</div>
      <button className={`nav-link ${section === 'Configuración' ? 'active' : ''}`} onClick={() => navigate('Configuración')}><Settings size={18}/><span>Configuración</span></button>
      <div className="sidebar-bottom"><div className="help-card"><div className="help-icon"><Coffee size={18}/></div><strong>¿Necesitas ayuda?</strong><p>Administra tu restaurante de forma sencilla.</p><button onClick={() => setToast('¡Gracias! Pronto estaremos en contacto.')}>Contactar soporte</button></div><div className="profile"><div className="avatar">AR</div><div><strong>Admin Restaurante</strong><span>Administrador</span></div><button aria-label="Cerrar sesión" onClick={() => setToast('Sesión local de demostración')}><LogOut size={16}/></button></div></div>
    </aside>

    <main className="main-area">
      <header className="topbar">
        <button className="mobile-menu" onClick={() => setMobileOpen(!mobileOpen)}><Menu size={21}/></button>
        <div className="breadcrumb">Panel de control <span>/</span> <strong>{title}</strong></div>
        <div className="top-actions"><div className="today"><CalendarDays size={15}/>{new Date().toLocaleDateString('es-SV', { weekday: 'short', day: 'numeric', month: 'short' })}</div><button className="icon-button notification" onClick={() => setToast(`${pending} pedidos necesitan atención`)}><Bell size={18}/><i/></button><div className="top-avatar">AR</div></div>
      </header>
      <div className="content">
        <div className="page-heading"><div><div className="eyebrow">GESTIÓN DEL RESTAURANTE</div><h1>{title}</h1><p>Bienvenido de nuevo. Aquí tienes lo que sucede hoy en tu restaurante.</p></div>
          {section === 'Pedidos' && <button className="primary-btn" onClick={() => openOrder()}><Plus size={17}/> Nuevo pedido</button>}
          {section === 'Menú' && <button className="primary-btn" onClick={() => openMenu()}><Plus size={17}/> Agregar producto</button>}
          {section === 'Personal' && <button className="primary-btn" onClick={() => openStaff()}><Plus size={17}/> Agregar empleado</button>}
        </div>

        {section === 'Resumen' && <>
          <div className="stats-grid">
            <Stat icon={DollarSign} label="Ventas registradas" value={money(todayTotal)} note="Total de pedidos entregados" trend="+12.8%" color="green"/>
            <Stat icon={ShoppingBag} label="Pedidos totales" value={orders.length} note="Pedidos en el sistema" trend="+8.2%" color="orange"/>
            <Stat icon={Clock} label="Pedidos pendientes" value={pending} note="Por preparar o entregar" trend="En proceso" color="purple"/>
            <Stat icon={Utensils} label="Productos en menú" value={menu.length} note={`${menu.filter(x => x.available).length} disponibles`} trend="Menú activo" color="blue"/>
          </div>
          <div className="dashboard-grid">
            <section className="panel orders-panel"><div className="panel-heading"><div><h2>Pedidos recientes</h2><p>Seguimiento de las órdenes más recientes</p></div><button className="text-btn" onClick={() => navigate('Pedidos')}>Ver todos <span>→</span></button></div><OrderTable orders={orders.slice(0, 5)} onEdit={openOrder} onDelete={id => remove('order', id)} onStatus={updateStatus} compact/></section>
            <section className="panel popular-panel"><div className="panel-heading"><div><h2>Productos destacados</h2><p>Resumen de tu carta</p></div><button className="more-btn" onClick={() => navigate('Menú')}>•••</button></div>
              <div className="popular-list">{menu.slice(0, 4).map((item, i) => <div className="popular-item" key={item.id}><div className="food-emoji">{item.emoji}</div><div className="popular-info"><strong>{item.name}</strong><span>{item.category}</span></div><b>{money(item.price)}</b></div>)}</div>
              <div className="tip-box"><Flame size={18}/><div><strong>¡Mantén tu menú actualizado!</strong><p>Revisa las existencias para evitar vender productos agotados.</p></div></div>
            </section>
          </div>
          <section className="panel quick-panel"><div className="panel-heading"><div><h2>Accesos rápidos</h2><p>Las tareas que realizas con frecuencia</p></div></div><div className="quick-actions"><Quick icon={ClipboardList} title="Registrar pedido" desc="Crear una nueva orden" onClick={() => openOrder()}/><Quick icon={Soup} title="Agregar al menú" desc="Registrar un platillo" onClick={() => openMenu()}/><Quick icon={Users} title="Gestionar personal" desc="Ver equipo de trabajo" onClick={() => navigate('Personal')}/><Quick icon={Package} title="Ver inventario" desc="Controlar existencias" onClick={() => navigate('Inventario')}/></div></section>
        </>}

        {section === 'Pedidos' && <section className="panel full-panel"><div className="panel-heading"><div><h2>Todos los pedidos</h2><p>Registra y actualiza las órdenes de tus clientes</p></div><span className="result-count">{filteredOrders.length} pedidos</span></div><div className="table-tools"><div className="search-box"><Search size={17}/><input placeholder="Buscar pedido o cliente..." value={search} onChange={e => setSearch(e.target.value)}/></div><div className="filter-box"><Filter size={16}/><select value={filter} onChange={e => setFilter(e.target.value)}>{['Todos','Pendiente','Preparando','Listo','Entregado'].map(s => <option>{s}</option>)}</select><ChevronDown size={14}/></div></div><OrderTable orders={filteredOrders} onEdit={openOrder} onDelete={id => remove('order', id)} onStatus={updateStatus}/></section>}

        {section === 'Menú' && <section className="panel full-panel"><div className="panel-heading"><div><h2>Menú de productos</h2><p>Administra platillos, bebidas, precios y disponibilidad</p></div><span className="result-count">{menu.length} productos</span></div><div className="table-tools"><div className="search-box"><Search size={17}/><input placeholder="Buscar producto..." value={search} onChange={e => setSearch(e.target.value)}/></div></div><div className="menu-grid">{menu.filter(x => `${x.name} ${x.category}`.toLowerCase().includes(search.toLowerCase())).map(item => <div className="menu-card" key={item.id}><div className="menu-card-top"><div className="food-large">{item.emoji}</div><span className={`availability ${item.available ? 'available' : 'unavailable'}`}>{item.available ? 'Disponible' : 'Agotado'}</span></div><div className="menu-card-body"><span className="category-tag">{item.category}</span><h3>{item.name}</h3><div className="menu-card-bottom"><strong>{money(item.price)}</strong><span>{item.stock} unidades</span></div><div className="card-actions"><button onClick={() => openMenu(item)}><Pencil size={14}/> Editar</button><button className="delete-action" onClick={() => remove('menu', item.id)}><Trash2 size={14}/> Eliminar</button></div></div></div>)}</div></section>}

        {section === 'Inventario' && <section className="panel full-panel"><div className="panel-heading"><div><h2>Control de inventario</h2><p>Existencias disponibles de los productos del menú</p></div><span className="result-count">{menu.reduce((s, x) => s + Number(x.stock), 0)} unidades</span></div><div className="inventory-list">{menu.map(item => <div className="inventory-row" key={item.id}><div className="food-emoji">{item.emoji}</div><div className="inventory-name"><strong>{item.name}</strong><span>{item.category}</span></div><div className="stock-bar-wrap"><div className="stock-meta"><span>Existencias</span><strong>{item.stock} unidades</strong></div><div className="stock-bar"><i style={{ width: `${Math.min(item.stock / 30 * 100, 100)}%` }}/></div></div><span className={`stock-status ${item.stock === 0 ? 'danger' : item.stock < 8 ? 'warning' : 'ok'}`}>{item.stock === 0 ? 'Agotado' : item.stock < 8 ? 'Stock bajo' : 'En stock'}</span><button className="small-icon" onClick={() => openMenu(item)}><Pencil size={15}/></button></div>)}</div></section>}

        {section === 'Personal' && <section className="panel full-panel"><div className="panel-heading"><div><h2>Equipo de trabajo</h2><p>Administra los empleados y sus turnos</p></div><span className="result-count">{staff.length} empleados</span></div><div className="staff-grid">{staff.map(person => <div className="staff-card" key={person.id}><div className="staff-card-head"><div className="staff-avatar">{person.name.split(' ').map(x => x[0]).slice(0,2).join('')}</div><span className={`staff-status ${person.status === 'En turno' ? 'on' : 'off'}`}>{person.status}</span></div><h3>{person.name}</h3><p>{person.role}</p><div className="shift-line"><Clock size={15}/>{person.shift || 'Turno sin asignar'}</div><div className="card-actions"><button onClick={() => openStaff(person)}><Pencil size={14}/> Editar</button><button className="delete-action" onClick={() => remove('staff', person.id)}><Trash2 size={14}/> Eliminar</button></div></div>)}</div></section>}

        {section === 'Configuración' && <section className="panel settings-panel"><div className="panel-heading"><div><h2>Configuración general</h2><p>Información básica de tu restaurante</p></div></div><div className="settings-form"><label>Nombre del restaurante<input defaultValue="Sabor Restaurante"/></label><label>Correo de contacto<input defaultValue="contacto@sabor.com"/></label><label>Teléfono<input defaultValue="+503 2222-0000"/></label><label>Dirección<input defaultValue="San Salvador, El Salvador"/></label><label>Moneda<select defaultValue="USD"><option value="USD">Dólar estadounidense (USD)</option></select></label><label>Horario de atención<input defaultValue="Lunes a domingo · 8:00 AM – 10:00 PM"/></label><button className="primary-btn" onClick={() => setToast('Configuración guardada en esta sesión')}>Guardar cambios</button></div><div className="local-note"><CircleAlert size={18}/><p>Esta aplicación funciona sin servidor. Los pedidos, el menú y el personal se guardan en el almacenamiento local de este navegador.</p></div></section>}
      </div>
    </main>

    {modal && <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) setModal('') }}><div className="modal"><div className="modal-head"><div><span className="eyebrow">SABOR RESTAURANTE</span><h2>{modal === 'order' ? (editing ? 'Editar pedido' : 'Nuevo pedido') : modal === 'menu' ? (editing ? 'Editar producto' : 'Agregar producto') : (editing ? 'Editar empleado' : 'Agregar empleado')}</h2></div><button className="close-btn" onClick={() => setModal('')}><X size={19}/></button></div>
      {modal === 'order' && <form onSubmit={saveOrder} className="modal-form"><label>Nombre del cliente<input required value={orderForm.customer} onChange={e => setOrderForm({...orderForm, customer:e.target.value})} placeholder="Ej. María López"/></label><label>Detalle del pedido<input required value={orderForm.items} onChange={e => setOrderForm({...orderForm, items:e.target.value})} placeholder="Platillos y bebidas"/></label><div className="form-row"><label>Total ($)<input required type="number" min="0.01" step="0.01" value={orderForm.total} onChange={e => setOrderForm({...orderForm,total:e.target.value})} placeholder="0.00"/></label><label>Tipo de pedido<select value={orderForm.type} onChange={e => setOrderForm({...orderForm,type:e.target.value})}>{['Mesa 01','Mesa 02','Mesa 03','Mesa 04','Para llevar','Domicilio'].map(x => <option>{x}</option>)}</select></label></div><label>Estado<select value={orderForm.status} onChange={e => setOrderForm({...orderForm,status:e.target.value})}>{['Pendiente','Preparando','Listo','Entregado'].map(x => <option>{x}</option>)}</select></label><div className="modal-actions"><button type="button" className="cancel-btn" onClick={() => setModal('')}>Cancelar</button><button className="primary-btn" type="submit">Guardar pedido</button></div></form>}
      {modal === 'menu' && <form onSubmit={saveMenu} className="modal-form"><label>Nombre del producto<input required value={menuForm.name} onChange={e => setMenuForm({...menuForm,name:e.target.value})} placeholder="Nombre del platillo"/></label><div className="form-row"><label>Categoría<select value={menuForm.category} onChange={e => setMenuForm({...menuForm,category:e.target.value})}>{['Platos fuertes','Hamburguesas','Pizzas','Pastas','Tacos','Ensaladas','Bebidas','Postres'].map(x => <option>{x}</option>)}</select></label><label>Emoji<input value={menuForm.emoji} onChange={e => setMenuForm({...menuForm,emoji:e.target.value})} maxLength="4"/></label></div><div className="form-row"><label>Precio ($)<input required type="number" min="0" step="0.01" value={menuForm.price} onChange={e => setMenuForm({...menuForm,price:e.target.value})} placeholder="0.00"/></label><label>Existencias<input required type="number" min="0" step="1" value={menuForm.stock} onChange={e => setMenuForm({...menuForm,stock:e.target.value})} placeholder="0"/></label></div><div className="modal-actions"><button type="button" className="cancel-btn" onClick={() => setModal('')}>Cancelar</button><button className="primary-btn" type="submit">Guardar producto</button></div></form>}
      {modal === 'staff' && <form onSubmit={saveStaff} className="modal-form"><label>Nombre completo<input required value={staffForm.name} onChange={e => setStaffForm({...staffForm,name:e.target.value})} placeholder="Nombre del empleado"/></label><label>Cargo<select value={staffForm.role} onChange={e => setStaffForm({...staffForm,role:e.target.value})}>{['Chef principal','Cocinero/a','Mesero/a','Cajero/a','Repartidor/a','Administrador/a','Limpieza'].map(x => <option>{x}</option>)}</select></label><label>Horario<input value={staffForm.shift} onChange={e => setStaffForm({...staffForm,shift:e.target.value})} placeholder="08:00 AM – 04:00 PM"/></label><label>Estado<select value={staffForm.status} onChange={e => setStaffForm({...staffForm,status:e.target.value})}><option>En turno</option><option>Libre</option></select></label><div className="modal-actions"><button type="button" className="cancel-btn" onClick={() => setModal('')}>Cancelar</button><button className="primary-btn" type="submit">Guardar empleado</button></div></form>}
    </div></div>}
    {toast && <div className="toast"><CircleCheck size={18}/>{toast}</div>}
  </div>
}

function Stat({ icon: Icon, label, value, note, trend, color }) {
  return <div className="stat-card"><div className="stat-top"><div className={`stat-icon ${color}`}><Icon size={19}/></div><span className={`trend ${color}`}>{trend}</span></div><div className="stat-value">{value}</div><div className="stat-label">{label}</div><div className="stat-note">{note}</div></div>
}
function Quick({ icon: Icon, title, desc, onClick }) {
  return <button className="quick-action" onClick={onClick}><div className="quick-icon"><Icon size={19}/></div><div><strong>{title}</strong><span>{desc}</span></div><span className="quick-arrow">→</span></button>
}
function OrderTable({ orders, onEdit, onDelete, onStatus, compact=false }) {
  return <div className="table-scroll"><table className="data-table"><thead><tr><th>Pedido</th><th>Cliente</th><th>Detalle</th><th>Total</th><th>Estado</th><th>Tipo / hora</th><th>Acciones</th></tr></thead><tbody>{orders.map(o => <tr key={o.id}><td><strong className="order-id">{o.id}</strong></td><td><strong>{o.customer}</strong></td><td className="item-cell">{o.items}</td><td><strong>{money(o.total)}</strong></td><td><select className={`status-select ${o.status.toLowerCase()}`} value={o.status} onChange={e => onStatus(o.id,e.target.value)}><option>Pendiente</option><option>Preparando</option><option>Listo</option><option>Entregado</option></select></td><td><span className="type-text">{o.type}</span><small className="time-text">{o.time}</small></td><td><div className="row-actions"><button title="Editar" onClick={() => onEdit(o)}><Pencil size={15}/></button><button title="Eliminar" onClick={() => onDelete(o.id)}><Trash2 size={15}/></button></div></td></tr>)}{orders.length === 0 && <tr><td colSpan="7" className="empty-state">No se encontraron pedidos.</td></tr>}</tbody></table></div>
}

export default App
