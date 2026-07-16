import { useEffect } from 'react';

function setMeta(attribute, key, content) {
  let element = document.head.querySelector(`meta[${attribute}="${key}"]`);
  const created = !element;
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  const previousContent = element.getAttribute('content');
  element.setAttribute('content', content);
  return { element, created, previousContent };
}

export default function PageMeta({
  title,
  description,
  path = '/',
  image = '/hero/blemout-sun-defence.png',
  schema,
}) {
  useEffect(() => {
    const previousTitle = document.title;
    const origin = window.location.origin;
    const url = `${origin}${path}`;
    const imageUrl = image.startsWith('http') ? image : `${origin}${image}`;

    document.title = title;

    const tags = [
      setMeta('name', 'description', description),
      setMeta('property', 'og:title', title),
      setMeta('property', 'og:description', description),
      setMeta('property', 'og:type', 'website'),
      setMeta('property', 'og:url', url),
      setMeta('property', 'og:image', imageUrl),
      setMeta('property', 'og:site_name', 'BLEMOUT'),
      setMeta('name', 'twitter:card', 'summary_large_image'),
      setMeta('name', 'twitter:title', title),
      setMeta('name', 'twitter:description', description),
      setMeta('name', 'twitter:image', imageUrl),
    ];

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    const previousCanonical = canonical.getAttribute('href');
    canonical.setAttribute('href', url);

    const scriptId = 'blemout-page-schema';
    document.getElementById(scriptId)?.remove();
    if (schema) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    }

    return () => {
      document.title = previousTitle;
      if (previousCanonical) canonical.setAttribute('href', previousCanonical);
      else canonical.remove();
      tags.forEach(({ element, created, previousContent }) => {
        if (created) element.remove();
        else if (previousContent) element.setAttribute('content', previousContent);
        else element.removeAttribute('content');
      });
      document.getElementById(scriptId)?.remove();
    };
  }, [title, description, path, image, schema]);

  return null;
}
