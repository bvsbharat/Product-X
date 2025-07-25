import mongoose, { Document, Schema } from 'mongoose';

// Interface for cache document
export interface ICacheDocument extends Document {
  key: string;
  data: any;
  type: 'agent_response' | 'agent_test' | 'agent_tools' | 'agent_summary' | 'emails' | 'events' | 'summary';
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
  metadata?: {
    query?: string;
    duration?: number;
    source?: string;
    [key: string]: any;
  };
}

// Cache schema
const cacheSchema = new Schema<ICacheDocument>({
  key: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  data: {
    type: Schema.Types.Mixed,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['agent_response', 'agent_test', 'agent_tools', 'agent_summary', 'emails', 'events', 'summary'],
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 } // MongoDB TTL index
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true,
  collection: 'cache_entries'
});

// Indexes for better performance
cacheSchema.index({ type: 1, createdAt: -1 });
cacheSchema.index({ expiresAt: 1 }); // TTL index
cacheSchema.index({ key: 1, type: 1 });

// Pre-save middleware to update the updatedAt field
cacheSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Static methods for cache operations
cacheSchema.statics.findByKey = function(key: string) {
  return this.findOne({ key, expiresAt: { $gt: new Date() } });
};

cacheSchema.statics.findByType = function(type: string, limit = 10) {
  return this.find({ type, expiresAt: { $gt: new Date() } })
    .sort({ createdAt: -1 })
    .limit(limit);
};

cacheSchema.statics.cleanupExpired = function() {
  return this.deleteMany({ expiresAt: { $lt: new Date() } });
};

// Create and export the model
export const CacheModel = mongoose.model<ICacheDocument>('Cache', cacheSchema);

// Cache utility functions
export class CacheService {
  private static readonly DEFAULT_TTL = parseInt(process.env.CACHE_TTL_SECONDS || '300'); // 5 minutes

  /**
   * Generate a cache key from multiple parameters
   */
  static generateKey(type: string, ...params: (string | number)[]): string {
    const keyParts = [type, ...params.map(p => String(p))].filter(Boolean);
    return keyParts.join(':').toLowerCase().replace(/[^a-z0-9:_-]/g, '_');
  }

  /**
   * Set cache entry
   */
  static async set(
    key: string,
    data: any,
    type: ICacheDocument['type'],
    ttlSeconds?: number,
    metadata?: ICacheDocument['metadata']
  ): Promise<ICacheDocument | null> {
    try {
      const ttl = ttlSeconds || this.DEFAULT_TTL;
      const expiresAt = new Date(Date.now() + ttl * 1000);

      const cacheEntry = await CacheModel.findOneAndUpdate(
        { key },
        {
          data,
          type,
          expiresAt,
          metadata: metadata || {},
          updatedAt: new Date()
        },
        {
          upsert: true,
          new: true,
          runValidators: true
        }
      );

      console.log(`💾 Cache SET: ${key} (expires in ${ttl}s)`);
      return cacheEntry;
    } catch (error) {
      console.error('❌ Cache SET error:', error);
      return null;
    }
  }

  /**
   * Get cache entry
   */
  static async get(key: string): Promise<any | null> {
    try {
      const cacheEntry = await CacheModel.findByKey(key);
      
      if (cacheEntry) {
        console.log(`🎯 Cache HIT: ${key}`);
        return cacheEntry.data;
      }
      
      console.log(`❌ Cache MISS: ${key}`);
      return null;
    } catch (error) {
      console.error('❌ Cache GET error:', error);
      return null;
    }
  }

  /**
   * Check if cache entry exists and is valid
   */
  static async exists(key: string): Promise<boolean> {
    try {
      const count = await CacheModel.countDocuments({
        key,
        expiresAt: { $gt: new Date() }
      });
      return count > 0;
    } catch (error) {
      console.error('❌ Cache EXISTS error:', error);
      return false;
    }
  }

  /**
   * Delete cache entry
   */
  static async delete(key: string): Promise<boolean> {
    try {
      const result = await CacheModel.deleteOne({ key });
      console.log(`🗑️ Cache DELETE: ${key}`);
      return result.deletedCount > 0;
    } catch (error) {
      console.error('❌ Cache DELETE error:', error);
      return false;
    }
  }

  /**
   * Clear all cache entries of a specific type
   */
  static async clearByType(type: ICacheDocument['type']): Promise<number> {
    try {
      const result = await CacheModel.deleteMany({ type });
      console.log(`🧹 Cache CLEAR by type: ${type} (${result.deletedCount} entries)`);
      return result.deletedCount;
    } catch (error) {
      console.error('❌ Cache CLEAR error:', error);
      return 0;
    }
  }

  /**
   * Get cache statistics
   */
  static async getStats(): Promise<{
    total: number;
    byType: Record<string, number>;
    expired: number;
  }> {
    try {
      const [total, byType, expired] = await Promise.all([
        CacheModel.countDocuments({}),
        CacheModel.aggregate([
          { $group: { _id: '$type', count: { $sum: 1 } } }
        ]),
        CacheModel.countDocuments({ expiresAt: { $lt: new Date() } })
      ]);

      const typeStats: Record<string, number> = {};
      byType.forEach((item: any) => {
        typeStats[item._id] = item.count;
      });

      return { total, byType: typeStats, expired };
    } catch (error) {
      console.error('❌ Cache STATS error:', error);
      return { total: 0, byType: {}, expired: 0 };
    }
  }

  /**
   * Cleanup expired entries
   */
  static async cleanup(): Promise<number> {
    try {
      const result = await CacheModel.cleanupExpired();
      if (result.deletedCount > 0) {
        console.log(`🧹 Cache cleanup: removed ${result.deletedCount} expired entries`);
      }
      return result.deletedCount;
    } catch (error) {
      console.error('❌ Cache cleanup error:', error);
      return 0;
    }
  }
}