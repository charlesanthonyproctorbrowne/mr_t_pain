I would ideally, have a lot more other stuff added in. Snyk, SonarQube, eslint, PR into main, would have if we used githook actions, a .github/workflow directory with some `yml` files for trigger actions etc etc the basic standard requirements on a service.

---

* Delay on getting this over due to being busy (apologies).
* Tests missing - Ideally get them in.
* I don't usually work with bytes in JS, this hurt my brain. Thank you. I was fooled to think I just need to write some `Buffer` byte methods and get the output in the doc

---

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
│   ├── utils/      # Packet decoder logic
│   └── index.ts    # Application entry point
├── tests/          # Integration tests
├── Dockerfile      # Container definition
├── docker-compose.yml
└── package.json
```

## Installation

```bash
# Clone repository
git clone https://github.com/charlesanthonyproctorbrowne/mr_t_pain.git
cd packet-decoder

# Run via Docker
docker-compose up -d
```

## Testing

Should ideally build a container and run tests fully but don't have time sorry!

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
