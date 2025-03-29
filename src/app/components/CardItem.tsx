import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface Card {
  id: string;
  name: string;
  type: string;
  imageUrl?: string;
}

interface CardItemProps {
  card: Card;
}

const CardItem: React.FC<CardItemProps> = ({ card }) => {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      {card.imageUrl ? (
        <div className="relative w-full h-[310px] bg-gray-100">
            <Image 
              src={card.imageUrl}
              alt={card.name}
              width={223}
              height={310}
              className="w-full h-full object-contain p-4"
            />
        </div>
      ) : (
        <div className="w-full h-[310px] bg-gray-100 flex items-center justify-center">
          <p className="text-gray-500">No image available</p>
        </div>
      )}
      
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2 text-gray-800 line-clamp-1">{card.name}</h2>
        <p className="text-sm text-gray-600 mb-4">{card.type}</p>
        <Link 
          href={`/card/${card.id}`}
          className="w-full inline-block text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default CardItem;
