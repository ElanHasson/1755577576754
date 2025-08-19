import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Qubits, Cats, and Coffee',
  description: 'A lighthearted introduction to quantum computing that explains the big ideas over everyday examples.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}