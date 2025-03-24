import { createClient, RedisClientType } from 'redis';
import { SensorPacket } from '../models/types';

/**
 * Interface for queue service implementations
 * 
 * This provides a common contract for different queue implementations,
 */
export interface QueueService {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  enqueue(item: SensorPacket): Promise<void>;
}

/**
 * Redis implementation of the queue service
 * 
 * Redis because of simplicity in this case
 */
export class RedisQueueService implements QueueService {
  private readonly client: RedisClientType;
  private readonly queueName: string;
  
  constructor(queueName: string = 'sensor_packets') {
    this.queueName = queueName;
    
    // Create Redis client with connection details from environment variables
    this.client = createClient({
      url: `redis://${process.env.REDIS_HOST ?? 'localhost'}:${process.env.REDIS_PORT ?? 6379}`
    });
    
    // Set up error handler
    this.client.on('error', (err) => console.error('Redis Client Error', err));
  }
  
  /**
   * Establishes connection to Redis server
   */
  async connect(): Promise<void> {
    await this.client.connect();
  }
  
  /**
   * Closes connection to Redis server
   */
  async disconnect(): Promise<void> {
    await this.client.disconnect();
  }
  
  /**
   * Adds a sensor packet to the Redis queue
   * 
   * Uses RPUSH to add items to the end of the list (queue),
   * ensuring FIFO (First In, First Out) behavior.
   */
  async enqueue(item: SensorPacket): Promise<void> {
    // Serialize the packet object to JSON string
    const serializedItem = JSON.stringify(item);
    
    // Push to the right side of the list (queue)
    await this.client.rPush(this.queueName, serializedItem);
  }
}

/**
 * In-memory implementation for testing and development
 * 
 * This implementation simulates a queue in memory, making it useful for
 * testing and local development without external dependencies.
 */
export class MockQueueService implements QueueService {
  private readonly queue: SensorPacket[] = [];
  
  async connect(): Promise<void> {
    // No actual connection needed
    return Promise.resolve();
  }
  
  async disconnect(): Promise<void> {
    // No actual disconnection needed
    return Promise.resolve();
  }
  
  async enqueue(item: SensorPacket): Promise<void> {
    this.queue.push(item);
    console.log('Enqueued item:', item);
    return Promise.resolve();
  }
  
  // Helper method for tests to inspect queue contents
  getQueue(): SensorPacket[] {
    return [...this.queue];
  }
}