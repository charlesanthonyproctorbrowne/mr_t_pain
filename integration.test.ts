import { processSensorPacket } from '../utils/packetDecoder';
import { MockQueueService } from '../services/queueService';

/**
 * Integration tests validate the end-to-end packet processing flow
 * 
 * These tests ensure that the entire packet processing pipeline works correctly,
 * from decoding to queueing, which helps catch issues that unit tests might miss
 * at the boundaries between components.
 */
describe('Packet Processing Integration', () => {
  let queueService: MockQueueService;
  
  beforeEach(() => {
    queueService = new MockQueueService();
    // Spy on the enqueue method
    jest.spyOn(queueService, 'enqueue');
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  test('should process packet and enqueue decoded data', async () => {
    // Given
    const hexPacket = '490500002e7cf90905007d000c000f00';
    
    // When
    await processSensorPacket(hexPacket, queueService);
    
    // Then
    expect(queueService.enqueue).toHaveBeenCalledTimes(1);
    expect(queueService.enqueue).toHaveBeenCalledWith({
      message_id: 1353,
      sensor_id: 167345198,
      sensor_type: 5,
      data_type_id: 125,
      value1: 12,
      value2: 15
    });
  });
  
  test('should handle multiple packets in sequence', async () => {
    // Given
    const packet1 = '490500002e7cf90905007d000c000f00';
    const packet2 = '4a0500002e7cf90905007d000e001100';
    
    // When
    await processSensorPacket(packet1, queueService);
    await processSensorPacket(packet2, queueService);
    
    // Then
    expect(queueService.enqueue).toHaveBeenCalledTimes(2);
    
    // Verify first call
    expect(queueService.enqueue).toHaveBeenNthCalledWith(1, {
      message_id: 1353,
      sensor_id: 167345198,
      sensor_type: 5,
      data_type_id: 125,
      value1: 12,
      value2: 15
    });
    
    // Verify second call
    expect(queueService.enqueue).toHaveBeenNthCalledWith(2, {
      message_id: 1354,
      sensor_id: 167345198,
      sensor_type: 5,
      data_type_id: 125,
      value1: 14,
      value2: 17
    });
  });
  
  test('should reject with error for invalid packet', async () => {
    // Given
    const invalidPacket = '4a05000';
    
    // Then
    await expect(processSensorPacket(invalidPacket, queueService))
      .rejects.toThrow();
    expect(queueService.enqueue).not.toHaveBeenCalled();
  });
});