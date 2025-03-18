import { cn } from "@/lib/utils";
import {Link} from '@/i18n/routing';
import Image from 'next/image';
import { ThemeToggle } from "./theme-toggle";
import { LanguageToggle } from "./language-toggle";
import { useTranslations } from 'next-intl';

export default function Header({ className }: { className?: string }) {
  const t = useTranslations('Header');
  return (
    <div className={cn(`sticky top-0 z-50 w-full border-b bg-background`, className)}>
      <div className="container mx-auto">
        <div className="flex h-16 items-center justify-between">
          {/* header left */}
          <div className="flex justify-start items-center gap-4">
            <Link href="/" className="flex items-center gap-4">
              <Image src="/logo.png" alt="logo" width={32} height={32} />
              <h1 className="md:text-2xl font-bold">{t('title')}</h1>
            </Link>
          </div>
          {/* header right */}
          <div className="flex justify-end items-center gap-4">
            {/* dark mode toggle */}
            <ThemeToggle />
            {/* language toggle */}
            <LanguageToggle />
          </div>
        </div>
      </div>
    </div>
  );
}