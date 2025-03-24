/**
 * Represents the structure of a decoded sensor packet
 * 
 * This interface maps directly to the C struct definition provided in the
 * requirements, ensuring type safety when working with decoded data.
 */
export interface SensorPacket {
  message_id: number;
  sensor_id: number;
  sensor_type: number;
  data_type_id: number;
  value1: number;
  value2: number;
}