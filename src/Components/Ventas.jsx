import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export default function Ventas() {
  const [ventas, setVentas] = useState([]);

  useEffect(() => {
    fetchVentas();
  }, []);

  const fetchVentas = async () => {
    // 1. Obtener todas las ventas
    const { data: ventasData, error: ventasError } = await supabase
      .from("venta")
      .select("*")
      .order("fecha", { ascending: false });
    
    if (ventasError) return console.error(ventasError);

    // 2. Obtener todos los detalles de venta
    const { data: detallesData, error: detallesError } = await supabase
      .from("detalleventa")
      .select("*");
    
    if (detallesError) return console.error(detallesError);

    // 3. Obtener todos los productos
    const { data: productosData, error: productosError } = await supabase
      .from("producto")
      .select("id, nombre");
    
    if (productosError) return console.error(productosError);

    // 4. Combinar los datos
    const ventasConDetalles = ventasData.map(venta => {
      // Buscar detalles de esta venta
      const detalles = detallesData.filter(d => d.venta_id === venta.id);
      
      // Enriquecer con información de productos
      const detallesConProductos = detalles.map(detalle => {
        const producto = productosData.find(p => p.id === detalle.producto_id);
        return {
          ...detalle,
          producto: producto || { nombre: "Producto eliminado" }
        };
      });

      return {
        ...venta,
        detalles: detallesConProductos
      };
    });

    setVentas(ventasConDetalles);
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
        Historial de Ventas
      </h1>
      
      {ventas.length === 0 ? (
        <p style={{ color: 'var(--color-shark-400)' }}>No hay ventas registradas</p>
      ) : (
        <div className="space-y-6">
          {ventas.map((venta) => (
            <div 
              key={venta.id} 
              className="p-4 rounded-lg shadow"
              style={{ 
                backgroundColor: 'var(--color-shark-900)',
                border: '1px solid var(--color-shark-700)',
                boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
              }}
            >
              {/* Encabezado de la venta */}
              <div 
                className="flex justify-between items-center pb-2"
                style={{ borderBottom: '1px solid var(--color-shark-700)' }}
              >
                <div>
                  <h3 
                    className="font-bold text-lg"
                    style={{ color: 'var(--color-polar-200)' }}
                  >
                    Venta #{venta.id}
                  </h3>
                  {venta.cliente && (
                    <p 
                      className="mt-1"
                      style={{ color: 'var(--color-blue-chill-400)' }}
                    >
                      Cliente: {venta.cliente}
                    </p>
                  )}
                </div>
                <p 
                  className="text-sm"
                  style={{ color: 'var(--color-shark-400)' }}
                >
                  {new Date(venta.fecha).toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </p>
              </div>
              
              {/* Total */}
              <p 
                className="my-3 font-bold"
                style={{ color: 'var(--color-polar-100)', fontSize: '1.25rem' }}
              >
                Total: ${venta.total.toFixed(2)}
              </p>
              
              {/* Detalles de productos */}
              <div className="mt-3">
                <h4 
                  className="font-medium mb-2"
                  style={{ color: 'var(--color-polar-300)' }}
                >
                  Productos:
                </h4>
                <ul className="space-y-2">
                  {venta.detalles.map((detalle, index) => (
                    <li 
                      key={index} 
                      className="flex justify-between py-1"
                      style={{ borderBottom: '1px solid var(--color-shark-800)' }}
                    >
                      <span style={{ color: 'var(--color-polar-100)' }}>
                        {detalle.cantidad}x {detalle.producto.nombre}
                      </span>
                      <span style={{ color: 'var(--color-polar-100)' }}>
                        ${(detalle.cantidad * detalle.precio_unitario).toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}