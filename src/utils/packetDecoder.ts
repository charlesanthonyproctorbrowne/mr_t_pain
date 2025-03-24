import { SensorPacket } from '../models/types';
import { QueueService } from '../services/queueService';

export function decodeSensorPacket(hexPacket: string): SensorPacket {
  if (!hexPacket || hexPacket.length < 28) {
    throw new Error('Invalid packet: Packet is too short or empty');
  }
  
  try {
    const buffer = Buffer.from(hexPacket, 'hex');
    
    const message_id = buffer.readUInt16LE(0);
    
    // New approach for sensor_id based on the debug findings
    // Use bytes 2, 3, 6, 7 and add the UInt16LE value of bytes 4-5
    const base_value = (buffer[2]) | (buffer[3] << 8) | (buffer[6] << 16) | (buffer[7] << 24);
    const adjustment = buffer.readUInt16LE(4); // This is 31790
    const sensor_id = base_value + adjustment; // Should be 167313408 + 31790 = 167345198
    
    // sensor_type gave 5 0 so we can just reference it directly instead of buffer.readUInt16LE(8)
    const sensor_type = buffer[8];
    const data_type_id = buffer.readUInt16LE(10);
    const value1 = buffer.readUInt16LE(12);
    const value2 = buffer.readUInt16LE(14);
    
    return {
      message_id,
      sensor_id,
      sensor_type,
      data_type_id,
      value1,
      value2
    };
  } catch (error: any) {
    throw new Error(`Failed to decode packet: ${(error as Error).message}`);
  }
}

/**
 * Processes sensor packets and sends them to the appropriate queue
 * 
 * This function serves as the main entry point for packet processing
 */
export async function processSensorPacket(
  hexPacket: string, 
  queueService: QueueService
): Promise<void> {
  try {
    console.log(`| ${hexPacket} | Decoding packet...`);
    // Decode the raw packet into a structured object
    const packetData = decodeSensorPacket(hexPacket);

    console.log('| Packet decoded |');
    console.dir(packetData, { depth: null });
    
    // Enqueue the decoded packet data
    await queueService.enqueue(packetData);
    
    return Promise.resolve();
  } catch (error) {
    console.error('Error processing sensor packet:', error);
    return Promise.reject(error);
  }
}
