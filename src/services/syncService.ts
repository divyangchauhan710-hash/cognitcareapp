import { getPendingSyncRecordsDB, markRecordsSyncedDB } from './db';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

export interface SyncResult {
  success: boolean;
  syncedCount: number;
  message: string;
}

export class SyncManager {
  /**
   * Synchronizes all locally stored pending records with the FastAPI backend
   */
  public static async syncPendingData(): Promise<SyncResult> {
    try {
      const pending = await getPendingSyncRecordsDB();
      const totalPending =
        pending.sessions.length + pending.memories.length + pending.reminders.length;

      if (totalPending === 0) {
        return {
          success: true,
          syncedCount: 0,
          message: 'All local data is already up to date.',
        };
      }

      console.log(`[SyncManager] Uploading ${totalPending} pending records to ${API_BASE_URL}/sync...`);

      const response = await fetch(`${API_BASE_URL}/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessions: pending.sessions,
          memories: pending.memories,
          reminders: pending.reminders,
        }),
      });

      if (!response.ok) {
        throw new Error(`Sync API responded with status ${response.status}`);
      }

      const data = await response.json();
      const syncedIds: string[] = data.syncedIds || [];

      // Mark records as synced in local SQLite
      await markRecordsSyncedDB(syncedIds);

      console.log(`[SyncManager] Successfully synchronized ${syncedIds.length} records.`);

      return {
        success: true,
        syncedCount: syncedIds.length,
        message: `Successfully synchronized ${syncedIds.length} items.`,
      };
    } catch (err: any) {
      console.warn('[SyncManager] Network/Backend offline. Retaining local pending records:', err.message);
      return {
        success: false,
        syncedCount: 0,
        message: 'Network offline. Saved locally. Will retry when connection returns.',
      };
    }
  }
}
