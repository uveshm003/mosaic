import 'package:demo_kit/demo_kit.dart';
import 'package:flutter/material.dart';

import 'chart.dart';
import 'fleet.dart';
import 'scope.dart';
import 'widgets.dart';

/// One device: its history per metric and the commands you can send it.
class DeviceDetail extends StatefulWidget {
  const DeviceDetail({super.key, required this.device});

  final Device device;

  @override
  State<DeviceDetail> createState() => _DeviceDetailState();
}

class _DeviceDetailState extends State<DeviceDetail> {
  var _metric = Metric.temperature;

  void _send(Fleet fleet, void Function() action) {
    final wasOnline = fleet.online;
    action();
    if (!wasOnline) {
      ScaffoldMessenger.of(context)
        ..hideCurrentSnackBar()
        ..showSnackBar(
          const SnackBar(
            content: Text('Offline: queued, and sent when you reconnect.'),
          ),
        );
    }
  }

  @override
  Widget build(BuildContext context) {
    final fleet = FleetScope.of(context);
    final device = widget.device;
    final text = Theme.of(context).textTheme;
    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        Row(
          children: [
            StatusDot(device.status),
            const SizedBox(width: 8),
            Text(statusLabel(device.status), style: text.labelLarge),
            const Spacer(),
            Text(
              '${device.id} · ${device.site}',
              style: text.labelMedium?.copyWith(color: DemoColors.muted),
            ),
          ],
        ),
        const SizedBox(height: 16),
        SegmentedButton<Metric>(
          segments: [
            for (final m in Metric.values)
              ButtonSegment(value: m, label: Text(m.label)),
          ],
          selected: {_metric},
          showSelectedIcon: false,
          onSelectionChanged: (s) => setState(() => _metric = s.first),
        ),
        const SizedBox(height: 16),
        Text(
          reading(device, _metric),
          style: text.displaySmall?.copyWith(
            fontFeatures: const [FontFeature.tabularFigures()],
          ),
        ),
        Text(
          'Normal range ${_metric.low.toStringAsFixed(0)}–'
          '${_metric.high.toStringAsFixed(0)}${_metric.unit}, '
          'last ${Fleet.historyLength} readings',
          style: text.bodySmall?.copyWith(color: DemoColors.muted),
        ),
        const SizedBox(height: 12),
        SizedBox(
          height: 200,
          child: LineChart(
            values: device.history[_metric]!.toList(),
            low: _metric.low,
            high: _metric.high,
          ),
        ),
        const SizedBox(height: 24),
        Text('Controls', style: text.titleMedium),
        const SizedBox(height: 8),
        SwitchListTile(
          contentPadding: EdgeInsets.zero,
          title: const Text('Reporting'),
          subtitle: const Text('Switch the sensor on or off'),
          value: device.reporting,
          onChanged: (_) => _send(fleet, () => fleet.toggleReporting(device)),
        ),
        const SizedBox(height: 8),
        Text('Sampling rate', style: text.bodyLarge),
        const SizedBox(height: 8),
        SegmentedButton<int>(
          segments: const [
            ButtonSegment(value: 1, label: Text('1x')),
            ButtonSegment(value: 2, label: Text('2x')),
            ButtonSegment(value: 4, label: Text('4x')),
          ],
          selected: {device.sampleRate},
          showSelectedIcon: false,
          onSelectionChanged: (s) =>
              _send(fleet, () => fleet.setSampleRate(device, s.first)),
        ),
        const SizedBox(height: 6),
        Text(
          'Faster sampling drains the battery faster.',
          style: text.bodySmall?.copyWith(color: DemoColors.muted),
        ),
      ],
    );
  }
}
