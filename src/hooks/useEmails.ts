import { useCallback, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { getEmails } from '@/services/api';
import type { Email } from '@/services/api';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
const CACHE_KEY = 'weekend-dashboard-emails-cache';

interface EmailCache {
  emails: Email[];
  timestamp: string;
  source: string | null;
  lastRefresh: string;
}

export const useEmails = () => {
  const {
    emails,
    emailsLoading,
    emailsError,
    emailsCacheTimestamp,
    emailSource,
    lastEmailRefresh,
    setEmails,
    setEmailsLoading,
    setEmailsError,
    setEmailSource,
    updateEmailsCacheTimestamp,
    updateLastEmailRefresh,
    clearEmailsCache,
  } = useStore();

  // Load cached data from localStorage on mount
  useEffect(() => {
    const loadCachedData = () => {
      try {
        const cachedData = localStorage.getItem(CACHE_KEY);
        if (cachedData) {
          const cache: EmailCache = JSON.parse(cachedData);
          const cacheTimestamp = new Date(cache.timestamp);
          const now = new Date();
          
          // Check if cache is still valid
          if ((now.getTime() - cacheTimestamp.getTime()) < CACHE_DURATION) {
            console.log('📧 Loading emails from localStorage cache');
            setEmails(cache.emails);
            setEmailSource(cache.source);
            updateEmailsCacheTimestamp();
            if (cache.lastRefresh) {
              updateLastEmailRefresh();
            }
          } else {
            console.log('📧 localStorage cache expired, clearing');
            localStorage.removeItem(CACHE_KEY);
          }
        }
      } catch (error) {
        console.error('❌ Failed to load cached emails:', error);
        localStorage.removeItem(CACHE_KEY);
      }
    };

    // Only load from cache if we don't have emails in store
    if (emails.length === 0) {
      loadCachedData();
    }
  }, []); // Empty dependency array - only run on mount

  // Save to localStorage when emails change
  useEffect(() => {
    if (emails.length > 0 && emailsCacheTimestamp) {
      try {
        const cache: EmailCache = {
          emails,
          timestamp: emailsCacheTimestamp.toISOString(),
          source: emailSource,
          lastRefresh: lastEmailRefresh?.toISOString() || new Date().toISOString(),
        };
        localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
        console.log('💾 Saved emails to localStorage cache');
      } catch (error) {
        console.error('❌ Failed to save emails to cache:', error);
      }
    }
  }, [emails, emailsCacheTimestamp, emailSource, lastEmailRefresh]);

  const isCacheValid = useCallback(() => {
    if (!emailsCacheTimestamp) return false;
    const now = new Date();
    return (now.getTime() - emailsCacheTimestamp.getTime()) < CACHE_DURATION;
  }, [emailsCacheTimestamp]);

  const fetchEmailsFromAPI = useCallback(async (forceRefresh = false) => {
    // If we have valid cached data and it's not a forced refresh, return cached data
    if (!forceRefresh && emails.length > 0 && isCacheValid()) {
      console.log('📧 Using cached email data');
      return emails;
    }

    setEmailsLoading(true);
    setEmailsError(null);
    
    try {
      console.log('🔄 Fetching emails from API...');
      const emailsData = await getEmails();
      
      if (Array.isArray(emailsData)) {
        setEmails(emailsData);
        setEmailSource('API');
        updateEmailsCacheTimestamp();
        updateLastEmailRefresh();
        console.log(`📧 Loaded ${emailsData.length} emails from API source (${forceRefresh ? 'forced refresh' : 'cache expired'})`);
        return emailsData;
      } else {
        throw new Error('Invalid email data format');
      }
    } catch (error) {
      console.error('❌ Failed to fetch emails:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch emails';
      setEmailsError(errorMessage);
      
      // If this was a forced refresh and we have cached data, keep it
      if (forceRefresh && emails.length > 0) {
        console.log('📧 Keeping cached data after failed refresh');
        return emails;
      } else {
        setEmails([]);
        setEmailSource(null);
        return [];
      }
    } finally {
      setEmailsLoading(false);
    }
  }, [emails, isCacheValid, setEmails, setEmailsLoading, setEmailsError, setEmailSource, updateEmailsCacheTimestamp, updateLastEmailRefresh]);

  const refreshEmails = useCallback(async () => {
    console.log('🔄 User requested email refresh');
    return await fetchEmailsFromAPI(true);
  }, [fetchEmailsFromAPI]);

  const loadEmailsWithCache = useCallback(async () => {
    // For initial load, check if we have valid cached data (either in store or localStorage)
    if (emails.length > 0 && isCacheValid()) {
      console.log('📧 Using existing cached email data on load');
      return emails;
    }
    
    // Don't automatically fetch from API on browser refresh
    // Only fetch if explicitly requested or no cache exists
    console.log('📧 No valid cache found, but not auto-fetching on page load');
    return emails;
  }, [emails, isCacheValid]);

  const getCacheStatus = useCallback(() => {
    if (!emailsCacheTimestamp) return 'No cache';
    if (isCacheValid()) return 'Cache valid';
    return 'Cache expired';
  }, [emailsCacheTimestamp, isCacheValid]);

  const clearEmailsCacheWithStorage = useCallback(() => {
    clearEmailsCache();
    localStorage.removeItem(CACHE_KEY);
    console.log('🗑️ Cleared emails cache and localStorage');
  }, [clearEmailsCache]);

  return {
    emails,
    emailsLoading,
    emailsError,
    emailSource,
    lastEmailRefresh,
    refreshEmails,
    loadEmailsWithCache,
    clearEmailsCache: clearEmailsCacheWithStorage,
    getCacheStatus,
    isCacheValid: isCacheValid(),
  };
};