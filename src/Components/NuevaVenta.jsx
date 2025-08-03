import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

function NuevaVenta() {
  const [productos, setProductos] = useState([]);
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [cliente, setCliente] = useState("");
  const [errores, setErrores] = useState({ cliente: "" }); // Estado para errores

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    const { data, error } = await supabase.from("producto").select("*");
    if (error) console.error("Error cargando productos:", error);
    else setProductos(data);
  };

  const agregarProducto = (producto) => {
    setProductosSeleccionados([...productosSeleccionados, {
      ...producto,
      cantidad: 1
    }]);
  };

  const actualizarCantidad = (id, nuevaCantidad) => {
    setProductosSeleccionados(prev => 
      prev.map(p => p.id === id ? {...p, cantidad: Number(nuevaCantidad)} : p)
    );
  };

  const eliminarProducto = (id) => {
    setProductosSeleccionados(prev => prev.filter(p => p.id !== id));
  };

  const validarFormulario = () => {
    const nuevosErrores = {};
    
    // Validar nombre del cliente
    if (!cliente.trim()) {
      nuevosErrores.cliente = "El nombre del cliente es requerido";
    }
    
    // Validar que haya productos en el carrito
    if (productosSeleccionados.length === 0) {
      nuevosErrores.productos = "Debe agregar al menos un producto al carrito";
    }
    
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const finalizarVenta = async () => {
    // Validar formulario antes de continuar
    if (!validarFormulario()) return;
    
    try {
      // 1. Crear la venta con el cliente
      const { data: venta, error } = await supabase
        .from("venta")
        .insert([{ 
          total: productosSeleccionados.reduce((sum, p) => sum + (p.precio * p.cantidad), 0),
          cliente: cliente.trim()
        }])
        .select()
        .single();

      if (error) throw error;

      // 2. Crear detalles de venta
      const detalles = productosSeleccionados.map(p => ({
        venta_id: venta.id,
        producto_id: p.id,
        cantidad: p.cantidad,
        precio_unitario: p.precio
      }));

      const { error: detalleError } = await supabase
        .from("detalleventa")
        .insert(detalles);

      if (detalleError) throw detalleError;

      // 3. Actualizar stock
      await Promise.all(
        productosSeleccionados.map(async (producto) => {
          const nuevoStock = producto.stock - producto.cantidad;
          await supabase
            .from("producto")
            .update({ stock: nuevoStock })
            .eq("id", producto.id);
        })
      );

      // Éxito
      alert("Venta registrada correctamente!");
      
      // Limpiar carrito
      setProductosSeleccionados([]);
      setCliente("");
      setErrores({});

      // Recargar productos para actualizar stock
      fetchProductos();

    } catch (error) {
      console.error("Error en la venta:", error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div 
      className="container mx-auto p-4 min-h-screen"
      style={{ backgroundColor: 'var(--color-shark-950)', color: 'var(--color-shark-100)' }}
    >
      <h1 
        className="text-2xl font-bold mb-6"
        style={{ color: 'var(--color-polar-200)' }}
      >
        Nueva Venta
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Lista de productos disponibles */}
        <div>
          <h2 
            className="text-xl font-semibold mb-4"
            style={{ color: 'var(--color-polar-300)' }}
          >
            Productos Disponibles
          </h2>
          <div className="space-y-2">
            {productos.map((producto) => (
              <div 
                key={producto.id} 
                className="p-3 rounded-lg flex justify-between items-center"
                style={{ 
                  backgroundColor: 'var(--color-shark-900)',
                  border: '1px solid var(--color-shark-700)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}
              >
                <div>
                  <p 
                    className="font-medium"
                    style={{ color: 'var(--color-polar-100)' }}
                  >
                    {producto.nombre}
                  </p>
                  <p style={{ color: 'var(--color-shark-400)' }}>
                    ${producto.precio} | Stock: {producto.stock}
                  </p>
                </div>
                <button 
                  onClick={() => agregarProducto(producto)}
                  className="px-3 py-1 rounded-md font-bold"
                  style={{ 
                    backgroundColor: 'var(--color-blue-chill-700)',
                    color: 'var(--color-polar-100)',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = 'var(--color-blue-chill-600)'}
                  onMouseOut={(e) => e.target.style.backgroundColor = 'var(--color-blue-chill-700)'}
                >
                  +
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Carrito de compras */}
        <div 
          className="p-4 rounded-lg"
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
            Carrito
          </h2>
          
          <div className="mb-4">
            <label 
              className="block mb-1"
              style={{ color: 'var(--color-shark-300)' }}
            >
              Cliente:
            </label>
            <input
              type="text"
              placeholder="Nombre del cliente"
              value={cliente}
              onChange={(e) => setCliente(e.target.value)}
              className={`w-full p-2 border rounded ${
                errores.cliente ? "border-red-500" : "border-shark-600"
              }`}
              style={{ 
                backgroundColor: 'var(--color-shark-800)',
                color: 'var(--color-polar-100)'
              }}
            />
            {errores.cliente && (
              <p className="text-red-400 text-sm mt-1">{errores.cliente}</p>
            )}
          </div>
          
          <div className="space-y-3 mb-4">
            {productosSeleccionados.length > 0 ? (
              productosSeleccionados.map((producto) => (
                <div 
                  key={producto.id} 
                  className="flex justify-between items-center pb-3"
                  style={{ borderBottom: '1px solid var(--color-shark-700)' }}
                >
                  <div>
                    <p 
                      className="font-medium"
                      style={{ color: 'var(--color-polar-100)' }}
                    >
                      {producto.nombre}
                    </p>
                    <div className="flex items-center mt-1">
                      <span style={{ color: 'var(--color-shark-400)' }}>Cantidad: </span>
                      <input
                        type="number"
                        min="1"
                        max={producto.stock}
                        value={producto.cantidad}
                        onChange={(e) => actualizarCantidad(producto.id, e.target.value)}
                        className="w-16 ml-2 p-1 border rounded"
                        style={{ 
                          backgroundColor: 'var(--color-shark-800)',
                          borderColor: 'var(--color-shark-600)',
                          color: 'var(--color-polar-100)'
                        }}
                      />
                    </div>
                  </div>
                  <div className="text-right">
                    <p style={{ color: 'var(--color-polar-100)' }}>
                      ${(producto.precio * producto.cantidad).toFixed(2)}
                    </p>
                    <button 
                      onClick={() => eliminarProducto(producto.id)}
                      style={{ 
                        color: 'var(--color-blue-chill-400)',
                        fontWeight: '500'
                      }}
                      className="mt-1 hover:underline"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-4" style={{ color: 'var(--color-shark-400)' }}>
                No hay productos en el carrito
              </p>
            )}
          </div>
          
          {/* Total */}
          <div 
            className="flex justify-between font-bold text-lg mb-4 p-3 rounded"
            style={{ 
              backgroundColor: 'var(--color-shark-800)',
              color: 'var(--color-polar-100)',
              border: '1px solid var(--color-shark-700)'
            }}
          >
            <span>Total:</span>
            <span>
              ${productosSeleccionados.reduce((sum, p) => sum + (p.precio * p.cantidad), 0).toFixed(2)}
            </span>
          </div>
          
          {/* Mensaje de error para productos */}
          {errores.productos && (
            <div className="mb-4 p-2 rounded text-center bg-red-900/30 text-red-300 border border-red-700">
              {errores.productos}
            </div>
          )}
          
          <button 
            onClick={finalizarVenta}
            className="w-full py-2 px-4 rounded font-bold"
            style={{ 
              backgroundColor: 'var(--color-blue-chill-700)',
              color: 'var(--color-polar-100)',
              transition: 'all 0.2s',
              border: '1px solid var(--color-blue-chill-500)'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = 'var(--color-blue-chill-600)';
              e.target.style.transform = 'scale(1.02)';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = 'var(--color-blue-chill-700)';
              e.target.style.transform = 'scale(1)';
            }}
          >
            Finalizar Venta
          </button>
        </div>
      </div>
    </div>
  );
}

export default NuevaVenta;