import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

function Product() {
  const [productList, setProductList] = useState([]);
  const [newProduct, setNewProduct] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase.from("Product").select("*");
    if (error) {
      console.log("Error fetching", error);
    } else {
      setProductList(data);
    }
  };

  const addProduct = async () => {
    const newProductData = {
      name: newProduct,
      price: newPrice,
    };

    const { error } = await supabase.from("Product").insert([newProductData]);

    if (error) {
      console.log("Error add product: ", error);
    } else {
      fetchProducts();
      setNewProduct("");
      setNewPrice("");
    }
  };

  const deleteProduct = async (id) => {
    const { error } = await supabase.from("Product").delete().eq("id", id);

    if (error) {
      console.log("error deleting task", error);
    } else {
      setProductList((prev) => prev.filter((product) => product.id !== id));
    }
  };

  const startEditing = (product) => {
    setEditingId(product.id);
    setEditName(product.name);
    setEditPrice(product.price);
  };

  const updateProduct = async () => {
    if (!editingId) return;

    const { error } = await supabase
      .from("Product")
      .update({
        name: editName,
        price: editPrice,
      })
      .eq("id", editingId);

    if (error) {
      console.log("Error updating product: ", error);
    } else {
      setProductList(
        productList.map((product) =>
          product.id === editingId
            ? { ...product, name: editName, price: editPrice }
            : product
        )
      );
      setEditingId(null);
      setEditName("");
      setEditPrice("");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditPrice("");
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Lista de Productos
      </h1>

      <div className="bg-gray-600 p-4 rounded-lg shadow-md mb-6">
        <div className="flex flex-col space-y-2 mb-4">
          <input
            type="text"
            placeholder="Nombre del producto"
            value={newProduct}
            onChange={(e) => setNewProduct(e.target.value)}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Precio"
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
            className="p-2 border rounded"
          />
        </div>
        <button
          onClick={addProduct}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        >
          Agregar Producto
        </button>
      </div>

      <ul className="space-y-4">
        {productList.map((product) => (
          <li key={product.id} className="bg-gray-600 p-4 rounded-lg shadow">
            {editingId === product.id ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  className="w-full p-2 border rounded"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={updateProduct}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="flex-1 bg-white hover:bg-gray-600 text-white py-1 px-3 rounded"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="font-semibold text-lg">{product.name}</h3>
                <p className="text-white mb-2">${product.price}</p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => startEditing(product)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Product;
