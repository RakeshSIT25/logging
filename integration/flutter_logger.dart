import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter/foundation.dart'; // For kReleaseMode and kIsWeb

class LogNexus {
  // CONFIGURATION
  // IMPORTANT: For Android Emulator, use '10.0.2.2'. For iOS Simulator or Web, use 'localhost'.
  // For verify on real device, use your machine's LAN IP address (e.g. 192.168.1.50).
  static const String _baseUrl = 'http://10.0.2.2:5000/api/logs'; 
  static const String _serviceName = 'flutter-mobile-app';

  /// Log an INFO message
  static Future<void> info(String message, [Map<String, dynamic>? meta]) async {
    await _send('info', message, meta);
  }

  /// Log a WARNING message
  static Future<void> warn(String message, [Map<String, dynamic>? meta]) async {
    await _send('warn', message, meta);
  }

  /// Log an ERROR message
  static Future<void> error(String message, [dynamic error, StackTrace? stackTrace, Map<String, dynamic>? meta]) async {
    final Map<String, dynamic> combinedMeta = meta ?? {};
    if (error != null) {
      combinedMeta['error'] = error.toString();
    }
    if (stackTrace != null) {
      combinedMeta['stackTrace'] = stackTrace.toString();
    }
    await _send('error', message, combinedMeta);
  }

  /// Log a DEBUG message
  static Future<void> debug(String message, [Map<String, dynamic>? meta]) async {
    // Optionally disable debug logs in release mode
    if (kReleaseMode) return;
    await _send('debug', message, meta);
  }

  /// Internal method to send the log to the backend
  static Future<void> _send(String level, String message, [Map<String, dynamic>? meta]) async {
    try {
      final payload = {
        'service': _serviceName,
        'level': level,
        'message': message,
        'meta': {
          ...?meta,
          'platform': defaultTargetPlatform.toString(), // e.g., TargetPlatform.android
          'timestamp': DateTime.now().toIso8601String(),
        }
      };

      // Print to console for local debugging
      debugPrint('[LogNexus] $level: $message');

      final response = await http.post(
        Uri.parse(_baseUrl),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(payload),
      );

      if (response.statusCode != 201 && response.statusCode != 200) {
        debugPrint('Failed to send log to LogNexus: ${response.statusCode} ${response.body}');
      }
    } catch (e) {
      // Fallback: simple print if network fails
      debugPrint('Error sending log to LogNexus: $e');
    }
  }
}
