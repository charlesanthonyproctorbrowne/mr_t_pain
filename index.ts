import { RedisQueueService } from './services/queueService';
import { processSensorPacket } from './utils/packetDecoder';

// ================================================================
// Instead of `console.log` we would probably use observability
// Honeycomb for example
// or write the logs somewhere
// ================================================================
async function main(): Promise<void> {
  // Example packets from the requirements
  const packets = [
    '490500002e7cf90905007d000c000f00',
    '4a0500002e7cf90905007d000e001100'
  ];
  
  // Create and connect to Redis queue
  const queueService = new RedisQueueService();
  
  try {
    await queueService.connect();
    console.log('Connected to Redis queue');
    
    // Process each packet
    for (const packet of packets) {
      console.log(`Processing packet: ${packet}`);
      await processSensorPacket(packet, queueService);
    }
    
    console.log('All packets processed successfully');
  } catch (error) {
    console.error('Error in packet processing:', error);
    process.exit(1);
  } finally {
    // Ensure we always disconnect from Redis
    await queueService.disconnect();
    console.log('Disconnected from Redis queue');
  }
}

// Only run the main function if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}

// Export for testing or importing
export { main };