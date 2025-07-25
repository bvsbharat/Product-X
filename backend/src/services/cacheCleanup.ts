import cron from 'node-cron';
import { CacheService } from '../models/Cache.js';
import { isDatabaseConnected } from '../config/database.js';

/**
 * Cache cleanup service that runs periodically to remove expired entries
 */
export class CacheCleanupService {
  private static cleanupJob: cron.ScheduledTask | null = null;
  private static isRunning = false;

  /**
   * Start the cache cleanup service
   */
  static start(): void {
    if (this.isRunning) {
      console.log('⚠️ Cache cleanup service is already running');
      return;
    }

    // Get cleanup interval from environment (default: every hour)
    const intervalMinutes = parseInt(process.env.CACHE_CLEANUP_INTERVAL_MINUTES || '60');
    const cronExpression = `0 */${intervalMinutes} * * *`; // Every N minutes

    console.log(`🧹 Starting cache cleanup service (every ${intervalMinutes} minutes)`);

    this.cleanupJob = cron.schedule(cronExpression, async () => {
      await this.performCleanup();
    }, {
      scheduled: true,
      timezone: 'UTC'
    });

    this.isRunning = true;
    console.log('✅ Cache cleanup service started successfully');

    // Run initial cleanup
    setImmediate(() => {
      this.performCleanup();
    });
  }

  /**
   * Stop the cache cleanup service
   */
  static stop(): void {
    if (this.cleanupJob) {
      this.cleanupJob.stop();
      this.cleanupJob = null;
    }
    this.isRunning = false;
    console.log('🛑 Cache cleanup service stopped');
  }

  /**
   * Perform cache cleanup
   */
  static async performCleanup(): Promise<void> {
    if (!isDatabaseConnected()) {
      console.log('📋 Database not connected, skipping cache cleanup');
      return;
    }

    try {
      console.log('🧹 Starting cache cleanup...');
      const startTime = Date.now();

      // Get stats before cleanup
      const statsBefore = await CacheService.getStats();
      
      // Perform cleanup
      const deletedCount = await CacheService.cleanup();
      
      // Get stats after cleanup
      const statsAfter = await CacheService.getStats();
      
      const duration = Date.now() - startTime;
      
      console.log(`✅ Cache cleanup completed in ${duration}ms`);
      console.log(`📊 Cleanup stats:`);
      console.log(`   - Entries before: ${statsBefore.total}`);
      console.log(`   - Entries after: ${statsAfter.total}`);
      console.log(`   - Deleted: ${deletedCount}`);
      console.log(`   - Expired remaining: ${statsAfter.expired}`);
      
      // Log cache distribution by type
      if (Object.keys(statsAfter.byType).length > 0) {
        console.log(`   - By type:`, statsAfter.byType);
      }
      
    } catch (error) {
      console.error('❌ Cache cleanup failed:', error);
    }
  }

  /**
   * Force cleanup now
   */
  static async forceCleanup(): Promise<{
    success: boolean;
    deletedCount: number;
    duration: number;
    error?: string;
  }> {
    const startTime = Date.now();
    
    try {
      await this.performCleanup();
      const duration = Date.now() - startTime;
      
      // Get the actual deleted count from cleanup
      const deletedCount = await CacheService.cleanup();
      
      return {
        success: true,
        deletedCount,
        duration
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      
      return {
        success: false,
        deletedCount: 0,
        duration,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get service status
   */
  static getStatus(): {
    isRunning: boolean;
    nextRun?: string;
    intervalMinutes: number;
  } {
    const intervalMinutes = parseInt(process.env.CACHE_CLEANUP_INTERVAL_MINUTES || '60');
    
    let nextRun: string | undefined;
    if (this.cleanupJob && this.isRunning) {
      // Calculate next run time (approximate)
      const now = new Date();
      const nextRunTime = new Date(now.getTime() + intervalMinutes * 60 * 1000);
      nextRun = nextRunTime.toISOString();
    }

    return {
      isRunning: this.isRunning,
      nextRun,
      intervalMinutes
    };
  }

  /**
   * Cleanup specific cache type
   */
  static async cleanupByType(type: 'agent_response' | 'emails' | 'events' | 'summary'): Promise<number> {
    if (!isDatabaseConnected()) {
      console.log('📋 Database not connected, skipping cache cleanup');
      return 0;
    }

    try {
      console.log(`🧹 Cleaning up cache for type: ${type}`);
      const deletedCount = await CacheService.clearByType(type);
      console.log(`✅ Cleaned up ${deletedCount} entries for type: ${type}`);
      return deletedCount;
    } catch (error) {
      console.error(`❌ Failed to cleanup cache for type ${type}:`, error);
      return 0;
    }
  }

  /**
   * Get detailed cache statistics
   */
  static async getDetailedStats(): Promise<{
    total: number;
    byType: Record<string, number>;
    expired: number;
    fresh: number;
    oldestEntry?: Date;
    newestEntry?: Date;
    averageSize?: number;
  }> {
    if (!isDatabaseConnected()) {
      return {
        total: 0,
        byType: {},
        expired: 0,
        fresh: 0
      };
    }

    try {
      const basicStats = await CacheService.getStats();
      const fresh = basicStats.total - basicStats.expired;
      
      // Additional stats could be added here if needed
      return {
        ...basicStats,
        fresh
      };
    } catch (error) {
      console.error('❌ Failed to get detailed cache stats:', error);
      return {
        total: 0,
        byType: {},
        expired: 0,
        fresh: 0
      };
    }
  }
}

// Graceful shutdown handler
process.on('SIGINT', () => {
  console.log('\n🛑 Received SIGINT, stopping cache cleanup service...');
  CacheCleanupService.stop();
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Received SIGTERM, stopping cache cleanup service...');
  CacheCleanupService.stop();
});