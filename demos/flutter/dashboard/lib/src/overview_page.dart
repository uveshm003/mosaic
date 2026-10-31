import 'package:demo_kit/demo_kit.dart';
import 'package:flutter/material.dart';

import 'chart.dart';
import 'detail.dart';
import 'fleet.dart';
import 'scope.dart';
import 'widgets.dart';

/// Every device at a glance. Wide screens show the selected device beside the grid;
/// phones open it as its own screen.
class OverviewPage extends StatefulWidget {
  const OverviewPage({super.key});

  @override
  State<OverviewPage> createState() => _OverviewPageState();
}

class _OverviewPageState extends State<OverviewPage> {
  Device? _selected;

  @override
  Widget build(BuildContext context) {
    final fleet = FleetScope.of(context);
    return LayoutBuilder(
      builder: (context, box) {
        final split = box.maxWidth >= 960;
        final selected = _selected ?? fleet.devices.first;
        final grid = _Grid(
          selected: split ? selected : null,
          onOpen: (device) {
            if (split) {
              setState(() => _selected = device);
            } else {
              Navigator.of(context).push(
                MaterialPageRoute(
                  builder: (_) => FleetScope(
                    fleet: fleet,
                    child: Scaffold(
                      appBar: AppBar(title: Text(device.name)),
                      body: DeviceDetail(device: device),
                    ),
                  ),
                ),
              );
            }
          },
        );
        if (!split) return grid;
        return Row(
          children: [
            Expanded(flex: 3, child: grid),
            const VerticalDivider(width: 1),
            Expanded(flex: 2, child: DeviceDetail(device: selected)),
          ],
        );
      },
    );
  }
}

class _Grid extends StatelessWidget {
  const _Grid({required this.selected, required this.onOpen});

  final Device? selected;
  final ValueChanged<Device> onOpen;

  @override
  Widget build(BuildContext context) {
    final fleet = FleetScope.of(context);
    final text = Theme.of(context).textTheme;
    final counts = {
      for (final s in DeviceStatus.values)
        s: fleet.devices.where((d) => d.status == s).length,
    };
    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        Wrap(
          spacing: 8,
          runSpacing: 8,
          crossAxisAlignment: WrapCrossAlignment.center,
          children: [
            for (final s in DeviceStatus.values)
              Chip(
                avatar: StatusDot(s),
                label: Text('${counts[s]} ${statusLabel(s).toLowerCase()}'),
              ),
            const Chip(
              avatar: Icon(Icons.science_outlined, size: 16),
              label: Text('Simulated data'),
            ),
          ],
        ),
        const SizedBox(height: 16),
        LayoutBuilder(
          builder: (context, box) {
            final columns = (box.maxWidth / 260).floor().clamp(1, 3);
            return GridView.count(
              crossAxisCount: columns,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              mainAxisSpacing: 12,
              crossAxisSpacing: 12,
              childAspectRatio: 1.35,
              children: [
                for (final d in fleet.devices)
                  _DeviceCard(
                    device: d,
                    selected: d == selected,
                    onTap: () => onOpen(d),
                  ),
              ],
            );
          },
        ),
        const SizedBox(height: 12),
        Text(
          'Readings update every second. Tap a sensor for its history and controls.',
          style: text.bodySmall?.copyWith(color: DemoColors.muted),
        ),
      ],
    );
  }
}

class _DeviceCard extends StatelessWidget {
  const _DeviceCard({
    required this.device,
    required this.selected,
    required this.onTap,
  });

  final Device device;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final text = Theme.of(context).textTheme;
    final status = device.status;
    return Card(
      clipBehavior: Clip.antiAlias,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: BorderSide(color: selected ? DemoColors.mint : DemoColors.line),
      ),
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(14),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  StatusDot(status),
                  const SizedBox(width: 8),
                  Expanded(child: Text(device.name, style: text.titleSmall)),
                  Text(
                    device.site,
                    style: text.labelSmall?.copyWith(color: DemoColors.muted),
                  ),
                ],
              ),
              const SizedBox(height: 6),
              AnimatedOpacity(
                duration: const Duration(milliseconds: 300),
                opacity: status == DeviceStatus.offline ? 0.4 : 1,
                child: Text(
                  reading(device, Metric.temperature),
                  style: text.headlineSmall?.copyWith(
                    color: device.outOfRange(Metric.temperature)
                        ? DemoColors.coral
                        : null,
                    fontFeatures: const [FontFeature.tabularFigures()],
                  ),
                ),
              ),
              Expanded(
                child: Padding(
                  padding: const EdgeInsets.symmetric(vertical: 6),
                  child: LineChart(
                    values: device.history[Metric.temperature]!.toList(),
                    low: Metric.temperature.low,
                    high: Metric.temperature.high,
                    compact: true,
                  ),
                ),
              ),
              Text(
                '${reading(device, Metric.humidity)} humidity · '
                '${reading(device, Metric.battery)} battery',
                style: text.labelSmall?.copyWith(color: DemoColors.muted),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
