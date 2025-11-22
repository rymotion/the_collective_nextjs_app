// Custom cache handler for Next.js 16 on Vercel
// This implements the CacheHandler interface required by Next.js

export default class CustomCacheHandler {
  constructor(options) {
    this.options = options;
    this.cache = new Map();
    this.revalidatedTags = new Set();
  }

  async get(key) {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // Check if entry has expired
    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    // Check if any tags have been revalidated
    if (entry.tags?.some(tag => this.revalidatedTags.has(tag))) {
      this.cache.delete(key);
      return null;
    }

    return entry.value;
  }

  async set(key, data, ctx) {
    const { revalidate, tags } = ctx;
    
    // Don't cache 404 responses for too long
    const is404 = data?.value?.kind === 'PAGE' && data?.value?.html === null;
    const ttl = is404 ? 60 * 1000 : (revalidate ? revalidate * 1000 : null);

    const entry = {
      value: data,
      tags: tags || [],
      expiresAt: ttl ? Date.now() + ttl : null,
      lastModified: Date.now(),
    };

    this.cache.set(key, entry);
  }

  async revalidateTag(tag) {
    this.revalidatedTags.add(tag);
    
    // Clean up revalidated tags after 1 minute
    setTimeout(() => {
      this.revalidatedTags.delete(tag);
    }, 60 * 1000);

    // Remove all entries with this tag
    for (const [key, entry] of this.cache.entries()) {
      if (entry.tags?.includes(tag)) {
        this.cache.delete(key);
      }
    }
  }

  async delete(key) {
    this.cache.delete(key);
  }
}
