import 'dart:collection';
import 'dart:math';

import 'package:flutter/foundation.dart';

/// What a device reports. Thresholds are where an alert fires.
enum Metric {
  temperature('Temperature', '°C', 18, 34),
  humidity('Humidity', '%', 30, 70),
  battery('Battery', '%', 15, 100);

  const Metric(this.label, this.unit, this.low, this.high);

  final String label;
  final String unit;
  final double low;
  final double high;
}

enum DeviceStatus { ok, warning, offline }

class Device {
  Device({
    required this.id,
    required this.name,
    required this.site,
    required Map<Metric, double> start,
  }) : history = {
         for (final m in Metric.values) m: ListQueue.of([start[m]!]),
       };

  final String id;
  final String name;
  final String site;

  /// The last [Fleet.historyLength] readings per metric, oldest first.
  final Map<Metric, ListQueue<double>> history;

  /// A device stops reporting when it loses signal (or is switched off in the demo).
  bool reporting = true;
  var sampleRate = 1;

  double latest(Metric m) => history[m]!.last;

  bool outOfRange(Metric m) => latest(m) < m.low || latest(m) > m.high;

  DeviceStatus get status {
    if (!reporting) return DeviceStatus.offline;
    return Metric.values.any(outOfRange)
        ? DeviceStatus.warning
        : DeviceStatus.ok;
  }
}

class Alert {
  Alert(this.tick, this.device, this.metric, this.value);

  final int tick;
  final Device device;
  final Metric metric;
  final double value;
}

/// A change made in the app that must reach the device; queued while offline.
class Command {
  Command(this.device, this.label, this.apply);

  final Device device;
  final String label;
  final void Function() apply;
}

/// A simulated fleet of field sensors. Seeded, so tests and screenshots are stable.
class Fleet extends ChangeNotifier {
  Fleet({int seed = 7}) : _random = Random(seed) {
    final sites = ['North yard', 'Pump house', 'Depot B'];
    for (var i = 0; i < 6; i++) {
      devices.add(
        Device(
          id: 'SN-${(1040 + i * 17).toString()}',
          name: 'Sensor ${String.fromCharCode(65 + i)}',
          site: sites[i % sites.length],
          start: {
            Metric.temperature: 22 + _random.nextDouble() * 6,
            Metric.humidity: 40 + _random.nextDouble() * 15,
            Metric.battery: 60 + _random.nextDouble() * 40,
          },
        ),
      );
    }
  }

  static const historyLength = 40;

  final Random _random;
  final devices = <Device>[];
  final alerts = <Alert>[];
  final _queue = <Command>[];
  var tick = 0;

  /// Whether the app itself has a connection. Commands queue while it doesn't.
  bool online = true;

  List<Command> get queue => List.unmodifiable(_queue);

  /// Advances every reporting device by one reading: a small random walk, with an
  /// occasional spike so alerts happen.
  void step() {
    tick++;
    for (final device in devices.where((d) => d.reporting)) {
      for (final m in Metric.values) {
        final h = device.history[m]!;
        final drift = switch (m) {
          Metric.battery => -0.15 * device.sampleRate,
          _ => (_random.nextDouble() - 0.5) * 1.6,
        };
        final spike = m != Metric.battery && _random.nextDouble() < 0.03
            ? (_random.nextBool() ? 1 : -1) * (6 + _random.nextDouble() * 6)
            : 0.0;
        // Spikes recover: pull halfway back toward the middle of the range.
        final mid = (m.low + m.high) / 2;
        var next = h.last + drift + spike;
        if (m != Metric.battery &&
            (next < m.low || next > m.high) &&
            spike == 0) {
          next += (mid - next) * 0.5;
        }
        next = next.clamp(0, 100).toDouble();
        final wasOut = device.outOfRange(m);
        h.add(next);
        if (h.length > historyLength) h.removeFirst();
        if (!wasOut && device.outOfRange(m)) {
          alerts.insert(0, Alert(tick, device, m, next));
        }
      }
    }
    notifyListeners();
  }

  /// Sends [command] now, or queues it until the app is back online.
  void send(Command command) {
    if (online) {
      command.apply();
    } else {
      _queue.add(command);
    }
    notifyListeners();
  }

  void setOnline(bool value) {
    online = value;
    notifyListeners();
  }

  /// Delivers queued commands one at a time, oldest first. Returns false when
  /// there is nothing to deliver or no connection.
  bool deliverNext() {
    if (!online || _queue.isEmpty) return false;
    _queue.removeAt(0).apply();
    notifyListeners();
    return true;
  }

  void toggleReporting(Device device) => send(
    Command(
      device,
      device.reporting
          ? 'Switch ${device.name} off'
          : 'Switch ${device.name} on',
      () => device.reporting = !device.reporting,
    ),
  );

  void setSampleRate(Device device, int rate) => send(
    Command(
      device,
      'Set ${device.name} to ${rate}x sampling',
      () => device.sampleRate = rate,
    ),
  );

  void clearAlerts() {
    alerts.clear();
    notifyListeners();
  }
}
