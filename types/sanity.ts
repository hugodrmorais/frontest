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

export type SiteSettings = {
  siteTitle?: string;
  defaultLanguage?: string;
  logo?: Maybe<SanityImage>;
  social?: Maybe<SocialLink[]>;
  contact?: Maybe<ContactInfo>;
  footer?: Maybe<Footer>;
  seo?: Maybe<SeoSettings>;
};



