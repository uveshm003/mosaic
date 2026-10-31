import 'package:device_dashboard/src/fleet.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  test('the same seed gives the same readings', () {
    final a = Fleet()
      ..step()
      ..step();
    final b = Fleet()
      ..step()
      ..step();
    expect(
      a.devices.map((d) => d.latest(Metric.temperature)),
      b.devices.map((d) => d.latest(Metric.temperature)),
    );
  });

  test('history keeps a fixed window', () {
    final fleet = Fleet();
    for (var i = 0; i < Fleet.historyLength + 10; i++) {
      fleet.step();
    }
    for (final d in fleet.devices) {
      expect(d.history[Metric.humidity]!.length, Fleet.historyLength);
    }
  });

  test('alerts fire when a reading leaves its range', () {
    final fleet = Fleet();
    for (var i = 0; i < 400; i++) {
      fleet.step();
    }
    expect(fleet.alerts, isNotEmpty);
    for (final alert in fleet.alerts) {
      final m = alert.metric;
      expect(alert.value < m.low || alert.value > m.high, isTrue);
    }
  });

  test('offline commands queue and apply in order once back online', () {
    final fleet = Fleet()..setOnline(false);
    final device = fleet.devices.first;
    fleet
      ..setSampleRate(device, 4)
      ..toggleReporting(device);
    expect(fleet.queue.map((c) => c.label), [
      'Set Sensor A to 4x sampling',
      'Switch Sensor A off',
    ]);
    expect(device.sampleRate, 1);
    expect(fleet.deliverNext(), isFalse);

    fleet.setOnline(true);
    expect(fleet.deliverNext(), isTrue);
    expect(device.sampleRate, 4);
    expect(device.reporting, isTrue);
    expect(fleet.deliverNext(), isTrue);
    expect(device.reporting, isFalse);
    expect(device.status, DeviceStatus.offline);
    expect(fleet.deliverNext(), isFalse);
  });

  test('a device that is off stops reporting', () {
    final fleet = Fleet();
    final device = fleet.devices.first;
    fleet.toggleReporting(device);
    final before = device.history[Metric.temperature]!.length;
    fleet.step();
    expect(device.history[Metric.temperature]!.length, before);
  });
}
