'use client';

import Link from 'next/link';
import Image from 'next/image';
import localFont from 'next/font/local';
import { cn } from '@/lib/utils';
import { useAuth } from '@clerk/nextjs';

const headingFont = localFont({
  src: '../public/fonts/open-sans.woff2',
});

export const Logo = () => {
  const { isLoaded, orgId } = useAuth(); // Используем useAuth

  if (!isLoaded) return null; // Если данные ещё загружаются, возвращаем пустое представление

  const href = orgId ? `/organization/${orgId}` : '/';

  return (
    <Link href={href}>
      <div className='hover:opacity-75 transition items-center gap-x-2 hidden md:flex'>
        <Image src='/logo.svg' alt='logo' height={30} width={30} />
        <p className={cn('tx-lg text-baseLight pb-1', headingFont.className)}>GuruTask</p>
      </div>
    </Link>
  );
};