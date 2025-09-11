// src/Components/ItemCard.jsx
import React, { useState } from "react";

const ItemCard = ({ item, onRemove, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(item.name);
  const [editQty, setEditQty] = useState(item.quantity);
  const [editExpiry, setEditExpiry] = useState(
    new Date(item.expiryDate).toISOString().split("T")[0]
  );

  const handleSave = () => {
    onEdit({
      ...item,
      name: editName,
      quantity: editQty,
      expiryDate: new Date(editExpiry),
    });
    setIsEditing(false);
  };

  return (
    <div className="border p-4 rounded shadow hover:shadow-lg transition bg-white">
      {isEditing ? (
        <div className="space-y-2">
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="w-full px-3 py-1 border rounded focus:ring-2 focus:ring-emerald-500"
          />
          <input
            type="number"
            min="1"
            value={editQty}
            onChange={(e) => setEditQty(Number(e.target.value))}
            className="w-full px-3 py-1 border rounded focus:ring-2 focus:ring-emerald-500"
          />
          <input
            type="date"
            value={editExpiry}
            onChange={(e) => setEditExpiry(e.target.value)}
            className="w-full px-3 py-1 border rounded focus:ring-2 focus:ring-emerald-500"
          />
          <div className="flex justify-between mt-2">
            <button
              onClick={handleSave}
              className="bg-emerald-500 text-white px-3 py-1 rounded hover:bg-emerald-600"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          <h2 className="font-bold text-lg">{item.name}</h2>
          <p>Quantity: {item.quantity}</p>
          <p>
            Expiry Date: {new Date(item.expiryDate).toLocaleDateString()}
          </p>
          <div className="flex justify-between mt-2">
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              Edit
            </button>
            <button
              onClick={onRemove}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemCard;
