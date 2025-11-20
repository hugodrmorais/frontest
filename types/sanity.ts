export type Maybe<T> = T | null | undefined;

export type SanityImage = {
  alt?: string;
  caption?: string;
  asset?: {
    _id: string;
    url: string;
    metadata?: {
      dimensions?: {
        width?: number;
        height?: number;
      };
    };
  };
};

export type LinkType = "internal" | "external";

export type SanityLink = {
  label: string;
  linkType: LinkType;
  internalPath?: string;
  href?: string;
  openInNewTab?: boolean;
};

export type FooterLink = {
  icon?: string;
  link: SanityLink;
};

export type FooterColumn = {
  title: string;
  body?: Maybe<string[]>;
  links?: Maybe<FooterLink[]>;
};

export type Footer = {
  title?: string;
  columns?: Maybe<FooterColumn[]>;
  legal?: Maybe<SanityLink[]>;
};

export type Address = {
  street?: string;
  postalCode?: string;
  city?: string;
  country?: string;
};

export type ContactInfo = {
  phone?: string;
  email?: string;
  address?: Maybe<Address>;
};

export type SocialLink = {
  service: string;
  url: string;
};

export type SeoSettings = {
  title?: string;
  description?: string;
  noIndex?: boolean;
  image?: Maybe<SanityImage>;
};

// Home Page / Builder

export type BlockLayoutWidth = "container" | "full";
export type BlockLayoutBackground = "default" | "muted" | "brand" | "image";
export type BlockLayoutTheme = "light" | "dark";
export type BlockLayoutAlign = "left" | "center";
export type BlockLayoutPadding = "none" | "sm" | "md" | "lg";

export type BlockLayout = {
  width?: BlockLayoutWidth;
  background?: BlockLayoutBackground;
  backgroundImage?: Maybe<SanityImage>;
  theme?: BlockLayoutTheme;
  align?: BlockLayoutAlign;
  paddingTop?: BlockLayoutPadding;
  paddingBottom?: BlockLayoutPadding;
};

export type MediaLayout = {
  mediaPosition?: "left" | "right" | "top";
  mediaWidth?: number;
  mediaFit?: "cover" | "contain";
};

export type GridLayout = {
  columns?: number;
  gap?: "sm" | "md" | "lg";
};

// Content blocks

export type HeroBlock = {
  _type: "heroBlock";
  _key: string;
  title: string;
  summary?: string;
  media?: Maybe<SanityImage>;
  actions?: Maybe<
    Array<{
      label: string;
      href?: string;
      openInNewTab?: boolean;
    }>
  >;
  layout?: BlockLayout;
  mediaLayout?: MediaLayout;
};

export type TextBlock = {
  _type: "textBlock";
  _key: string;
  title?: string | null;
  // PortableTextBlock[] | similar
  body?: unknown[];
  // Optional layout configuration coming from Sanity
  layout?: BlockLayout | null;
};

export type AccordionItem = {
  _type: "accordionItem";
  _key: string;
  title: string;
  // PortableTextBlock[]
  content?: unknown[];
};

export type AccordionBlock = {
  _type: "accordionBlock";
  _key: string;
  title?: string | null;
  items: AccordionItem[];
  layout?: BlockLayout | null;
};

export type HomePageBlock =
  | HeroBlock
  | TextBlock
  | AccordionBlock
  | Record<string, unknown>;

export type HomePage = {
  _id: string;
  _type: "homePage";
  name: string;
  builder?: Maybe<HomePageBlock[]>;
  seo?: Maybe<SeoSettings>;
};

export type MenuItem = {
  _key?: string;
  title: string;
  itemType: "link" | "parent";
  link?: Maybe<SanityLink>;
  childItems?: Maybe<MenuItem[]>;
};

export type Menu = {
  _id?: string;
  title?: string;
  items?: Maybe<MenuItem[]>;
};

export type SiteSettings = {
  siteTitle?: string;
  defaultLanguage?: string;
  logo?: Maybe<SanityImage>;
  social?: Maybe<SocialLink[]>;
  contact?: Maybe<ContactInfo>;
  menu?: Maybe<Menu>;
  footer?: Maybe<Footer>;
  seo?: Maybe<SeoSettings>;
};



