import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

function Producto() {
  const [productos, setProductos] = useState([]);
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");
  const [categoria, setCategoria] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [editNombre, setEditNombre] = useState("");
  const [editPrecio, setEditPrecio] = useState("");
  const [editStock, setEditStock] = useState("");
  const [editCategoria, setEditCategoria] = useState("");
  
  // Estados para errores de validación
  const [errores, setErrores] = useState({});
  const [editErrores, setEditErrores] = useState({});

  // Cargar productos al iniciar
  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    const { data, error } = await supabase.from("producto").select("*");
    if (error) console.error("Error cargando productos:", error);
    else setProductos(data);
  };

  // Validar formulario de agregar
  const validarFormulario = () => {
    const nuevosErrores = {};
    
    if (!nombre.trim()) nuevosErrores.nombre = "El nombre es requerido";
    
    // SOLUCIÓN: Cambiar la validación para manejar valores no numéricos
    if (precio === "" || precio === null) nuevosErrores.precio = "El precio es requerido";
    else if (isNaN(Number(precio)) || precio.trim() === "") nuevosErrores.precio = "Precio debe ser un número";
    
    if (stock === "" || stock === null) nuevosErrores.stock = "El stock es requerido";
    else if (isNaN(Number(stock)) || stock.trim() === "") nuevosErrores.stock = "Stock debe ser un número";
    
    if (!categoria.trim()) nuevosErrores.categoria = "La categoría es requerida";
    
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // Validar formulario de edición
  const validarFormularioEdicion = () => {
    const nuevosErrores = {};
    
    if (!editNombre.trim()) nuevosErrores.nombre = "El nombre es requerido";
    
    // SOLUCIÓN: Cambiar la validación para manejar valores no numéricos
    if (editPrecio === "" || editPrecio === null) nuevosErrores.precio = "El precio es requerido";
    else if (isNaN(Number(editPrecio)) || editPrecio.trim() === "") nuevosErrores.precio = "Precio debe ser un número";
    
    if (editStock === "" || editStock === null) nuevosErrores.stock = "El stock es requerido";
    else if (isNaN(Number(editStock)) || editStock.trim() === "") nuevosErrores.stock = "Stock debe ser un número";
    
    if (!editCategoria.trim()) nuevosErrores.categoria = "La categoría es requerida";
    
    setEditErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // Agregar producto
  const agregarProducto = async () => {
    if (!validarFormulario()) return;
    
    const { error } = await supabase.from("producto").insert([{
      nombre,
      precio: parseFloat(precio),
      stock: parseInt(stock),
      categoria
    }]);
    
    if (error) {
      console.error("Error agregando producto:", error);
      setErrores({ general: "Error al agregar el producto" });
    } else {
      fetchProductos();
      setNombre(""); setPrecio(""); setStock(""); setCategoria("");
      setErrores({});
    }
  };

  // Eliminar producto
  const eliminarProducto = async (id) => {
    const { error } = await supabase.from("producto").delete().eq("id", id);
    if (error) console.error("Error eliminando producto:", error);
    else setProductos(productos.filter(p => p.id !== id));
  };

  // Iniciar edición
  const iniciarEdicion = (producto) => {
    setEditandoId(producto.id);
    setEditNombre(producto.nombre);
    setEditPrecio(String(producto.precio)); // Convertir a string
    setEditStock(String(producto.stock)); // Convertir a string
    setEditCategoria(producto.categoria);
    setEditErrores({});
  };

  // Guardar edición
  const guardarEdicion = async () => {
    if (!validarFormularioEdicion()) return;
    
    const { error } = await supabase
      .from("producto")
      .update({
        nombre: editNombre,
        precio: parseFloat(editPrecio),
        stock: parseInt(editStock),
        categoria: editCategoria
      })
      .eq("id", editandoId);

    if (error) {
      console.error("Error actualizando producto:", error);
      setEditErrores({ general: "Error al actualizar el producto" });
    } else {
      fetchProductos();
      cancelarEdicion();
    }
  };

  // Cancelar edición
  const cancelarEdicion = () => {
    setEditandoId(null);
    setEditNombre(""); setEditPrecio(""); setEditStock(""); setEditCategoria("");
    setEditErrores({});
  };

  return (
    <div 
      className="p-6 min-h-screen"
      style={{ backgroundColor: 'var(--color-shark-950)', color: 'var(--color-polar-100)' }}
    >
      <h1 
        className="text-2xl font-bold mb-6"
        style={{ color: 'var(--color-polar-200)' }}
      >
        Gestión de Productos
      </h1>
      
      {/* Formulario de agregar/editar */}
      <div 
        className="p-4 rounded-lg shadow-md mb-6"
        style={{ 
          backgroundColor: 'var(--color-shark-900)',
          border: '1px solid var(--color-shark-700)',
          boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
        }}
      >
        <h2 
          className="text-xl font-semibold mb-4"
          style={{ color: 'var(--color-polar-300)' }}
        >
          {editandoId ? "Editar Producto" : "Agregar Producto"}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <input
              type="text"
              placeholder="Nombre"
              value={editandoId ? editNombre : nombre}
              onChange={(e) => editandoId ? setEditNombre(e.target.value) : setNombre(e.target.value)}
              className={`w-full p-2 border rounded ${
                (errores.nombre && !editandoId) || (editErrores.nombre && editandoId) 
                ? "border-red-500" : "border-shark-600"
              }`}
              style={{ 
                backgroundColor: 'var(--color-shark-800)',
                color: 'var(--color-polar-100)'
              }}
            />
            {(errores.nombre && !editandoId) && (
              <p className="text-red-400 text-sm mt-1">{errores.nombre}</p>
            )}
            {(editErrores.nombre && editandoId) && (
              <p className="text-red-400 text-sm mt-1">{editErrores.nombre}</p>
            )}
          </div>
          
          <div>
            {/* SOLUCIÓN: Cambiar a type="text" para manejar mejor los errores */}
            <input
              type="text"
              placeholder="Precio"
              value={editandoId ? editPrecio : precio}
              onChange={(e) => editandoId ? setEditPrecio(e.target.value) : setPrecio(e.target.value)}
              className={`w-full p-2 border rounded ${
                (errores.precio && !editandoId) || (editErrores.precio && editandoId) 
                ? "border-red-500" : "border-shark-600"
              }`}
              style={{ 
                backgroundColor: 'var(--color-shark-800)',
                color: 'var(--color-polar-100)'
              }}
            />
            {(errores.precio && !editandoId) && (
              <p className="text-red-400 text-sm mt-1">{errores.precio}</p>
            )}
            {(editErrores.precio && editandoId) && (
              <p className="text-red-400 text-sm mt-1">{editErrores.precio}</p>
            )}
          </div>
          
          <div>
            {/* SOLUCIÓN: Cambiar a type="text" para manejar mejor los errores */}
            <input
              type="text"
              placeholder="Stock"
              value={editandoId ? editStock : stock}
              onChange={(e) => editandoId ? setEditStock(e.target.value) : setStock(e.target.value)}
              className={`w-full p-2 border rounded ${
                (errores.stock && !editandoId) || (editErrores.stock && editandoId) 
                ? "border-red-500" : "border-shark-600"
              }`}
              style={{ 
                backgroundColor: 'var(--color-shark-800)',
                color: 'var(--color-polar-100)'
              }}
            />
            {(errores.stock && !editandoId) && (
              <p className="text-red-400 text-sm mt-1">{errores.stock}</p>
            )}
            {(editErrores.stock && editandoId) && (
              <p className="text-red-400 text-sm mt-1">{editErrores.stock}</p>
            )}
          </div>
          
          <div>
            <input
              type="text"
              placeholder="Categoría"
              value={editandoId ? editCategoria : categoria}
              onChange={(e) => editandoId ? setEditCategoria(e.target.value) : setCategoria(e.target.value)}
              className={`w-full p-2 border rounded ${
                (errores.categoria && !editandoId) || (editErrores.categoria && editandoId) 
                ? "border-red-500" : "border-shark-600"
              }`}
              style={{ 
                backgroundColor: 'var(--color-shark-800)',
                color: 'var(--color-polar-100)'
              }}
            />
            {(errores.categoria && !editandoId) && (
              <p className="text-red-400 text-sm mt-1">{errores.categoria}</p>
            )}
            {(editErrores.categoria && editandoId) && (
              <p className="text-red-400 text-sm mt-1">{editErrores.categoria}</p>
            )}
          </div>
        </div>

        {/* Mensaje de error general */}
        {(errores.general || editErrores.general) && (
          <div className="mb-4 p-3 rounded text-center bg-red-900/30 text-red-300 border border-red-700">
            {errores.general || editErrores.general}
          </div>
        )}

        <div className="flex space-x-2">
          {editandoId ? (
            <>
              <button
                onClick={guardarEdicion}
                className="py-2 px-4 rounded font-bold"
                style={{ 
                  backgroundColor: 'var(--color-blue-chill-700)',
                  color: 'var(--color-polar-100)',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = 'var(--color-blue-chill-600)'}
                onMouseOut={(e) => e.target.style.backgroundColor = 'var(--color-blue-chill-700)'}
              >
                Guardar Cambios
              </button>
              <button
                onClick={cancelarEdicion}
                className="py-2 px-4 rounded font-bold"
                style={{ 
                  backgroundColor: 'var(--color-shark-700)',
                  color: 'var(--color-polar-100)',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = 'var(--color-shark-600)'}
                onMouseOut={(e) => e.target.style.backgroundColor = 'var(--color-shark-700)'}
              >
                Cancelar
              </button>
            </>
          ) : (
            <button
              onClick={agregarProducto}
              className="py-2 px-4 rounded font-bold"
              style={{ 
                backgroundColor: 'var(--color-blue-chill-700)',
                color: 'var(--color-polar-100)',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = 'var(--color-blue-chill-600)'}
              onMouseOut={(e) => e.target.style.backgroundColor = 'var(--color-blue-chill-700)'}
            >
              Agregar Producto
            </button>
          )}
        </div>
      </div>

      {/* Lista de productos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {productos.map((producto) => (
          <div 
            key={producto.id} 
            className="p-4 rounded-lg"
            style={{ 
              backgroundColor: 'var(--color-shark-900)',
              border: '1px solid var(--color-shark-700)',
              boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
            }}
          >
            {editandoId === producto.id ? (
              <div 
                className="animate-pulse text-center py-4"
                style={{ color: 'var(--color-polar-300)' }}
              >
                Editando...
              </div>
            ) : (
              <>
                <h3 
                  className="font-bold text-lg mb-2"
                  style={{ color: 'var(--color-polar-200)' }}
                >
                  {producto.nombre}
                </h3>
                <p style={{ color: 'var(--color-polar-100)' }}>
                  Precio: ${producto.precio}
                </p>
                <p style={{ color: 'var(--color-polar-100)' }}>
                  Stock: {producto.stock}
                </p>
                <p style={{ color: 'var(--color-polar-100)' }}>
                  Categoría: {producto.categoria}
                </p>
                
                <div className="flex space-x-2 mt-4">
                  <button
                    onClick={() => iniciarEdicion(producto)}
                    className="py-1 px-3 rounded font-medium"
                    style={{ 
                      backgroundColor: 'var(--color-blue-chill-700)',
                      color: 'var(--color-polar-100)',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = 'var(--color-blue-chill-600)'}
                    onMouseOut={(e) => e.target.style.backgroundColor = 'var(--color-blue-chill-700)'}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => eliminarProducto(producto.id)}
                    className="py-1 px-3 rounded font-medium"
                    style={{ 
                      backgroundColor: 'var(--color-shark-700)',
                      color: 'var(--color-polar-100)',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = 'var(--color-shark-600)'}
                    onMouseOut={(e) => e.target.style.backgroundColor = 'var(--color-shark-700)'}
                  >
                    Eliminar
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Producto;