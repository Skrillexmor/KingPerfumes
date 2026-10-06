import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const API = "http://localhost:5000/api";
const money = n => `₹${Number(n).toLocaleString("en-IN")}`;

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [view, setView] = useState(location.pathname === "/admin" ? "admin" : "shop");
  const [message, setMessage] = useState("");

  async function loadProducts() {
    const res = await fetch(`${API}/products`);
    setProducts(await res.json());
  }

  useEffect(() => { loadProducts(); }, []);

  function addToCart(product) {
    if (product.stock < 1) return;
    setCart(old => {
      const found = old.find(i => i.productId === product.id);
      if (found) return old.map(i => i.productId === product.id ? {...i, quantity: Math.min(i.quantity + 1, product.stock)} : i);
      return [...old, { productId: product.id, name: product.name, price: product.price, quantity: 1 }];
    });
    setMessage("Added to cart.");
    setTimeout(() => setMessage(""), 1200);
  }

  const total = useMemo(() => cart.reduce((s, i) => s + i.price * i.quantity, 0), [cart]);

  return (
    <div>
      <header className="nav">
        <button className="brand" onClick={() => setView("shop")}>🍫 ChocoShop</button>
        <div className="navlinks">
          <button onClick={() => setView("shop")}>Shop</button>
          <button onClick={() => setView("admin")}>Admin</button>
          <span className="cartBadge">🛒 {cart.reduce((s, i) => s + i.quantity, 0)}</span>
        </div>
      </header>

      {view === "shop"
        ? <Shop products={products} cart={cart} setCart={setCart} total={total} addToCart={addToCart} message={message} setMessage={setMessage} />
        : <Admin products={products} reload={loadProducts} />}
    </div>
  );
}

