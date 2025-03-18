import { languages } from "@/i18n/config";

interface HeadInfoProps {
  locale: string;
  page?: string;
  title: string;
  description: string;
  keywords: string;
}

const HeadInfo: React.FC<HeadInfoProps> = ({
  locale,
  page,
  title,
  description,
  keywords,
}) => {
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      {
        languages.map((item) => {
          const currentPage = page;
          let hrefLang: string = item.value;
          if (item.value == 'en') {
            hrefLang = 'x-default';
          }
          let href: string;
          if (currentPage) {
            href = `${process.env.NEXT_PUBLIC_SITE_URL}/${item.value}/${currentPage}`;
            if (item.value == 'en') {
              href = `${process.env.NEXT_PUBLIC_SITE_URL}/${currentPage}`;
            }
          } else {
            href = `${process.env.NEXT_PUBLIC_SITE_URL}/${item.value}`;
            if (item.value == 'en') {
              href = `${process.env.NEXT_PUBLIC_SITE_URL}/`;
            }
          }
          return <link key={href} rel="alternate" hrefLang={hrefLang} href={href} />
        })
      }
      {
        languages.map((item) => {
          const currentPage = page;
          let hrefLang = item.value;
          let href: string;
          if (currentPage) {
            href = `${process.env.NEXT_PUBLIC_SITE_URL}/${item.value}/${currentPage}`;
            if (item.value == 'en') {
              href = `${process.env.NEXT_PUBLIC_SITE_URL}/${currentPage}`;
            }
          } else {
            href = `${process.env.NEXT_PUBLIC_SITE_URL}/${item.value}`;
            if (item.value == 'en') {
              href = `${process.env.NEXT_PUBLIC_SITE_URL}/`;
            }
          }
          if (locale == item.value) {
            return <link key={href + 'canonical'} rel="canonical" hrefLang={hrefLang} href={href} />
          }
        })
      }
    </>
  )
}

export default HeadInfo
