import 'package:demo_kit/demo_kit.dart';
import 'package:flutter/material.dart';

import 'scope.dart';

class AlertsPage extends StatelessWidget {
  const AlertsPage({super.key});

  @override
  Widget build(BuildContext context) {
    final fleet = FleetScope.of(context);
    final text = Theme.of(context).textTheme;
    return PageBody(
      children: [
        Row(
          children: [
            Expanded(child: Text('Alerts', style: text.headlineSmall)),
            TextButton(
              onPressed: fleet.alerts.isEmpty ? null : fleet.clearAlerts,
              child: const Text('Clear'),
            ),
          ],
        ),
        Text(
          'A reading crossed its normal range.',
          style: text.bodyMedium?.copyWith(color: DemoColors.muted),
        ),
        const SizedBox(height: 16),
        if (fleet.alerts.isEmpty)
          const Card(
            child: ListTile(
              leading: Icon(Icons.check_circle_outline, color: DemoColors.mint),
              title: Text('All readings normal'),
            ),
          )
        else
          Card(
            child: Column(
              children: [
                for (final a in fleet.alerts.take(30))
                  ListTile(
                    leading: const Icon(
                      Icons.warning_amber_rounded,
                      color: DemoColors.coral,
                    ),
                    title: Text(
                      '${a.device.name}: ${a.metric.label.toLowerCase()} '
                      '${a.value.toStringAsFixed(1)}${a.metric.unit}',
                    ),
                    subtitle: Text(
                      '${a.device.site} · range ${a.metric.low.toStringAsFixed(0)}'
                      '–${a.metric.high.toStringAsFixed(0)}${a.metric.unit}',
                    ),
                    trailing: Text(
                      '${fleet.tick - a.tick}s ago',
                      style: text.labelSmall?.copyWith(color: DemoColors.muted),
                    ),
                  ),
              ],
            ),
          ),
      ],
    );
  }
}