function Shop({products, cart, setCart, total, addToCart, message, setMessage}) {
  const [customer, setCustomer] = useState({name:"", email:""});
  const [showCheckout, setShowCheckout] = useState(false);

  async function checkout(e) {
    e.preventDefault();
    const res = await fetch(`${API}/orders`, {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ customer, items: cart })
    });
    const data = await res.json();
    if (!res.ok) return setMessage(data.message || "Checkout failed.");
    setCart([]);
    setCustomer({name:"",email:""});
    setShowCheckout(false);
    setMessage(`Order ${data.id} placed successfully!`);
    location.reload();
  }

  return (
    <main>
      <section className="hero">
        <div>
          <p className="eyebrow">HANDCRAFTED HAPPINESS</p>
          <h1>Life is better<br/><span>with chocolate.</span></h1>
          <p>Discover delicious milk, dark, nutty and premium chocolates made for every sweet moment.</p>
          <a href="#products" className="primary">Shop chocolates</a>
        </div>
        <div className="heroArt">🍫<span>🍓</span>🍫</div>
      </section>

      <section id="products" className="content">
        <div className="sectionTitle">
          <div><p className="eyebrow">OUR COLLECTION</p><h2>Sweet favorites</h2></div>
          <span>{products.length} products</span>
        </div>
        <div className="grid">
          {products.map(p => (
            <article className="card" key={p.id}>
              <img src={p.image} alt={p.name}/>
              <div className="cardBody">
                <small>{p.category}</small>
                <h3>{p.name}</h3>
                <p>{p.description}</p>
                <div className="cardBottom">
                  <strong>{money(p.price)}</strong>
                  <button className="primary small" disabled={!p.stock} onClick={() => addToCart(p)}>
                    {p.stock ? "Add to cart" : "Sold out"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <aside className="cartPanel">
        <div className="sectionTitle"><h2>Your cart</h2><span>{money(total)}</span></div>
        {cart.length === 0 ? <p className="muted">Your cart is empty.</p> :
          <>
            {cart.map(i => <div className="cartRow" key={i.productId}>
              <div><b>{i.name}</b><small>{money(i.price)} × {i.quantity}</small></div>
              <div className="qty">
                <button onClick={() => setCart(c => c.map(x => x.productId === i.productId ? {...x, quantity:x.quantity-1} : x).filter(x=>x.quantity>0))}>−</button>
                <span>{i.quantity}</span>
                <button onClick={() => setCart(c => c.map(x => x.productId === i.productId ? {...x, quantity:x.quantity+1} : x))}>+</button>
              </div>
            </div>)}
            <button className="primary full" onClick={() => setShowCheckout(true)}>Checkout · {money(total)}</button>
          </>
        }
        {message && <div className="toast">{message}</div>}
      </aside>

      {showCheckout && <div className="modalWrap">
        <form className="modal" onSubmit={checkout}>
          <button type="button" className="close" onClick={() => setShowCheckout(false)}>×</button>
          <p className="eyebrow">DEMO CHECKOUT</p>
          <h2>Place your order</h2>
          <input required placeholder="Full name" value={customer.name} onChange={e=>setCustomer({...customer,name:e.target.value})}/>
          <input required type="email" placeholder="Email" value={customer.email} onChange={e=>setCustomer({...customer,email:e.target.value})}/>
          <div className="checkoutTotal">Total <b>{money(total)}</b></div>
          <button className="primary full">Place order</button>
        </form>
      </div>}
    </main>
  );
}

function Admin({products, reload}) {
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({name:"",description:"",price:"",category:"Milk Chocolate",stock:"",image:""});
  const [editing, setEditing] = useState(null);
  const [login, setLogin] = useState(localStorage.getItem("chocoAdmin") === "1");
  const [creds, setCreds] = useState({email:"",password:""});

  async function loadOrders() {
    const res = await fetch(`${API}/orders`);
    setOrders(await res.json());
  }
  useEffect(() => { if(login) loadOrders(); }, [login]);

  if (!login) return <div className="adminLogin">
    <div className="loginCard">
      <div className="logoCircle">🍫</div><h1>Admin Portal</h1><p>Manage ChocoShop products and orders.</p>
      <input placeholder="Email" value={creds.email} onChange={e=>setCreds({...creds,email:e.target.value})}/>
      <input type="password" placeholder="Password" value={creds.password} onChange={e=>setCreds({...creds,password:e.target.value})}/>
      <button className="primary full" onClick={() => {
        if(creds.email==="admin@chocoshop.local" && creds.password==="admin123") {
          localStorage.setItem("chocoAdmin","1"); setLogin(true);
        } else alert("Use admin@chocoshop.local / admin123");
      }}>Login</button>
    </div>
  </div>;

  async function saveProduct(e) {
    e.preventDefault();
    const url = editing ? `${API}/products/${editing}` : `${API}/products`;
    const method = editing ? "PUT" : "POST";
    await fetch(url, {method, headers:{"Content-Type":"application/json"}, body:JSON.stringify(form)});
    setForm({name:"",description:"",price:"",category:"Milk Chocolate",stock:"",image:""});
    setEditing(null); await reload();
  }

  async function deleteProduct(id) {
    if (!confirm("Delete this product?")) return;
    await fetch(`${API}/products/${id}`, {method:"DELETE"});
    reload();
  }

  async function status(id,status) {
    await fetch(`${API}/orders/${id}/status`, {method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({status})});
    loadOrders();
  }

  return <main className="admin">
    <div className="adminHeader"><div><p className="eyebrow">CONTROL CENTER</p><h1>ChocoShop Admin</h1></div><button onClick={()=>{localStorage.removeItem("chocoAdmin");setLogin(false)}}>Logout</button></div>
    <div className="stats">
      <div><span>Products</span><b>{products.length}</b></div>
      <div><span>Orders</span><b>{orders.length}</b></div>
      <div><span>Revenue</span><b>{money(orders.reduce((s,o)=>s+o.total,0))}</b></div>
    </div>

    <section className="adminSection">
      <div className="sectionTitle"><h2>{editing ? "Edit product" : "Add product"}</h2></div>
      <form className="productForm" onSubmit={saveProduct}>
        <input required placeholder="Product name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
        <input placeholder="Category" value={form.category} onChange={e=>setForm({...form,category:e.target.value})}/>
        <input required type="number" placeholder="Price" value={form.price} onChange={e=>setForm({...form,price:e.target.value})}/>
        <input required type="number" placeholder="Stock" value={form.stock} onChange={e=>setForm({...form,stock:e.target.value})}/>
        <input placeholder="Image URL" value={form.image} onChange={e=>setForm({...form,image:e.target.value})}/>
        <input placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/>
        <button className="primary">{editing ? "Update" : "Add"} product</button>
        {editing && <button type="button" onClick={()=>{setEditing(null);setForm({name:"",description:"",price:"",category:"Milk Chocolate",stock:"",image:""})}}>Cancel</button>}
      </form>
    </section>

    <section className="adminSection">
      <h2>Products</h2>
      <div className="tableWrap"><table><thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th></tr></thead>
      <tbody>{products.map(p=><tr key={p.id}><td><b>{p.name}</b></td><td>{p.category}</td><td>{money(p.price)}</td><td>{p.stock}</td><td>
        <button onClick={()=>{setEditing(p.id);setForm(p)}}>Edit</button>
        <button className="danger" onClick={()=>deleteProduct(p.id)}>Delete</button>
      </td></tr>)}</tbody></table></div>
    </section>

    <section className="adminSection">
      <h2>Orders</h2>
      <div className="tableWrap"><table><thead><tr><th>Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th></tr></thead>
      <tbody>{orders.map(o=><tr key={o.id}><td><b>{o.id}</b><small>{new Date(o.createdAt).toLocaleString()}</small></td><td>{o.customer.name}<small>{o.customer.email}</small></td><td>{o.items.map(i=><div key={i.productId}>{i.name} × {i.quantity}</div>)}</td><td>{money(o.total)}</td><td><select value={o.status} onChange={e=>status(o.id,e.target.value)}>{["Processing","Packed","Shipped","Delivered","Cancelled"].map(s=><option key={s}>{s}</option>)}</select></td></tr>)}</tbody></table></div>
    </section>
  </main>;
}

createRoot(document.getElementById("root")).render(<App />);
