import 'dart:async';

import 'package:demo_kit/demo_kit.dart';
import 'package:flutter/material.dart';

import 'src/alerts_page.dart';
import 'src/fleet.dart';
import 'src/overview_page.dart';
import 'src/scope.dart';
import 'src/sync_page.dart';

void main() => runApp(const DeviceDashboard());

class DeviceDashboard extends StatefulWidget {
  const DeviceDashboard({super.key, this.live = true});

  /// Tests drive the fleet by hand instead of on a timer.
  final bool live;

  @override
  State<DeviceDashboard> createState() => _DeviceDashboardState();
}

class _DeviceDashboardState extends State<DeviceDashboard> {
  final fleet = Fleet();
  Timer? _clock;

  @override
  void initState() {
    super.initState();
    // Start with some history so the charts aren't empty.
    for (var i = 0; i < Fleet.historyLength; i++) {
      fleet.step();
    }
    if (widget.live) {
      _clock = Timer.periodic(const Duration(seconds: 1), (_) => fleet.step());
    }
  }

  @override
  void dispose() {
    _clock?.cancel();
    fleet.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return FleetScope(
      fleet: fleet,
      child: MaterialApp(
        title: 'Device dashboard',
        debugShowCheckedModeBanner: false,
        theme: demoTheme(),
        home: DemoShell(
          title: 'Device dashboard',
          pages: [
            DemoPage(
              label: 'Overview',
              icon: Icons.sensors,
              builder: (_) => const OverviewPage(),
            ),
            DemoPage(
              label: 'Alerts',
              icon: Icons.notifications_outlined,
              builder: (_) => const AlertsPage(),
            ),
            DemoPage(
              label: 'Sync',
              icon: Icons.sync,
              builder: (_) => const SyncPage(),
            ),
          ],
        ),
      ),
    );
  }
}
