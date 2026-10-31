import 'dart:async';

import 'package:demo_kit/demo_kit.dart';
import 'package:flutter/material.dart';

import 'scope.dart';

/// The app's own connection and the commands waiting for it: offline-first, like
/// field apps that lose signal.
class SyncPage extends StatefulWidget {
  const SyncPage({super.key});

  @override
  State<SyncPage> createState() => _SyncPageState();
}

class _SyncPageState extends State<SyncPage> {
  Timer? _syncing;
  var _total = 0;

  @override
  void dispose() {
    _syncing?.cancel();
    super.dispose();
  }

  void _sync() {
    final fleet = FleetScope.of(context);
    setState(() => _total = fleet.queue.length);
    _syncing = Timer.periodic(const Duration(milliseconds: 600), (timer) {
      if (!fleet.deliverNext()) {
        timer.cancel();
        setState(() => _syncing = null);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final fleet = FleetScope.of(context);
    final text = Theme.of(context).textTheme;
    final queue = fleet.queue;
    final syncing = _syncing != null;
    return PageBody(
      children: [
        Text('Sync', style: text.headlineSmall),
        Text(
          'Go offline, change a sensor’s settings, then reconnect and sync.',
          style: text.bodyMedium?.copyWith(color: DemoColors.muted),
        ),
        const SizedBox(height: 16),
        Card(
          child: SwitchListTile(
            secondary: Icon(
              fleet.online ? Icons.wifi : Icons.wifi_off,
              color: fleet.online ? DemoColors.mint : DemoColors.coral,
            ),
            title: Text(fleet.online ? 'Online' : 'Offline'),
            subtitle: Text(
              fleet.online
                  ? 'Commands are sent right away'
                  : 'Commands wait in the queue',
            ),
            value: fleet.online,
            onChanged: syncing ? null : fleet.setOnline,
          ),
        ),
        const SizedBox(height: 16),
        Row(
          children: [
            Expanded(
              child: Text('Queue (${queue.length})', style: text.titleMedium),
            ),
            FilledButton.icon(
              onPressed: fleet.online && queue.isNotEmpty && !syncing
                  ? _sync
                  : null,
              icon: const Icon(Icons.sync),
              label: const Text('Sync now'),
            ),
          ],
        ),
        const SizedBox(height: 8),
        if (syncing && _total > 0)
          Padding(
            padding: const EdgeInsets.only(bottom: 8),
            child: TweenAnimationBuilder<double>(
              tween: Tween(end: (_total - queue.length) / _total),
              duration: const Duration(milliseconds: 400),
              builder: (context, value, _) =>
                  LinearProgressIndicator(value: value),
            ),
          ),
        Card(
          child: queue.isEmpty
              ? const ListTile(
                  leading: Icon(Icons.done_all, color: DemoColors.mint),
                  title: Text('Nothing waiting'),
                )
              : Column(
                  children: [
                    for (final (i, c) in queue.indexed)
                      ListTile(
                        leading: Text(
                          '${i + 1}',
                          style: text.labelLarge?.copyWith(
                            color: DemoColors.muted,
                          ),
                        ),
                        title: Text(c.label),
                        subtitle: Text(c.device.site),
                        trailing: const Icon(Icons.schedule, size: 18),
                      ),
                  ],
                ),
        ),
      ],
    );
  }
}
