import { Worker, Job } from "bullmq";
import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL || "redis://localhost:9911";
const connection = new Redis(redisUrl, { maxRetriesPerRequest: null });

export const SYNC_QUEUE_NAME = "socialhub-sync-queue";

export function createSyncWorker() {
  const worker = new Worker(
    SYNC_QUEUE_NAME,
    async (job: Job) => {
      console.log(`[SyncWorker] Processing job ${job.id} of type ${job.name}`);
      return { success: true, processedAt: new Date().toISOString() };
    },
    {
      connection,
      concurrency: 5,
    },
  );

  worker.on("completed", (job) => {
    console.log(`[SyncWorker] Job ${job.id} completed`);
  });

  worker.on("failed", (job, err) => {
    console.error(`[SyncWorker] Job ${job?.id} failed with error:`, err);
  });

  return worker;
}

if (process.env.NODE_ENV !== "test") {
  console.log(
    `[SyncWorker] Initializing sync worker connecting to ${redisUrl}...`,
  );
  createSyncWorker();
}
