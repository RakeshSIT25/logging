import 'dart:convert';
import 'package:http/http.dart' as http;

/// Sends frontend logs to the backend, which forwards them to LogNexus when configured.
/// Fire-and-forget: never throws; failures are ignored so logging never breaks the app.
class LogNexusService {
  LogNexusService._();

  // Updated to point to the correct Backend URL (Port 5000)
  static String get _baseUrl {
    try {
      final uri = Uri.base;
      // If running locally in development (often port > 8000 for Flutter Web), point to backend
      if (uri.host == 'localhost' && uri.port > 8000) {
        return 'http://localhost:5000/api'; // Changed 3000 -> 5000
      }
    } catch (_) {}
    // In production, assume it's served from the same origin or proxied
    return '/api'; 
  }

  /// Sends a log entry to the backend (then to LogNexus). Does not throw.
  static void log(
    String level, {
    required String message,
    Map<String, dynamic>? meta,
  }) {
    // Added 'service' field to identify the source
    final payload = <String, dynamic>{
      'service': 'flutter-app', // Default service name
      'level': level,
      'message': message,
      if (meta != null && meta.isNotEmpty) 'meta': meta,
    };
    
    // Updated endpoint from /client-logs to /logs to match the backend route
    final uri = Uri.parse('$_baseUrl/logs'); 
    
    http
        .post(
          uri,
          headers: {'Content-Type': 'application/json'},
          body: json.encode(payload),
        )
        .catchError((_) => http.Response('', 204));
  }

  static void info(String message, {Map<String, dynamic>? meta}) =>
      log('info', message: message, meta: meta);
  static void warn(String message, {Map<String, dynamic>? meta}) =>
      log('warn', message: message, meta: meta);
  static void error(String message, {Map<String, dynamic>? meta}) =>
      log('error', message: message, meta: meta);
  static void debug(String message, {Map<String, dynamic>? meta}) =>
      log('debug', message: message, meta: meta);
}
