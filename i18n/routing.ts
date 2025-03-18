import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';
import { languages } from './config';
 
export const routing = defineRouting({
  // A list of all locales that are supported
  locales: languages.map((item) => item.value),
 
  // Used when no locale matches
  defaultLocale: 'en',
  // localePrefix: 'always'
});
 
// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation(routing);