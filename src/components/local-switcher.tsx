'use client';
import { useLocale } from 'next-intl';
// @ts-ignore
import { usePathname, useRouter } from 'next-intl/client';
import { ChangeEvent, useTransition } from 'react';

const LocaleSwitcher = () => {
  const [isPending, startTransition] = useTransition();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function onSelectLocal(event: ChangeEvent<HTMLSelectElement>) {
    const nextLocaleSelected = event.target.value;
    startTransition(() => {
      document.cookie = `NEXT_LOCALE=${nextLocaleSelected}; path=/, max-age=31536000, SameSite=Lax`;
      router.replace(pathname, { locale: nextLocaleSelected });
      router.refresh();
    });
  }

  return (
    <label
      className={`
                relative text-sm text-white ${isPending && 'transition-opacity [&:disabled]:opacity-30'}
            `}
    >
      <select
        className="inline-flex cursor-pointer bg-transparent pb-2  pl-2 pr-1 pt-2"
        defaultValue={locale}
        disabled={isPending}
        onChange={onSelectLocal}
      >
        {['en']?.map((cur) => (
          <option
            key={cur}
            value={cur}
            className="text-black"
          >
            {cur.toUpperCase()}
          </option>
        ))}
      </select>
    </label>
  );
};

export default LocaleSwitcher;
