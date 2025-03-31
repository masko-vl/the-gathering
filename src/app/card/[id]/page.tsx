'use client'
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getCards } from '@/app/helpers/apis';
import Link from 'next/link';
import Image from 'next/image';
import { ICard } from '@/app/types';

const CardDetail = () => {
  const params = useParams();
  const cardId = params?.id as string;
  
  const [card, setCard] = useState<ICard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchCardDetail() {
      if (!cardId) return;
      
      try {
        setIsLoading(true);
        const response = await getCards(1, 10, undefined, cardId);
        
        if (response.cards.length > 0) {
          setCard(response.cards[0]);
        } else {
          setError('Card not found');
        }
      } catch (err) {
        console.error('Error fetching card details:', err);
        setError('Failed to load card details');
      } finally {
        setIsLoading(false);
      }
    }
    fetchCardDetail();
  }, []);
  
  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="h-[400px] bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }
  
  if (error || !card) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
          <p>{error || 'Card not found'}</p>
        </div>
        <Link 
          href="/"
          passHref
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to List
        </Link>
      </div>
    );
  }
  
  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3">
          {card.imageUrl ? (
            <div className="sticky top-6 w-full">
              <Image
                src={card.imageUrl}
                alt={card.name}
                width={223}
                height={310}
                className="w-full rounded-xl shadow-lg"
                onError={() => {
                  console.error('Image failed to load:', card.imageUrl);
                }}
              />
            </div>
          ) : (
            <div className="w-full h-[400px] bg-gray-100 rounded-xl flex items-center justify-center">
              <p className="text-gray-500">No image available</p>
            </div>
          )}
        </div>
        
        <div className="md:w-2/3">
          <Link 
            href="/" 
            className="inline-block mb-6 text-blue-600 hover:text-blue-800 transition-colors"
          >
            ← Back to List
          </Link>
          
          <h1 className="text-3xl font-bold mb-2 text-gray-800">{card.name}</h1>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {card.colors?.map(color => (
              <span key={color} className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded">
                {color}
              </span>
            ))}
            
            {card.rarity && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                {card.rarity}
              </span>
            )}
          </div>
          
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="font-medium text-gray-700">{card.type}</p>
            {card.manaCost && <p className="text-gray-600">Mana Cost: {card.manaCost}</p>}
          </div>
          
          {card.text && (
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2 text-gray-800">Card Text</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{card.text}</p>
            </div>
          )}
          
          {card.flavor && (
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2 text-gray-800">Flavor Text</h2>
              <p className="text-gray-700 italic">{card.flavor}</p>
            </div>
          )}
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            {card.artist && <p className="text-gray-600">Illustrated by {card.artist}</p>}
            {card.setName && <p className="text-gray-600">Set: {card.setName}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardDetail;