import { groq } from "next-sanity";

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0]{
    siteTitle,
    defaultLanguage,
    logo{
      alt,
      caption,
      asset->{
        _id,
        url,
        metadata{
          dimensions{
            width,
            height
          }
        }
      }
    },
    social[]{
      service,
      url
    },
    contact{
      phone,
      email,
      address{
        street,
        postalCode,
        city,
        country
      }
    },
    "menu": menu->{
      title,
      items[]{
        title,
        itemType,
        link{
          label,
          linkType,
          internalPath,
          href,
          openInNewTab,
          reference->{
            _type,
            title,
            "slug": select(
              defined(slug.current) => slug.current,
              defined(slug) => slug,
              defined(current) => current
            )
          }
        },
        childItems[]{
          title,
          itemType,
          link{
            label,
            linkType,
            internalPath,
            href,
            openInNewTab,
            reference->{
              _type,
              title,
              "slug": select(
                defined(slug.current) => slug.current,
                defined(slug) => slug,
                defined(current) => current
              )
            }
          }
        }
      }
    },
    "footer": footer->{
      title,
      columns[]{
        title,
        body,
        links[]{
          icon,
          link{
            label,
            linkType,
            internalPath,
            href,
            openInNewTab,
            reference->{
              _type,
              title,
              "slug": select(
                defined(slug.current) => slug.current,
                defined(slug) => slug,
                defined(current) => current
              )
            }
          }
        }
      },
      legal[]{
        label,
        linkType,
        internalPath,
        href,
        openInNewTab,
        reference->{
          _type,
          title,
          "slug": select(
            defined(slug.current) => slug.current,
            defined(slug) => slug,
            defined(current) => current
          )
        }
      },
    }
  }
`;
