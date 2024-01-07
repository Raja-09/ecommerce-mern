// SimpleProductCard.jsx
import React from 'react';

const ProductCard = ({ product }) => {
  return (
    <div className="product-card overflow-hidden shadow-lg flex flex-col p-6 rounded-xl my-5">
      <img
        className="w-full h-48 object-cover object-center"
        src="https://via.placeholder.com/300" // Placeholder image URL
        alt={product.name}
      />
      <div className="px-6 py-4 flex-grow">
        <div className="font-bold text-xl mb-2">{product.name}</div>
      </div>
      <div className="px-6 py-4">
        <p className="text-gray-700 text-base">${product.price.toFixed(2)}</p>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2">
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
