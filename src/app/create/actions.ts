'use server';

import dbConnect from '@/app/lib/mongodb';
import bingocard from '@/app/models/bingocard';
import { getSession } from '@/app/lib/session.server';
import { redirect } from 'next/navigation';
import { success } from 'zod';

export async function createBingoCard(_: any, formData: FormData) {
  const getString = (key: string) => {
    const val = formData.get(key);
    return typeof val === 'string' ? val : '';
  };

  const getArrayFromCommaString = (key: string) => {
    const val = getString(key);
    return val.split(',').map(s => s.trim()).filter(Boolean);
  };

  let rawslotEntries: string[] = [];
try {
  const raw = formData.get('slotEntries');
  if (typeof raw === 'string') {
    rawslotEntries = JSON.parse(raw);

    // Insert "FREE SPOT" at center index
    const gridSize = parseInt(getString('gridsize'), 10) || 25;
    const centerIndex = gridSize % 2 === 1 ? Math.floor(gridSize / 2) : -1;
    if (centerIndex >= 0) {
      rawslotEntries[centerIndex] = "FREE SPOT";
    }
  }
} catch (error) {
  console.error('Invalid slot entries JSON:', error);
  return { message: 'Invalid slot entries format' };
}

  let slotEntries: { slot: number; text: string; photo: string; status: boolean; }[] = []
  rawslotEntries.forEach((entry, i) => {
    slotEntries.push({
      slot: i,
      text: entry,
      photo: "",
      status: false
    })
  })
  const cardData = {
    name: getString('name'),
    public: formData.get('public') === 'on',
    friendsCanView: formData.get('friendsCanView') === 'on',
    photoEnabled: formData.get('photoEnabled') === 'on',
    gridsize: parseInt(getString('gridsize'), 10) || 25,
    slotEntries,
    participants: getArrayFromCommaString('participants'),
  };

  try {
    await dbConnect();
    const session = await getSession();

    if (!session) {
      return { message: 'Unauthorized' };
    }

    const newCard = await bingocard.create({
      ...cardData,
      createdBy: session.userId,
      author: session.username
    });

    // Redirect or return success
    return{success:true} // Change this to your actual route
  } catch (err) {
    console.error(err);
    return { message: 'Something went wrong. Try again later.' };
  }
}
