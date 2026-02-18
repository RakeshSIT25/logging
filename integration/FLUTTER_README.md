# Integrating LogNexus with Flutter

To send logs from your Flutter application to the LogNexus backend, you can use the provided `LogNexus` utility class.

## 1. Add Dependencies

Add the `http` package to your `pubspec.yaml`:

```yaml
dependencies:
  flutter:
    sdk: flutter
  http: ^1.1.0 
```

Run `flutter pub get` to install.

## 2. Copy the Logger Utility

Copy the file `integration/flutter_logger.dart` into your Flutter project (e.g., `lib/utils/log_nexus.dart`).

## 3. Configure the Endpoint

Open the copied file and update the `_baseUrl` constant:

```dart
// For Android Emulator: 10.0.2.2
// For iOS Simulator: localhost
// For Real Device: Your computer's LAN IP address (e.g., 192.168.1.x)
static const String _baseUrl = 'http://10.0.2.2:5000/api/logs'; 
static const String _serviceName = 'my-flutter-app';
```

## 4. Usage

Import the class and use the static methods provided:

```dart
import 'utils/log_nexus.dart';

// Info Log
LogNexus.info('User logged in', {'userId': 'user_123'});

// Warning Log
LogNexus.warn('API response slower than expected', {'latency': '500ms'});

// Error Log
try {
  throw Exception('Something went wrong!');
} catch (e, stack) {
  LogNexus.error('Failed to process payment', e, stack, {'amount': 99.99});
}
```

## Network Troubleshooting (Android)

If you are running on the Android Emulator and cannot connect to `localhost`, ensure you use `10.0.2.2` instead. If that fails, ensure your backend server is actually running and accessible.

To test connectivity on an emulator, you can use `adb shell`:
```bash
adb shell curl http://10.0.2.2:5000/health
```
If this returns a JSON response, your connection is good.
