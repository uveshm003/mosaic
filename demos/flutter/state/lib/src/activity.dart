import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class ProviderEvent {
  ProviderEvent(this.provider, this.from, this.to, this.at);

  final String provider;
  final String from;
  final String to;
  final DateTime at;
}

/// What happened, kept outside Riverpod so the visualiser can watch Riverpod
/// without changing it. Listeners hear about events after the current frame.
class Activity extends ChangeNotifier {
  final events = <ProviderEvent>[];
  final lastUpdate = <String, DateTime>{};
  final updates = <String, int>{};
  var _scheduled = false;

  void record(String provider, Object? from, Object? to) {
    final now = DateTime.now();
    events.insert(
      0,
      ProviderEvent(provider, describe(from), describe(to), now),
    );
    if (events.length > 40) events.removeLast();
    lastUpdate[provider] = now;
    updates[provider] = (updates[provider] ?? 0) + 1;
    // Riverpod reports updates mid-build; tell the UI once things settle.
    if (!_scheduled) {
      _scheduled = true;
      scheduleMicrotask(() {
        _scheduled = false;
        notifyListeners();
      });
    }
  }

  void reset() {
    events.clear();
    lastUpdate.clear();
    updates.clear();
    notifyListeners();
  }
}

String describe(Object? value) => switch (value) {
  final double d => d.toStringAsFixed(2),
  final Map<Object?, Object?> m when m.isEmpty => '{}',
  final Map<Object?, Object?> m =>
    '{${m.entries.map((e) => '${e.key}: ${e.value}').join(', ')}}',
  final Enum e => e.name,
  _ => '$value',
};

/// Feeds provider updates into [activity].
final class ActivityObserver extends ProviderObserver {
  const ActivityObserver(this.activity);

  final Activity activity;

  @override
  void didUpdateProvider(
    ProviderObserverContext context,
    Object? previousValue,
    Object? newValue,
  ) {
    final name = context.provider.name;
    if (name != null) activity.record(name, previousValue, newValue);
  }
}
