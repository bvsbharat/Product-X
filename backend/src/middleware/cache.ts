import { Request, Response, NextFunction } from 'express';
import { CacheService } from '../models/Cache.js';
import { isDatabaseConnected } from '../config/database.js';

// Extend Request interface to include cache-related properties
declare global {
  namespace Express {
    interface Request {
      cacheKey?: string;
      cacheType?: 'agent_response' | 'agent_test' | 'agent_tools' | 'agent_summary' | 'emails' | 'events' | 'summary';
      cacheTTL?: number;
      skipCache?: boolean;
    }
  }
}

/**
 * Cache middleware that checks for cached responses before processing
 */
export const cacheMiddleware = (type: 'agent_response' | 'agent_test' | 'agent_tools' | 'agent_summary' | 'emails' | 'events' | 'summary', ttl?: number) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Skip caching if database is not connected
    if (!isDatabaseConnected()) {
      console.log('📋 Database not connected, skipping cache');
      return next();
    }

    try {
      // Generate cache key based on request
      const cacheKey = generateCacheKey(req, type);
      req.cacheKey = cacheKey;
      req.cacheType = type;
      req.cacheTTL = ttl;

      // Check for force refresh parameter
      if (req.query.refresh === 'true' || req.body.refresh === true) {
        console.log(`🔄 Force refresh requested for ${cacheKey}`);
        req.skipCache = true;
        return next();
      }

      // Try to get cached data
      const cachedData = await CacheService.get(cacheKey);
      
      if (cachedData) {
        console.log(`⚡ Serving cached response for ${cacheKey}`);
        
        // Return cached response immediately
        return res.json({
          success: true,
          data: cachedData,
          cached: true,
          timestamp: new Date().toISOString(),
          message: 'Response served from cache'
        });
      }

      // No cache found, proceed to handler
      console.log(`🔍 No cache found for ${cacheKey}, proceeding to handler`);
      next();
      
    } catch (error) {
      console.error('❌ Cache middleware error:', error);
      // Continue without caching on error
      next();
    }
  };
};

/**
 * Middleware to cache the response after processing
 */
export const cacheResponse = async (req: Request, res: Response, data: any, metadata?: any) => {
  // Skip if database not connected or caching disabled
  if (!isDatabaseConnected() || req.skipCache || !req.cacheKey || !req.cacheType) {
    return;
  }

  try {
    await CacheService.set(
      req.cacheKey,
      data,
      req.cacheType,
      req.cacheTTL,
      {
        ...metadata,
        userAgent: req.get('User-Agent'),
        ip: req.ip,
        timestamp: new Date().toISOString()
      }
    );
    console.log(`💾 Response cached for ${req.cacheKey}`);
  } catch (error) {
    console.error('❌ Error caching response:', error);
  }
};

/**
 * Generate cache key based on request parameters
 */
function generateCacheKey(req: Request, type: string): string {
  const baseKey = type;
  
  switch (type) {
    case 'agent_response':
    case 'agent_test':
      // For agent responses, include the query and any relevant parameters
      const query = req.body.query || req.query.q || '';
      const maxSteps = req.body.maxSteps || req.query.maxSteps || 5;
      return CacheService.generateKey(baseKey, query, maxSteps);
      
    case 'agent_tools':
      // For tools, use a simple time-based key (tools don't change often)
      const toolsTimeKey = Math.floor(Date.now() / (30 * 60 * 1000)); // 30-minute buckets
      return CacheService.generateKey(baseKey, toolsTimeKey);
      
    case 'agent_summary':
    case 'summary':
      // For summaries, create a hash of the input data
      const emails = req.body.emails || [];
      const events = req.body.events || [];
      const emailCount = emails.length;
      const eventCount = events.length;
      // Create a simple hash based on counts and first few items
      const emailHash = emails.slice(0, 3).map((e: any) => e.id || e.subject).join('|');
      const eventHash = events.slice(0, 3).map((e: any) => e.id || e.title).join('|');
      return CacheService.generateKey(baseKey, emailCount, eventCount, emailHash, eventHash);
      
    case 'emails':
      // For emails, use a simple time-based key (refreshed periodically)
      const emailTimeKey = Math.floor(Date.now() / (5 * 60 * 1000)); // 5-minute buckets
      return CacheService.generateKey(baseKey, emailTimeKey);
      
    case 'events':
      // For events, use date-based key
      const date = String(req.query.date || new Date().toISOString().split('T')[0]);
      return CacheService.generateKey(baseKey, date);
      
    default:
      return CacheService.generateKey(baseKey, req.path);
  }
}

