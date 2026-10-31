import 'package:demo_kit/demo_kit.dart';
import 'package:flutter/material.dart';

import 'fleet.dart';

Color statusColor(DeviceStatus s) => switch (s) {
  DeviceStatus.ok => DemoColors.mint,
  DeviceStatus.warning => DemoColors.coral,
  DeviceStatus.offline => DemoColors.muted,
};

String statusLabel(DeviceStatus s) => switch (s) {
  DeviceStatus.ok => 'Normal',
  DeviceStatus.warning => 'Out of range',
  DeviceStatus.offline => 'Offline',
};

class StatusDot extends StatelessWidget {
  const StatusDot(this.status, {super.key});

  final DeviceStatus status;

  @override
  Widget build(BuildContext context) => Container(
    width: 8,
    height: 8,
    decoration: BoxDecoration(
      color: statusColor(status),
      shape: BoxShape.circle,
    ),
  );
}

String reading(Device d, Metric m) =>
    '${d.latest(m).toStringAsFixed(m == Metric.battery ? 0 : 1)}${m.unit}';
