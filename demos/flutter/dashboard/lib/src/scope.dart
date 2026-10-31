import 'package:flutter/widgets.dart';

import 'fleet.dart';

/// Hands the fleet to every screen and rebuilds them when it changes.
class FleetScope extends InheritedNotifier<Fleet> {
  const FleetScope({super.key, required Fleet fleet, required super.child})
    : super(notifier: fleet);

  static Fleet of(BuildContext context) =>
      context.dependOnInheritedWidgetOfExactType<FleetScope>()!.notifier!;
}
