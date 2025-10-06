// src/Components/ItemCard.jsx
import React, { useState } from "react";

const ItemCard = ({ item, onRemove, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(item.name);
  const [editQty, setEditQty] = useState(item.quantity);
  const [editPurchase, setEditPurchase] = useState(
    item.purchaseDate
      ? new Date(item.purchaseDate).toISOString().split("T")[0]
      : ""
  );
  const [editExpiry, setEditExpiry] = useState(
    item.expiryDate ? new Date(item.expiryDate).toISOString().split("T")[0] : ""
  );

  const handleSave = () => {
    onEdit({
      ...item,
      name: editName,
      quantity: editQty,
      purchaseDate: new Date(editPurchase),
      expiryDate: new Date(editExpiry),
    });
    setIsEditing(false);
  };

  // Determine badge text and color
  const getBadge = () => {
    if (item.smsNotified) {
      return (
        <span className="bg-green-200 text-green-800 px-2 py-1 text-xs rounded-full">
          SMS Sent
        </span>
      );
    } else if (new Date(item.expiryDate) - new Date() <= 24 * 60 * 60 * 1000) {
      return (
        <span className="bg-yellow-200 text-yellow-800 px-2 py-1 text-xs rounded-full">
          SMS Pending
        </span>
      );
    }
    return null;
  };

  return (
    <div className="border p-4 rounded shadow hover:shadow-lg transition bg-white relative">
      {/* Badge */}
      <div className="absolute top-2 right-2">{getBadge()}</div>

      {isEditing ? (
        <div className="space-y-2">
          {/* Name */}
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="w-full px-3 py-1 border rounded focus:ring-2 focus:ring-emerald-500"
          />

          {/* Quantity */}
          <input
            type="number"
            min="1"
            value={editQty}
            onChange={(e) => setEditQty(Number(e.target.value))}
            className="w-full px-3 py-1 border rounded focus:ring-2 focus:ring-emerald-500"
          />

          {/* Purchase Date */}
          <input
            type="date"
            value={editPurchase}
            onChange={(e) => setEditPurchase(e.target.value)}
            className="w-full px-3 py-1 border rounded focus:ring-2 focus:ring-emerald-500"
          />

          {/* Expiry Date */}
          <input
            type="date"
            value={editExpiry}
            onChange={(e) => setEditExpiry(e.target.value)}
            className="w-full px-3 py-1 border rounded focus:ring-2 focus:ring-emerald-500"
          />

          {/* Save / Cancel */}
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

          {/* Show purchase + expiry dates */}
          {item.purchaseDate && (
            <p>
              Purchase Date: {new Date(item.purchaseDate).toLocaleDateString()}
            </p>
          )}
          {item.expiryDate && (
            <p className="text-red-600 font-medium">
              Expiry Date: {new Date(item.expiryDate).toLocaleDateString()}
            </p>
          )}

          {/* Edit / Delete */}
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
