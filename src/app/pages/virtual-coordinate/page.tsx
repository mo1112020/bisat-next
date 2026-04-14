import type { Metadata } from 'next';
import { VirtualCoordinate } from '@/src/views/VirtualCoordinate';

export const metadata: Metadata = {
  title: 'Virtual Coordinate',
  description: 'Get help visualizing rugs in your room before you decide.',
};

export default function VirtualCoordinatePage() {
  return <VirtualCoordinate />;
}
