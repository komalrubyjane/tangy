import { useState, useEffect } from 'react';

const INITIAL_ARTISTS = [
  { id: 1, name: 'KALI', genre: 'Techno / Dark Ambient', bio: 'Sonic architect from Hyderabad weaving dark rituals in sound.', status: 'available', color: '#E5C07B', tags: ['Techno', 'Ambient'], avatar: '/artists/artist1.jpg', appStatus: 'approved' },
  { id: 2, name: 'Zephyr Rao', genre: 'Deep House / Afrobeat', bio: 'Blending Carnatic roots with underground club culture.', status: 'booked', color: '#E5C07B', tags: ['House', 'Afrobeat'], avatar: '/artists/artist2.jpg', appStatus: 'approved' },
  { id: 3, name: 'Neon Sufi', genre: 'Psytrance / World', bio: 'Spiritual frequencies meet electronic ecstasy.', status: 'tentative', color: '#22d3ee', tags: ['Psytrance', 'World'], avatar: '/artists/artist3.jpg', appStatus: 'approved' },
  { id: 4, name: 'Arka Singh', genre: 'Jazz Fusion / Electronic', bio: 'Jazz improvisations dissolved into digital ether.', status: 'available', color: '#4ade80', tags: ['Jazz', 'Electronic'], avatar: '/artists/artist4.jpg', appStatus: 'approved' },
  { id: 5, name: 'MIRA', genre: 'Drum & Bass / Industrial', bio: 'Mechanical rhythms, human emotion. Precision in chaos.', status: 'available', color: '#f87171', tags: ['D&B', 'Industrial'], avatar: '/artists/artist5.jpg', appStatus: 'approved' },
  { id: 6, name: 'Cobalt', genre: 'Minimal Techno', bio: 'Stripping sound to its purest, most hypnotic form.', status: 'unavailable', color: '#60a5fa', tags: ['Minimal', 'Techno'], avatar: '/artists/artist6.jpg', appStatus: 'approved' },
];

export const getStoreData = (key, initial) => {
  try {
    const data = localStorage.getItem(`tangy_${key}`);
    return data ? JSON.parse(data) : initial;
  } catch (e) {
    return initial;
  }
};

export const setStoreData = (key, data) => {
  localStorage.setItem(`tangy_${key}`, JSON.stringify(data));
  window.dispatchEvent(new Event('tangy_store_update'));
};

export function useSharedStore(key, initialData) {
  const [data, setData] = useState(() => getStoreData(key, initialData));

  useEffect(() => {
    const handleUpdate = () => {
      setData(getStoreData(key, initialData));
    };
    window.addEventListener('tangy_store_update', handleUpdate);
    window.addEventListener('storage', handleUpdate); // For cross-tab sync
    return () => {
      window.removeEventListener('tangy_store_update', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [key, initialData]);

  const updateData = (newData) => {
    const updated = typeof newData === 'function' ? newData(data) : newData;
    setData(updated);
    setStoreData(key, updated);
  };

  return [data, updateData];
}

export const MOCK_INITIAL_ARTISTS = INITIAL_ARTISTS;
