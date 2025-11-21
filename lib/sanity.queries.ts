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
      _id,
      title,
      items[]{
        _key,
        title,
        itemType,
        link{
          label,
          linkType,
          href,
          openInNewTab,
          "internalPath": select(
            defined(internalPage->slug.current) => "/" + coalesce(internalPage->language, "en") + "/" + internalPage->slug.current,
            defined(internalPage->slug) => "/" + coalesce(internalPage->language, "en") + "/" + internalPage->slug,
            defined(internalPath) => internalPath
          ),
          "reference": coalesce(
            internalPage->{
              _type,
              title,
              "slug": select(
                defined(slug.current) => slug.current,
                defined(slug) => slug,
                defined(current) => current
              )
            },
            reference->{
              _type,
              title,
              "slug": select(
                defined(slug.current) => slug.current,
                defined(slug) => slug,
                defined(current) => current
              )
            }
          )
        },
        childItems[]{
          _key,
          title,
          itemType,
          link{
            label,
            linkType,
            href,
            openInNewTab,
            "internalPath": select(
            defined(internalPage->slug.current) => "/" + coalesce(internalPage->language, "en") + "/" + internalPage->slug.current,
            defined(internalPage->slug) => "/" + coalesce(internalPage->language, "en") + "/" + internalPage->slug,
              defined(internalPath) => internalPath
            ),
            "reference": coalesce(
              internalPage->{
                _type,
                title,
                "slug": select(
                  defined(slug.current) => slug.current,
                  defined(slug) => slug,
                  defined(current) => current
                )
              },
              reference->{
                _type,
                title,
                "slug": select(
                  defined(slug.current) => slug.current,
                  defined(slug) => slug,
                  defined(current) => current
                )
              }
            )
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
            href,
            openInNewTab,
            "internalPath": select(
              defined(internalPage->slug.current) => "/" + coalesce(internalPage->language, "en") + "/" + internalPage->slug.current,
              defined(internalPage->slug) => "/" + coalesce(internalPage->language, "en") + "/" + internalPage->slug,
              defined(internalPath) => internalPath
            ),
            "reference": coalesce(
              internalPage->{
                _type,
                title,
                "slug": select(
                  defined(slug.current) => slug.current,
                  defined(slug) => slug,
                  defined(current) => current
                )
              },
              reference->{
                _type,
                title,
                "slug": select(
                  defined(slug.current) => slug.current,
                  defined(slug) => slug,
                  defined(current) => current
                )
              }
            )
          }
        }
      },
      legal[]{
        label,
        linkType,
        href,
        openInNewTab,
        "internalPath": select(
          defined(internalPage->slug.current) => "/" + coalesce(internalPage->language, "en") + "/" + internalPage->slug.current,
          defined(internalPage->slug) => "/" + coalesce(internalPage->language, "en") + "/" + internalPage->slug,
          defined(internalPath) => internalPath
        ),
        "reference": coalesce(
          internalPage->{
            _type,
            title,
            "slug": select(
              defined(slug.current) => slug.current,
              defined(slug) => slug,
              defined(current) => current
            )
          },
          reference->{
            _type,
            title,
            "slug": select(
              defined(slug.current) => slug.current,
              defined(slug) => slug,
              defined(current) => current
            )
          }
        )
      },
    }
  }
`;

export const homePageQuery = groq`
  *[_type == "homePage"][0]{
    _id,
    _type,
    name,
    builder[]{
      _type,
      _key,
      ...select(
        // Hero Block
        _type == "heroBlock" => {
          title,
          summary,
          media{
            asset->{
              _id,
              url,
              metadata{
                dimensions{
                  width,
                  height,
                  aspectRatio
                }
              }
            },
            alt,
            caption
          },
          actions[]{
            label,
            href,
            openInNewTab
          },
          layout,
          mediaLayout
        },
        // Text Block
        _type == "textBlock" => {
          title,
          body[],
          layout,
        },
        // Accordion Block
        _type == "accordionBlock" => {
          title,
          items[]{
            _type,
            _key,
            title,
            content[]
          },
          layout,
        }
      )
    },
    seo{
      title,
      description,
      image{
        asset->{
          _id,
          url
        },
        alt
      },
      noIndex
    }
  }
  `;

export const pageBySlugQuery = groq`
  *[_type == "page" && slug.current == $slug && language == $language][0]{
    _id,
    _type,
    title,
    "slug": slug.current,
    intro,
    language,
    translationOf,
    builder[]{
      _type,
      _key,
      ...select(
        _type == "textBlock" => {
          title,
          body[],
          layout,
        },
        _type == "accordionBlock" => {
          title,
          items[]{
            _type,
            _key,
            title,
            content[]
          },
          layout,
        }
      )
    },
    seo{
      title,
      description,
      image{
        asset->{
          _id,
          url
        },
        alt
      },
      noIndex
    }
  }
`;