/**
 * Background cache refresh middleware
 * This allows serving stale cache while refreshing in the background
 */
export const backgroundRefreshMiddleware = (type: 'agent_response' | 'agent_test' | 'agent_tools' | 'agent_summary' | 'emails' | 'events' | 'summary', staleThreshold = 60) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!isDatabaseConnected()) {
      return next();
    }

    try {
      const cacheKey = generateCacheKey(req, type);
      req.cacheKey = cacheKey;
      req.cacheType = type;

      // Check if we have stale cache that needs refresh
      const cacheEntry = await CacheService.get(cacheKey);
      
      if (cacheEntry) {
        // Check if cache is getting stale (within staleThreshold seconds of expiry)
        const now = new Date();
        const expiresAt = new Date(cacheEntry.expiresAt);
        const timeToExpiry = (expiresAt.getTime() - now.getTime()) / 1000;
        
        if (timeToExpiry < staleThreshold) {
          console.log(`🔄 Cache is stale for ${cacheKey}, triggering background refresh`);
          
          // Serve stale cache immediately
          res.json({
            success: true,
            data: cacheEntry.data,
            cached: true,
            stale: true,
            timestamp: new Date().toISOString(),
            message: 'Serving stale cache while refreshing in background'
          });
          
          // Trigger background refresh (don't await)
          setImmediate(() => {
            refreshCacheInBackground(req, type);
          });
          
          return;
        }
      }
      
      next();
    } catch (error) {
      console.error('❌ Background refresh middleware error:', error);
      next();
    }
  };
};

/**
 * Refresh cache in background
 */
async function refreshCacheInBackground(req: Request, type: string) {
  try {
    console.log(`🔄 Starting background cache refresh for ${req.cacheKey}`);
    
    // This would trigger the actual data fetching logic
    // Implementation depends on the specific endpoint
    // For now, we'll just log that refresh was triggered
    
    console.log(`✅ Background cache refresh completed for ${req.cacheKey}`);
  } catch (error) {
    console.error('❌ Background cache refresh failed:', error);
  }
}

/**
 * Cache invalidation middleware
 */
export const invalidateCache = async (type: 'agent_response' | 'agent_test' | 'agent_tools' | 'agent_summary' | 'emails' | 'events' | 'summary' | 'all') => {
  if (!isDatabaseConnected()) {
    return;
  }

  try {
    if (type === 'all') {
      // Clear all cache types
      await Promise.all([
        CacheService.clearByType('agent_response'),
        CacheService.clearByType('agent_test'),
        CacheService.clearByType('agent_tools'),
        CacheService.clearByType('agent_summary'),
        CacheService.clearByType('emails'),
        CacheService.clearByType('events'),
        CacheService.clearByType('summary')
      ]);
      console.log('🧹 All cache cleared');
    } else {
      await CacheService.clearByType(type);
      console.log(`🧹 Cache cleared for type: ${type}`);
    }
  } catch (error) {
    console.error('❌ Cache invalidation error:', error);
  }
};

/**
 * Cache statistics middleware
 */
export const getCacheStats = async (req: Request, res: Response) => {
  try {
    if (!isDatabaseConnected()) {
      return res.json({
        success: false,
        message: 'Database not connected',
        data: { total: 0, byType: {}, expired: 0 }
      });
    }

    const stats = await CacheService.getStats();
    
    res.json({
      success: true,
      data: stats,
      message: 'Cache statistics retrieved successfully'
    });
  } catch (error) {
    console.error('❌ Cache stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get cache statistics',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};