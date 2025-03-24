import { decodeSensorPacket } from './packetDecoder';
import { SensorPacket } from '../models/types';

describe('Packet Decoder', () => {
  /**
   * These tests validate the binary packet decoder against known examples
   * 
   * Testing against predetermined inputs and outputs ensures that our
   * decoding logic correctly interprets the binary format according to
   * the sensor's specification
   */
  test('should correctly decode packet 1', () => {
    // Given
    const hexPacket = '490500002e7cf90905007d000c000f00';
    
    // When
    const result = decodeSensorPacket(hexPacket);
    
    // Then
    const expected: SensorPacket = {
      message_id: 1353,
      sensor_id: 167345198,
      sensor_type: 5,
      data_type_id: 125,
      value1: 12,
      value2: 15
    };
    
    expect(result).toEqual(expected);
  });

  test('should correctly decode packet 2', () => {
    // Given
    const hexPacket = '4a0500002e7cf90905007d000e001100';
    
    // When
    const result = decodeSensorPacket(hexPacket);
    
    // Then
    const expected: SensorPacket = {
      message_id: 1354,
      sensor_id: 167345198,
      sensor_type: 5,
      data_type_id: 125,
      value1: 14,
      value2: 17
    };
    
    expect(result).toEqual(expected);
  });

  test('should throw an error for malformed packet', () => {
    // Given
    const invalidPacket = '4a05000';
    
    // Then
    expect(() => decodeSensorPacket(invalidPacket)).toThrow();
  });

  test('should handle empty packet', () => {
    // Given
    const emptyPacket = '';
    
    // Then
    expect(() => decodeSensorPacket(emptyPacket)).toThrow();
  });
});