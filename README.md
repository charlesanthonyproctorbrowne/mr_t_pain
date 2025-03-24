# Sensor Packet Decoder

A TypeScript application that decodes binary sensor packet data and places it into a Redis queue for further processing.

## Features

- Decodes binary packet data from hexadecimal strings
- Converts to structured JSON format following the specified C struct
- Queues processed data to Redis
- Includes test suite
- Docker containerization

## Project Structure

```
packet-decoder/
├── src/
│   ├── models/     # Type definitions
│   ├── services/   # Queue service implementations
│   │   ├── tests
│   ├── utils/      # Packet decoder logic
│   └── index.ts    # Application entry point
├── tests/          # Integration tests
├── Dockerfile      # Container definition
├── docker-compose.yml
└── package.json
```

## Requirements

- Node.js 18+
- npm or yarn
- Docker and Docker Compose (for containerized deployment)

## Installation

```bash
# Clone repository
git clone https://github.com/yourusername/packet-decoder.git
cd packet-decoder

# Run via Docker
docker-compose up -d
```

## Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage
```

## Example Packet Format

The application decodes binary packets that conform to the following C struct:

```c
typedef struct
{
  uint16_t message_id;
  uint32_t sensor_id;
  uint16_t sensor_type;
  uint16_t data_type_id;
  uint16_t value1;
  uint16_t value2;
} SensorPacket;
```

### Example Packet Data

```
Packet1: 490500002e7cf90905007d000c000f00
Packet2: 4a0500002e7cf90905007d000e001100
```

When decoded, these packets produce:

```json
// Packet 1
{
  "message_id": 1353,
  "sensor_id": 167345198,
  "sensor_type": 5,
  "data_type_id": 125,
  "value1": 12,
  "value2": 15
}

// Packet 2
{
  "message_id": 1354,
  "sensor_id": 167345198,
  "sensor_type": 5,
  "data_type_id": 125,
  "value1": 14,
  "value2": 17
}
```

## Design Choices

- **Functional Programming Approach**: Pure functions with clear inputs and outputs
- **Dependency Injection**: Loose coupling between components
- **Interface Segregation**: Clean interfaces for queue implementation
- **Error Handling**: Robust error handling throughout the application
- **Redis for Queuing**: Lightweight, high-performance message queue
